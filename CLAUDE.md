@AGENTS.md

# Bat Galim Halloween

Web app for the Bat Galim (Haifa) neighborhood Halloween on **31.10.2026**. Trick-or-treat runs 17:00–19:00 (changed from 18:00–20:00 on 24.10). The after-party was cancelled (decided 24.10).

**Hard deadline: 25.10.2026.** Prefer the simplest thing that works. Don't add features, abstractions or dependencies that aren't listed here without asking.

## Who uses it

- **Hosts**: neighbors who register their home as a trick-or-treat stop, or an activity.
- **Viewers** (families, neighbors, visitors from Kiryat Eliezer): register with a name and contact to open the map on the evening. Hosts get in with their host registration.
- **Organizers**: hide registrations and viewers in the Supabase dashboard. There is no admin UI.

Almost everyone is on a phone. Design mobile-first.

## Stack

- Next.js (App Router), TypeScript, Tailwind. Read AGENTS.md: this Next.js version may differ from what you know.
- Cache Components is enabled. Map data and the published flag must be fresh on every request; don't let them be cached at build time.
- Supabase (Postgres + row-level security) via `@supabase/supabase-js` with the anon/publishable key. There is no user auth, so no `@supabase/ssr`.
- Leaflet (plain, no react-leaflet) with OpenStreetMap tiles. No API keys. react-leaflet removes its map when Next hides a visited page (Cache Components keeps pages mounted in `<Activity>`) and never rebuilds it; plain Leaflet built in a `useEffect` and removed in its cleanup rebuilds on return.
- Deployed on Vercel (Hobby) from GitHub. Every push gets a preview URL.

Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Keep `.env.example` in sync; real values live in `.env.local` (gitignored).

## Hebrew and RTL

- All UI text is Hebrew. Root layout: `<html lang="he" dir="rtl">`.
- Use logical Tailwind classes (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`), never `ml-`/`mr-`/`pl-`/`pr-`/`left-`/`right-`.
- Use a Google font with Hebrew glyphs (Rubik or Heebo via `next/font/google`, subsets `hebrew` + `latin`). Geist has no Hebrew.

## Config, not hardcoding

All event-specific content lives in one file, `config/event.ts`: Hebrew copy and guidelines, date, time window, map center and zoom, external links. Components read from it. Nothing about Bat Galim is hardcoded inside components.

Use generic names in the database and code (`location`, `access_notes`, `display_label`, `status`) rather than Halloween-specific ones. The code may later be reused for other projects (e.g. volunteer food delivery). That is the only reuse prep: no multi-tenancy, translation framework, form builder or admin UI.

## Privacy and security rules (non-negotiable)

1. **Never collect door/entry codes.** No field for them anywhere. `building_entry` is for an intercom or a phone to call, and its hint says not to write the code (decided 23.10).
2. **Two separate required checkboxes** on the host form: (a) acknowledging the guidelines, including decorating the door so it's recognizable; (b) consent to having the address and door description shown on the event map. Store both.
3. **Registrations go straight to the map: `status` defaults to `approved`** (no approval step, decided 20.10). The anon INSERT policy only allows `approved`. Organizers hide a registration by setting `status = 'rejected'` in the Supabase Table Editor, and scan the list before publishing the map.
4. **RLS on every table.** The anon role may INSERT into `registrations` and `map_subscribers` (never with `organizer = true`), SELECT from `settings`, and EXECUTE `map_points`. Nothing else: no SELECT, UPDATE or DELETE on `registrations` or `map_subscribers`, and no direct SELECT on `public_map_points`.
5. **The map reads only through `map_points(viewer)`**, which returns the `public_map_points` view's rows only for a known `access_key` whose row isn't `rejected` (decided 23.10). Each host and viewer registration generates the key in the browser and keeps it in the `access_key` cookie; once the map is published, `/map` shows people without a valid key the viewer form instead of the map. Viewer rows with `organizer = true` (set by hand in the Table Editor) see the map before it's published, with a preview banner (decided 24.10). Setting a row to `rejected` closes its map access. The view exposes map fields only and filters to `status = 'approved' AND map_consent`. Never phone numbers, contact details or anything else organizer-only. Host names are shown, earlier registrations included (decided 28.10). The view and the function intentionally run with owner privileges (no `security_invoker`, `security definer`) so anon can use them without SELECT on the base tables. Keep the view's column list minimal. Supabase's linter will flag it; that is expected.
6. **`access_notes` and `description` are free text shown publicly.** With no approval step, organizers read them before publishing the map and hide anything wrong. The form's helper text says they will appear on the map.
7. **Never use the service_role/secret key** in client code, in `NEXT_PUBLIC_*` vars, or anywhere in this app.
8. **The map stays dark until organizers publish it.** A single-row `settings` table holds `map_published` (default false). `map_points` returns rows only when it is true (except for organizer keys), and `/map` shows "the map will be published on 31.10" while it is false. Organizers flip it on the afternoon of 31.10. The gate lives in the database, not only in the page, because the anon key is public and anyone could query the view directly.
9. **Add `noindex`** to the whole site.
10. **After the event (1.11):** set `map_published` to false and delete all rows from `registrations` and `map_subscribers`.

Before calling the database work done, verify with the anon key that:
- selecting from `registrations` and `map_subscribers` returns an empty list;
- selecting from `public_map_points` directly is denied;
- `map_points` with an unknown or rejected key fails, and with a valid non-organizer key fails while `map_published` is false;
- with an organizer key it returns rows even while `map_published` is false, and anon can't insert `organizer = true`;
- with it true, it returns only approved, consented rows with the allowed columns.

## Data model (starting point)

`registrations`
- `id` uuid, `created_at`, `status` (`pending` | `approved` | `rejected`, default `approved`)
- `kind` (`home` | `activity`, default `home`): a home handing out treats, or an activity (a maze in the yard, potions in the garden)
- `description`: what the activity is (required for activities)
- `names`: host names, shown on the map (decided 28.10)
- `phone`: host phone, required (organizer-only), so organizers can verify before approving
- `street` (picked from a fixed list of Bat Galim streets in `config/event.ts`), `building_number`, `entrance`, `floor`, `apartment`
- `building_entry`: intercom or a phone to call, never the code
- `access_type` (`ground` | `stairs` | `elevator` | `both`), required for homes only
- `door_color`, `door_sign`, `access_notes`
- `lat`, `lng`: from a pin the host drops on a small map in the form (more reliable than geocoding)
- `osm_link`: generated OpenStreetMap link from `lat`/`lng`, so organizers can check the pin from the Table Editor
- `guidelines_ack` boolean, `map_consent` boolean (both must be true)
- `access_key` uuid: lets the host into the map

`public_map_points` (view): `id`, `lat`, `lng`, `street`, `building_number`, `entrance`, `floor`, `apartment`, `access_type`, `door_color`, `door_sign`, `access_notes`, `kind`, `description`, `building_entry`, `names`.

`map_subscribers`
- `id`, `created_at`, `name`, `contact` (phone or email), `consent_to_contact` boolean, `status` (default `approved`), `access_key` uuid, `organizer` boolean (default false; set by hand, lets that viewer see the map before it's published)
- Viewers: a minimal registration to open the map. Collect only what organizers need to know who it is.

`settings`: a single row with `map_published` boolean, default false.

Schema, RLS policies and the view go in SQL files under `supabase/migrations/`, committed to the repo. There is no Supabase CLI: organizers paste each file into the SQL Editor.

## Pages

- `/`: event info and guidelines, with links to register, view the map, or get the map sent.
- `/register`: host form, for a home (treats) or an activity; the home page's two buttons choose which (`?kind=activity`), no toggle in the form. Guidelines appear above the form; the two checkboxes sit at the end.
- `/get-map`: viewer registration, the home page's third registration button.
- `/map`: the home page's top button. "Opens on 31.10" for everyone until `map_published`; then the map of approved homes (🎃) and activities (🕷️) for registered viewers and hosts, and the viewer form for everyone else. Tapping a pin shows the address and door or activity description. Pins are numbered, and a numbered list of all the places sits under the map; the print button prints the map on the first page and the list after it, for kids without a phone (decided 28.10).

## Leaflet gotchas

- Leaflet needs `window`. Map components are client components loaded with `next/dynamic` and `ssr: false`.
- Import `leaflet/dist/leaflet.css`.
- Default marker icons break under bundlers. Use a custom `divIcon` (a pumpkin works).

## Order of work

Each step should build and deploy on its own.

1. Root layout: RTL, Hebrew font, metadata, noindex, `config/event.ts`. Replace the template home page and remove the demo SVGs in `public/`.
2. Supabase migrations: tables, RLS, view, settings. Run the anon-key checks above.
3. `/register` form with pin drop, writing to `registrations`.
4. `/map`, gated by `map_published`.
5. `/get-map` sign-up.

Organizer export: use the Supabase Table Editor's CSV export. Don't build one. No SMS or email service.

## Commands

- `npm run dev`: local server at localhost:3000
- `npm run build`: must pass before a step is done
- `npm run lint`

Check every page at phone width before calling it done.

## Open questions (ask, don't guess)

- Link to the community file for allergen-free food (mentioned in the brief).

## Original brief (Hebrew)

בניית אפליקציה לחגיגות ההאלווין השכונתי בבת גלים
ממתק או ברדק - שעות שש עד שמונה ואז אירוע קהילתי בבר-גלים או בגינה הקהילתית

תאריך החגיגות: 31.10.
דדליין לאפליקציה: 25.10.

האפליקצה צריכה לכלול דף הרשמה קל ופשוט להבנה. בדף נבקש ממי שממלא:

1. שמות
2. כתובת - כולל קומה, דירה, קודן [בעייתי אבטחתית?], מדרגות/מעלית, צבע הדלת, שלט על הדלת, וכל דרך אחרת שתעזור להבין איך להגיע לדירה.
3. ליידע שצריך לקשט את הדלת או משהו כדי שיהיה ברור (קווים מנחים). שיסמנו שהבינו (אולי אפילו יכתבו מפורשות בטופס שהבינו).

דרך דף ההרשמה ניתן גם הנחיות כלליות:

1. ליידע שממתק או ברדק יהיה בשעות שש עד שמונה, ואחרי זה יהיה אירוע קהילתי (בבר גלים? בגינה הקהילתית?)
2. לערב את ילדים ביצירה. תחפושות חופשיות
3. נשמח לכיבוד ברוח החג (נניח שכולל אלמנטים של החג), בהכנה ביתית אם אפשר. אפשר לקבל השראה ורעיונות מפינטרסט.
4. אם הצלחתם להכין אוכל ללא אלרגנים, כתבו בקובץ הקהילות
5. כדי שלא יצטברו יותר מדי ממתקים, תהיה תיבת תרומות ממתקים במסיבה

תוצר: מפה פשוטה להתמצאות כדי שאנשים ידעו לאיזה בתים ללכת.

הערה: יהיו ילדים מקריית אליעזר אז צריך שאפשר יהיה להירשם לקבלת המפה גם בלי להיכנס למפה

(Decision since the brief: the door code is not collected.)
