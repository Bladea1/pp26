-- Авторизация: запускать ПОСЛЕ schema.sql
-- В Supabase Dashboard → Authentication → Providers включите Email

-- Профиль при регистрации (id = auth.users.id)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
  suffix int := 0;
begin
  base_username := lower(
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'username'), ''),
      split_part(new.email, '@', 1)
    )
  );
  base_username := regexp_replace(base_username, '[^a-z0-9._-]', '', 'g');
  if base_username = '' then
    base_username := 'lab_user';
  end if;

  final_username := base_username;
  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || '_' || suffix::text;
  end if;

  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    final_username,
    coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'), ''), final_username),
    null
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Связь profiles.id с auth (для уже существующей таблицы без FK)
-- Новые пользователи получают id = auth.uid()

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "users read own profile private fields" on public.profiles;
-- чтение всех профилей уже открыто в schema.sql
