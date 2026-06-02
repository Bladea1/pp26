import { JOURNAL_BODIES } from "@/lib/journal/bodies";

const STATUS_STAMP = {
  raw: "СЫРОЙ",
  unstable: "НЕСТАБИЛЕН",
  reaction: "В РЕАКЦИИ",
  mutating: "МУТИРУЕТ",
  almost: "ПОЧТИ СТАБИЛЕН"
};

const COLOR_BY_STATUS = {
  raw: "white",
  unstable: "pink",
  reaction: "pink",
  mutating: "lime",
  almost: "lime"
};

export function mapProject(row, authorUsername = "unknown") {
  return {
    id: row.slug ?? row.id,
    number: row.sample_number ?? "—",
    title: row.title,
    subtitle: row.subtitle ?? "",
    author: authorUsername,
    category: row.category,
    status: row.status,
    stamp: row.stamp ?? STATUS_STAMP[row.status] ?? "СЫРОЙ",
    phase: row.phase ?? "",
    mutation: row.mutation_level ?? 0,
    views: row.views ?? 0,
    likes: row.likes ?? 0,
    comments: row.comments_count ?? row.comments ?? 0,
    description: row.description,
    missing: row.missing_items ?? [],
    tags: row.tags ?? [],
    color: row.theme ?? COLOR_BY_STATUS[row.status] ?? "dark",
    image: row.cover_url ?? "/assets/card-noise.jpg",
    collective: row.is_collective ?? false,
    help: row.needs_help ?? false,
    experimentDay: row.is_experiment_of_day ?? false,
    participants: row.participants ?? undefined,
    date: row.published_at ?? "",
    files: row.files ?? [],
    themes: row.themes,
    quote: row.quote
  };
}

export function mapJournalPost(row) {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    read: row.read_time ?? 5,
    stamp: row.stamp ?? "",
    image: row.cover_url ?? "/assets/journal-flower.jpg",
    excerpt: row.excerpt ?? "",
    body:
      Array.isArray(row.body) && row.body.length > 0
        ? row.body
        : JOURNAL_BODIES[row.slug] ?? [],
    date: row.published_at ?? "",
    author: row.author_name ?? ""
  };
}
