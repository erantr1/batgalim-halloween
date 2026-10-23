-- Seeing the map needs a registration (decided 23.10). Every host and viewer row carries a random
-- access_key that the browser keeps in a cookie. anon can no longer read public_map_points directly,
-- only through map_points(viewer), which checks the key. Setting a row to 'rejected' closes its access.
-- Also adds building_entry: how to get into the building (intercom, a phone to call), never a code.

begin;

alter table registrations
  add column access_key uuid not null unique default gen_random_uuid(),
  add column building_entry text check (char_length(building_entry) <= 100);

alter table map_subscribers
  add column status registration_status not null default 'approved',
  add column access_key uuid not null unique default gen_random_uuid();

drop policy "anon subscribes" on map_subscribers;
create policy "anon subscribes as approved" on map_subscribers
  for insert to anon with check (status = 'approved');

create or replace view public_map_points as
  select id, lat, lng, street, building_number, entrance, floor, apartment,
         access_type, door_color, door_sign, access_notes, kind, description, building_entry
  from registrations
  where status = 'approved' and map_consent and (select map_published from settings);

-- Owner privileges, like the view: it reads registrations and map_subscribers for anon.
create function map_points(viewer uuid) returns setof public_map_points
  language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from map_subscribers where access_key = viewer and status <> 'rejected')
     and not exists (select 1 from registrations where access_key = viewer and status <> 'rejected') then
    raise exception 'not registered' using errcode = '28000';
  end if;
  return query select * from public_map_points;
end $$;

revoke select on public_map_points from anon;
revoke all on function map_points(uuid) from public, anon, authenticated;
grant execute on function map_points(uuid) to anon;

commit;
