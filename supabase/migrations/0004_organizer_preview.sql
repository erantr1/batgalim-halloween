-- Organizers can see the map before it's published (decided 24.10). Register as a viewer on the phone,
-- then set organizer = true on that map_subscribers row in the Table Editor. anon can't set it.
-- The published gate moves from the view into map_points(): anon has had no direct access to the
-- view since 0003, so the function is the only way in.

begin;

alter table map_subscribers add column organizer boolean not null default false;

drop policy "anon subscribes as approved" on map_subscribers;
create policy "anon subscribes as approved" on map_subscribers
  for insert to anon with check (status = 'approved' and not organizer);

create or replace view public_map_points as
  select id, lat, lng, street, building_number, entrance, floor, apartment,
         access_type, door_color, door_sign, access_notes, kind, description, building_entry
  from registrations
  where status = 'approved' and map_consent;

create or replace function map_points(viewer uuid) returns setof public_map_points
  language plpgsql stable security definer set search_path = public as $$
declare
  organizer_key boolean;
begin
  -- null when the key isn't on any row that isn't rejected
  select bool_or(organizer) into organizer_key from (
    select organizer from map_subscribers where access_key = viewer and status <> 'rejected'
    union all
    select false from registrations where access_key = viewer and status <> 'rejected'
  ) keys;
  if organizer_key is null then
    raise exception 'not registered' using errcode = '28000';
  end if;
  if not organizer_key and not (select map_published from settings) then
    -- PTxyz sets PostgREST's HTTP status (403); a regular "not in prerequisite state" code would be a 500
    raise sqlstate 'PT403' using message = 'not published';
  end if;
  return query select * from public_map_points;
end $$;

commit;
