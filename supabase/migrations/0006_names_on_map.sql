-- Host names go on the map, for registrations made before this too (decided 28.10). Phones stay organizer-only.
-- A view can only gain columns at its end. map_points() returns the view's rows, so it returns names too.

create or replace view public_map_points as
  select id, lat, lng, street, building_number, entrance, floor, apartment,
         access_type, door_color, door_sign, access_notes, kind, description, building_entry, names
  from registrations
  where status = 'approved' and map_consent;
