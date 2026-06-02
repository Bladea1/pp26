import { hasSupabaseEnv } from "@/lib/config";
import { createServerClient } from "@/lib/supabase/server";
import { mapProject } from "@/lib/supabase/mappers";

async function getProjectRowId(slug) {
  const supabase = await createServerClient();
  const { data } = await supabase.from("projects").select("id").eq("slug", slug).maybeSingle();
  return data?.id ?? null;
}

async function attachProjectFiles(project, dbId) {
  if (!dbId) return project;
  const supabase = await createServerClient();
  const { data } = await supabase.from("project_files").select("*").eq("project_id", dbId);
  if (!data?.length) return project;
  return {
    ...project,
    files: data.map((f) => ({
      name: f.name,
      type: f.file_type,
      size: f.file_size,
      url: f.file_url
    }))
  };
}

export async function fetchProjects() {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, profiles:owner_id(username)")
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) => mapProject(row, row.profiles?.username ?? "lab"));
}

export async function fetchProjectBySlug(slug) {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, profiles:owner_id(username)")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;

  const mapped = mapProject(data, data.profiles?.username ?? "lab");
  return attachProjectFiles(mapped, data.id);
}

export async function fetchReagentsForProject(projectSlug) {
  if (!hasSupabaseEnv()) return [];

  const dbId = await getProjectRowId(projectSlug);
  if (!dbId) return [];

  const supabase = await createServerClient();
  const { data } = await supabase.from("reagents").select("*").eq("project_id", dbId);

  return (
    data?.map((r) => ({
      id: r.id,
      projectId: projectSlug,
      title: r.title,
      author: r.author_name ?? "—",
      type: r.reagent_type,
      body: r.body,
      image: r.result_url ?? "/assets/card-noise.jpg"
    })) ?? []
  );
}

export async function fetchObservationsForProject(projectSlug) {
  if (!hasSupabaseEnv()) return [];

  const dbId = await getProjectRowId(projectSlug);
  if (!dbId) return [];

  const supabase = await createServerClient();
  const { data } = await supabase.from("observations").select("*").eq("project_id", dbId);

  return (
    data?.map((o) => ({
      id: o.id,
      projectId: projectSlug,
      author: o.author_name ?? "—",
      body: o.body
    })) ?? []
  );
}

export async function fetchTimelineForProject(projectSlug) {
  if (!hasSupabaseEnv()) return [];

  const dbId = await getProjectRowId(projectSlug);
  if (!dbId) return [];

  const supabase = await createServerClient();
  const { data } = await supabase
    .from("mutation_history")
    .select("*")
    .eq("project_id", dbId)
    .order("created_at", { ascending: true });

  return (
    data?.map((h) => ({
      projectId: projectSlug,
      text: h.event_text,
      date: h.event_date ?? ""
    })) ?? []
  );
}

export async function fetchSimilarProjects(projectSlug, limit = 3) {
  const all = await fetchProjects();
  return all.filter((p) => p.id !== projectSlug).slice(0, limit);
}
