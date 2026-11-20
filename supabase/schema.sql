-- Gamut Phase 2. Run in Supabase: SQL Editor > New query > paste > Run.
create table palettes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  colors text[] not null check (array_length(colors, 1) between 2 and 8),
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);
alter table palettes enable row level security;
create policy "owner manages own palettes" on palettes for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "anyone can read public palettes" on palettes for select using (is_public);
