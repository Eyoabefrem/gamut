-- Gamut Phase 3. Run AFTER schema.sql (Phase 2): SQL Editor > New query > paste > Run.

alter table palettes add column if not exists like_count int not null default 0;

create table likes (
  palette_id uuid not null references palettes on delete cascade,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (palette_id, user_id)
);
alter table likes enable row level security;
create policy "read own likes" on likes for select using (user_id = auth.uid());
create policy "like public palettes" on likes for insert
  with check (user_id = auth.uid() and exists (select 1 from palettes p where p.id = palette_id and p.is_public));
create policy "remove own like" on likes for delete using (user_id = auth.uid());

-- The counter is changed only by this trigger, never by a user.
create function bump_likes() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update palettes set like_count = like_count + 1 where id = new.palette_id;
  else
    update palettes set like_count = greatest(like_count - 1, 0) where id = old.palette_id;
  end if;
  return null;
end $$;
create trigger likes_count after insert or delete on likes for each row execute function bump_likes();

-- Owners may edit their palette's content, but not its like count or owner.
revoke insert, update on palettes from anon, authenticated;
grant insert (name, colors, is_public) on palettes to authenticated;
grant update (name, is_public) on palettes to authenticated;
