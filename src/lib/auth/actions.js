"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/config";

function safeNext(path) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/profile";
  if (path.startsWith("/login") || path.startsWith("/register")) return "/profile";
  return path;
}

export async function signInAction(prevState, formData) {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase не настроен. Добавьте ключи в .env.local" };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? "/profile"));

  if (!email || !password) {
    return { error: "Введите email и пароль" };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message === "Invalid login credentials" ? "Неверный email или пароль" : error.message };
  }

  redirect(next);
}

export async function signUpAction(prevState, formData) {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase не настроен. Добавьте ключи в .env.local" };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const next = safeNext(String(formData.get("next") ?? "/profile"));

  if (!email || !password) {
    return { error: "Заполните email и пароль" };
  }
  if (password.length < 6) {
    return { error: "Пароль не короче 6 символов" };
  }
  if (!username || username.length < 3) {
    return { error: "Имя пользователя — минимум 3 символа (латиница, цифры, точка)" };
  }

  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, display_name: username }
    }
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    redirect(next);
  }

  return {
    success:
      "Аккаунт создан. Если включено подтверждение email — проверьте почту, затем войдите."
  };
}

export async function signOutAction() {
  if (hasSupabaseEnv()) {
    const supabase = await createServerClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
