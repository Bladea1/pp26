import { hasSupabaseEnv } from "@/lib/config";
import { createServerClient } from "@/lib/supabase/server";
import { mapJournalPost } from "@/lib/supabase/mappers";

export async function fetchJournalPosts() {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapJournalPost);
}

export async function fetchJournalPost(slug) {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createServerClient();
  const { data } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return null;
  return mapJournalPost(data);
}
