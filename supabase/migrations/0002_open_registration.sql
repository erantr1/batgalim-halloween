-- Paste into the Supabase SQL Editor (there is no Supabase CLI).
--
-- 1. No approval step: registrations go straight to the map. Organizers hide one by setting
--    status = 'rejected' in the Table Editor.
-- 2. Hosts offer treats at home or an activity (a maze in the yard, potions in the garden...).
--    Activities need a description and don't need an access type.

begin;

alter table registrations alter column status set default 'approved';
drop policy "anon registers as pending" on registrations;
create policy "anon registers as approved" on registrations
  for insert to anon with check (status = 'approved');

create type registration_kind as enum ('home', 'activity');

alter table registrations
  add column kind registration_kind not null default 'home',
  add column description text check (char_length(description) between 1 and 300),
  alter column access_type drop not null,
  add constraint access_type_for_homes check (kind = 'activity' or access_type is not null),
  add constraint description_for_activities check (kind = 'home' or description is not null);

-- Same view, two columns added at the end. Still owner privileges on purpose (see 0001).
create or replace view public_map_points as
  select id, lat, lng, street, building_number, entrance, floor, apartment,
         access_type, door_color, door_sign, access_notes, kind, description
  from registrations
  where status = 'approved'
    and map_consent
    and (select map_published from settings);

commit;
