import { hasSupabaseEnv } from "@/lib/config";
import { mapProfileToCurrentUser } from "@/lib/auth/mapUser";
import { platformSteps } from "@/lib/content/platform-steps";
import { createServerClient } from "@/lib/supabase/server";

const BADGE_ICONS = ["⚗", "☣", "▣", "◈"];
const ACTIVITY_ICONS = ["⚗", "☣", "▣", "◈"];

function rankBadge(score) {
  if (score >= 1800) return "☣";
  if (score >= 1200) return "▣";
  if (score >= 700) return "⚗";
  return "◈";
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "только что";
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "вчера";
  return `${days} дн назад`;
}

export async function fetchLabStats() {
  const empty = {
    mutationLevel: 0,
    openReagents: 0,
    status: "Стабильно",
    activeMutations: 0,
    participants: 0,
    reagentsAdded: 0,
    activityPercent: 0
  };

  if (!hasSupabaseEnv()) return empty;

  const supabase = await createServerClient();
  const [{ data: projects }, { count: reagentCount }, { count: profileCount }] = await Promise.all([
    supabase.from("projects").select("mutation_level, status").eq("is_archived", false),
    supabase.from("reagents").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true })
  ]);

  const rows = projects ?? [];
  const avgMutation = rows.length
    ? Math.round(rows.reduce((sum, p) => sum + (p.mutation_level ?? 0), 0) / rows.length)
    : 0;
  const activeMutations = rows.filter((p) =>
    ["unstable", "reaction", "mutating"].includes(p.status)
  ).length;

  return {
    mutationLevel: avgMutation,
    openReagents: reagentCount ?? 0,
    status: activeMutations > 3 ? "Нестабильно" : activeMutations > 0 ? "В реакции" : "Стабильно",
    activeMutations,
    participants: profileCount ?? 0,
    reagentsAdded: reagentCount ?? 0,
    activityPercent: Math.min(99, Math.max(12, avgMutation + activeMutations * 2))
  };
}

export async function fetchCurrentUser() {
  if (!hasSupabaseEnv()) return null;

  try {
    const supabase = await createServerClient();
    const {
      data: { user: authUser }
    } = await supabase.auth.getUser();

    if (!authUser) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    const [{ count: experiments }, { count: reactions }] = await Promise.all([
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", authUser.id),
      supabase
        .from("reagents")
        .select("*", { count: "exact", head: true })
        .eq("author_id", authUser.id)
    ]);

    const base = profile
      ? mapProfileToCurrentUser({
          ...profile,
          experiments_count: experiments ?? 0,
          reactions_count: reactions ?? 0
        })
      : mapProfileToCurrentUser({
          id: authUser.id,
          username:
            authUser.user_metadata?.username ??
            authUser.email?.split("@")[0] ??
            "user",
          display_name: authUser.user_metadata?.display_name,
          rank_title: "Лаборант",
          mutation_score: 0,
          experiments_count: experiments ?? 0,
          reactions_count: reactions ?? 0
        });

    return { ...base, email: authUser.email, isAuthenticated: true };
  } catch {
    return null;
  }
}

export async function fetchUsers() {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createServerClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, rank_title, mutation_score")
    .order("mutation_score", { ascending: false });

  if (!profiles?.length) return [];

  const users = await Promise.all(
    profiles.map(async (p) => {
      const [{ count: experiments }, { count: reagents }] = await Promise.all([
        supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("owner_id", p.id),
        supabase
          .from("reagents")
          .select("*", { count: "exact", head: true })
          .eq("author_id", p.id)
      ]);

      const initials =
        p.username.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "??";

      return {
        id: p.id,
        username: p.username,
        rank: p.rank_title ?? "Лаборант",
        score: p.mutation_score ?? 0,
        avatar: initials,
        experiments: experiments ?? 0,
        reagents: reagents ?? 0,
        mutation: Math.min(100, p.mutation_score ?? 0),
        badge: rankBadge(p.mutation_score ?? 0)
      };
    })
  );

  return users;
}

export async function fetchActivity() {
  const feed = await fetchActivityFeed();
  return feed.map((text, i) => ({
    icon: ACTIVITY_ICONS[i % ACTIVITY_ICONS.length],
    text
  }));
}

export async function fetchActivityTicker() {
  return fetchActivityFeed();
}

export async function fetchPlatformSteps() {
  return platformSteps;
}

export async function fetchProfileExtras(userId) {
  const empty = {
    profileReactions: [],
    favorites: [],
    chartStats: { labels: [], reactions: [], views: [] },
    badges: []
  };

  if (!hasSupabaseEnv() || !userId) return empty;

  const supabase = await createServerClient();

  const { data: reagents } = await supabase
    .from("reagents")
    .select("id, title, body, created_at, project_id")
    .eq("author_id", userId)
    .order("created_at", { ascending: false })
    .limit(6);

  const projectIds = [...new Set((reagents ?? []).map((r) => r.project_id).filter(Boolean))];
  let projectsById = {};
  if (projectIds.length) {
    const { data: linkedProjects } = await supabase
      .from("projects")
      .select("id, slug, title, cover_url")
      .in("id", projectIds);
    projectsById = Object.fromEntries((linkedProjects ?? []).map((p) => [p.id, p]));
  }

  const profileReactions =
    reagents?.map((r) => {
      const project = projectsById[r.project_id];
      return {
        id: r.id,
        projectId: project?.slug ?? "",
        projectTitle: project?.title ?? "Образец",
        image: project?.cover_url ?? "/assets/card-noise.jpg",
        text: r.body?.slice(0, 120) ?? r.title,
        time: formatRelativeTime(r.created_at)
      };
    }) ?? [];

  const { data: topProjects } = await supabase
    .from("projects")
    .select("slug, title, cover_url, likes, comments_count, profiles:owner_id(username)")
    .eq("is_archived", false)
    .order("likes", { ascending: false })
    .limit(3);

  const favorites =
    topProjects?.map((p) => ({
      id: p.slug,
      title: p.title,
      author: p.profiles?.username ?? "lab",
      image: p.cover_url ?? "/assets/card-noise.jpg",
      likes: p.likes ?? 0,
      comments: p.comments_count ?? 0
    })) ?? [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("mutation_score")
    .eq("id", userId)
    .maybeSingle();

  const score = profile?.mutation_score ?? 0;
  const badges = [
    { title: "Первый образец", icon: BADGE_ICONS[0] },
    { title: score >= 500 ? "Куратор сырья" : "Лаборант", icon: BADGE_ICONS[1] },
    { title: score >= 1200 ? "Архивариус" : "Наблюдатель", icon: BADGE_ICONS[2] },
    { title: score >= 1800 ? "Ночной сеанс" : "Новичок", icon: BADGE_ICONS[3] }
  ];

  const chartStats = {
    labels: ["нед. 1", "нед. 2", "нед. 3", "нед. 4"],
    reactions: [
      Math.max(1, Math.round(score * 0.02)),
      Math.max(2, Math.round(score * 0.04)),
      Math.max(3, Math.round(score * 0.06)),
      Math.max(4, Math.round(score * 0.08))
    ],
    views: [
      Math.max(5, Math.round(score * 0.05)),
      Math.max(8, Math.round(score * 0.08)),
      Math.max(12, Math.round(score * 0.1)),
      Math.max(16, Math.round(score * 0.12))
    ]
  };

  return { profileReactions, favorites, chartStats, badges };
}

export async function fetchProjectsByAuthor(username) {
  const { fetchProjects } = await import("./projects");
  const projects = await fetchProjects();
  return projects.filter((p) => p.author === username);
}

export async function fetchActivityFeed() {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createServerClient();
  const { data } = await supabase
    .from("activity_feed")
    .select("text")
    .order("created_at", { ascending: false })
    .limit(10);

  return data?.map((r) => r.text) ?? [];
}
