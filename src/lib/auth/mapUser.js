/** Профиль БД → формат UI профиля */
export function mapProfileToCurrentUser(profile) {
  const username = profile.username ?? "user";
  const initials = username.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "??";

  return {
    id: profile.id,
    username,
    displayId: (profile.display_name ?? username).toUpperCase().replace(/\s+/g, "_"),
    initials,
    rank: profile.rank_title ?? "Лаборант",
    score: profile.mutation_score ?? 0,
    scoreMax: 2400,
    avatar: profile.avatar_url ?? "/assets/profile-avatar.jpg",
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    experiments: profile.experiments_count ?? 0,
    reactions: profile.reactions_count ?? 0,
    saved: profile.saved_count ?? 0,
    mutationLevel: Math.min(100, profile.mutation_score ?? 0),
    email: profile.email ?? null
  };
}
