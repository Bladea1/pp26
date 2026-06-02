-- Запись в БД (запускать ПОСЛЕ schema.sql и auth.sql)

drop policy if exists "auth insert projects" on public.projects;
create policy "auth insert projects"
  on public.projects for insert
  to authenticated
  with check (auth.uid() = owner_id);

drop policy if exists "auth update own projects" on public.projects;
create policy "auth update own projects"
  on public.projects for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "auth insert reagents" on public.reagents;
create policy "auth insert reagents"
  on public.reagents for insert
  to authenticated
  with check (auth.uid() = author_id);

drop policy if exists "auth insert observations" on public.observations;
create policy "auth insert observations"
  on public.observations for insert
  to authenticated
  with check (auth.uid() = author_id);

drop policy if exists "auth insert mutation history" on public.mutation_history;
create policy "auth insert mutation history"
  on public.mutation_history for insert
  to authenticated
  with check (
    exists (select 1 from public.projects p where p.id = project_id)
  );
