-- Schema, RLS and the public map view. Paste into the Supabase SQL Editor and run.
-- anon may only INSERT into registrations/map_subscribers and SELECT settings/public_map_points.

begin;

create type registration_status as enum ('pending', 'approved', 'rejected');
create type access_type as enum ('stairs', 'elevator', 'both');

create table registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status registration_status not null default 'pending',
  names text not null check (char_length(names) between 1 and 200),
  phone text not null check (char_length(phone) between 9 and 20),
  street text not null check (char_length(street) between 1 and 100),
  building_number text not null check (char_length(building_number) between 1 and 10),
  entrance text check (char_length(entrance) <= 10),
  floor text check (char_length(floor) <= 10),
  apartment text check (char_length(apartment) <= 10),
  access_type access_type not null,
  door_color text check (char_length(door_color) <= 50),
  door_sign text check (char_length(door_sign) <= 100),
  access_notes text check (char_length(access_notes) <= 500),
  -- rough box around Bat Galim / western Haifa, catches pins dropped far off
  lat numeric(9, 6) not null check (lat between 32.80 and 32.86),
  lng numeric(9, 6) not null check (lng between 34.95 and 35.02),
  osm_link text generated always as (
    'https://www.openstreetmap.org/?mlat=' || lat::text || '&mlon=' || lng::text
    || '#map=19/' || lat::text || '/' || lng::text
  ) stored,
  guidelines_ack boolean not null check (guidelines_ack),
  map_consent boolean not null check (map_consent)
);

create table map_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  contact text not null check (char_length(contact) between 5 and 100),
  consent_to_contact boolean not null check (consent_to_contact)
);

-- single row: the primary key can only be true
create table settings (
  id boolean primary key default true check (id),
  map_published boolean not null default false
);
insert into settings default values;

-- Runs with owner privileges (no security_invoker) on purpose, so anon can read it
-- without SELECT on registrations. Supabase's linter flags this; expected for this view.
-- Keep the column list to map fields only.
create view public_map_points as
  select id, lat, lng, street, building_number, entrance, floor, apartment,
         access_type, door_color, door_sign, access_notes
  from registrations
  where status = 'approved'
    and map_consent
    and (select map_published from settings);

alter table registrations enable row level security;
alter table map_subscribers enable row level security;
alter table settings enable row level security;

revoke all on registrations, map_subscribers, settings, public_map_points from anon, authenticated;
grant insert on registrations, map_subscribers to anon;
grant select on settings, public_map_points to anon;

create policy "anon registers as pending" on registrations
  for insert to anon with check (status = 'pending');
create policy "anon subscribes" on map_subscribers
  for insert to anon with check (true);
create policy "anon reads settings" on settings
  for select to anon using (true);

commit;
