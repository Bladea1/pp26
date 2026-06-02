"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/config";
import { slugify } from "@/lib/slug";
import { createServerClient } from "@/lib/supabase/server";

const STATUS_STAMP = {
  raw: "СЫРОЙ",
  unstable: "НЕСТАБИЛЕН",
  reaction: "В РЕАКЦИИ",
  mutating: "МУТИРУЕТ",
  almost: "ПОЧТИ СТАБИЛЕН"
};

const PHASE_BY_STATUS = {
  raw: "Фаза 01: Сырой образец",
  unstable: "Фаза 02: Первая реакция",
  reaction: "Фаза 02: Первая реакция",
  mutating: "Фаза 03: Мутация",
  almost: "Фаза 04: Стабилизация"
};

async function requireUser() {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase не настроен. Добавьте ключи в .env.local" };
  }
  const supabase = await createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Войдите в аккаунт", supabase: null, user: null };
  }
  return { supabase, user };
}

async function uniqueSlug(supabase, base) {
  let slug = base;
  let suffix = 0;
  for (;;) {
    const { data } = await supabase.from("projects").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}

export async function createProjectAction(_prev, formData) {
  const auth = await requireUser();
  if (auth.error) return { error: auth.error };
  const { supabase, user } = auth;

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const status = String(formData.get("status") ?? "raw").trim();
  const missingRaw = String(formData.get("missing") ?? "");
  const tagsRaw = String(formData.get("tags") ?? "");

  if (!title || !description) {
    return { error: "Заполните название и описание" };
  }
  if (!category) {
    return { error: "Выберите категорию" };
  }

  const missing = missingRaw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const tags = tagsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const baseSlug = await uniqueSlug(supabase, slugify(title));
  const now = new Date();
  const publishedAt = `${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()}`;

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      slug: baseSlug,
      owner_id: user.id,
      title,
      description,
      category,
      status,
      stamp: STATUS_STAMP[status] ?? "СЫРОЙ",
      phase: PHASE_BY_STATUS[status] ?? "Фаза 01: Сырой образец",
      mutation_level: 12,
      theme: "white",
      missing_items: missing,
      tags,
      cover_url: "/assets/card-noise.jpg",
      needs_help: true,
      published_at: publishedAt
    })
    .select("id, slug")
    .single();

  if (error) {
    return { error: error.message };
  }

  await supabase.from("mutation_history").insert({
    project_id: project.id,
    event_text: "Образец сдан в лабораторию",
    event_date: publishedAt
  });

  revalidatePath("/");
  revalidatePath("/catalog");
  redirect(`/projects/${project.slug}`);
}

export async function createReagentAction(_prev, formData) {
  const auth = await requireUser();
  if (auth.error) return { error: auth.error };
  const { supabase, user } = auth;

  const projectSlug = String(formData.get("projectSlug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const reagentType = String(formData.get("type") ?? "Визуал").trim();

  if (!projectSlug || !title || !body) {
    return { error: "Заполните все поля" };
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id, slug, cover_url")
    .eq("slug", projectSlug)
    .maybeSingle();

  if (!project) {
    return { error: "Образец не найден" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  const authorName = profile?.username ?? user.email?.split("@")[0] ?? "lab";

  const { error } = await supabase.from("reagents").insert({
    project_id: project.id,
    author_id: user.id,
    author_name: authorName,
    title,
    body,
    reagent_type: reagentType,
    result_url: project.cover_url ?? "/assets/card-noise.jpg"
  });

  if (error) {
    return { error: error.message };
  }

  const today = new Date();
  const eventDate = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}`;

  await supabase.from("mutation_history").insert({
    project_id: project.id,
    event_text: `Реактив: ${title}`,
    event_date: eventDate
  });

  revalidatePath(`/projects/${projectSlug}`);
  redirect(`/projects/${projectSlug}`);
}
