-- Лаборатория недоделанных проектов — схема v4
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  location text,
  role text default 'Лаборант',
  rank_title text default 'Лаборант',
  mutation_score int default 0,
  is_admin boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  sample_number text,
  owner_id uuid references public.profiles(id) on delete set null,
  title text not null,
  subtitle text,
  description text not null,
  category text not null,
  status text not null default 'raw',
  stamp text,
  phase text default 'Фаза 01: Сырой образец',
  mutation_level int default 10 check (mutation_level between 0 and 100),
  theme text default 'dark',
  missing_items text[] default '{}',
  tags text[] default '{}',
  themes text[] default '{}',
  quote text,
  cover_url text,
  views int default 0,
  likes int default 0,
  comments_count int default 0,
  is_collective boolean default false,
  is_archived boolean default false,
  needs_help boolean default true,
  is_experiment_of_day boolean default false,
  published_at text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  file_url text not null,
  file_type text,
  file_size text,
  created_at timestamptz default now()
);

create table if not exists public.reagents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text,
  title text not null,
  body text not null,
  reagent_type text not null default 'Визуал',
  intervention_type text default 'Дополнение',
  impact_score int default 10,
  acceptance_status text default 'candidate',
  result_url text,
  created_at timestamptz default now()
);

create table if not exists public.observations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists public.mutation_history (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  event_text text not null,
  event_date text,
  created_at timestamptz default now()
);

create table if not exists public.journal_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text default 'Истории',
  excerpt text,
  body jsonb not null default '[]',
  read_time int default 8,
  stamp text,
  cover_url text,
  author_name text,
  published_at text,
  created_at timestamptz default now()
);

create table if not exists public.activity_feed (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  href text,
  created_at timestamptz default now()
);

-- Публичное чтение для демо-анона (настройте RLS под auth позже)
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.reagents enable row level security;
alter table public.observations enable row level security;
alter table public.mutation_history enable row level security;
alter table public.journal_posts enable row level security;
alter table public.activity_feed enable row level security;
alter table public.project_files enable row level security;

create policy "public read profiles" on public.profiles for select using (true);
create policy "public read projects" on public.projects for select using (true);
create policy "public read reagents" on public.reagents for select using (true);
create policy "public read observations" on public.observations for select using (true);
create policy "public read history" on public.mutation_history for select using (true);
create policy "public read journal" on public.journal_posts for select using (true);
create policy "public read activity" on public.activity_feed for select using (true);
create policy "public read files" on public.project_files for select using (true);

create index if not exists projects_slug_idx on public.projects(slug);
create index if not exists projects_status_idx on public.projects(status);
create index if not exists journal_slug_idx on public.journal_posts(slug);
