export function getProject(id, list) {
  return list.find((p) => p.id === id) ?? null;
}

export function getProjectsByAuthor(username, list) {
  return list.filter((p) => p.author === username);
}

export function countByCategory(category, list) {
  if (category === "all") return list.length;
  return list.filter((p) => p.category === category).length;
}

export function countByStatus(status, list) {
  if (status === "all") return list.length;
  return list.filter((p) => p.status === status).length;
}
