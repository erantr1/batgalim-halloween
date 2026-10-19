@AGENTS.md

# Bat Galim Halloween

Web app for the Bat Galim (Haifa) neighborhood Halloween on **31.10.2026**. Trick-or-treat runs 18:00–20:00, followed by a community event (location TBD: Bar Galim or the community garden).

**Hard deadline: 25.10.2026.** Prefer the simplest thing that works. Don't add features, abstractions or dependencies that aren't listed here without asking.

## Who uses it

- **Hosts**: neighbors who register their home as a trick-or-treat stop.
- **Families**: open the map on the evening to find participating homes.
- **Visitors from Kiryat Eliezer**: a parent leaves contact details to receive the map link, without opening the map.
- **Organizers**: approve registrations in the Supabase dashboard. There is no admin UI.

Almost everyone is on a phone. Design mobile-first.

## Stack

- Next.js (App Router), TypeScript, Tailwind. Read AGENTS.md: this Next.js version may differ from what you know.
- Cache Components is enabled. Map data and the published flag must be fresh on every request; don't let them be cached at build time.
- Supabase (Postgres + row-level security) via `@supabase/supabase-js` with the anon/publishable key. There is no user auth, so no `@supabase/ssr`.
- Leaflet + react-leaflet with OpenStreetMap tiles. No API keys.
- Deployed on Vercel (Hobby) from GitHub. Every push gets a preview URL.

Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Keep `.env.example` in sync; real values live in `.env.local` (gitignored).

## Hebrew and RTL

- All UI text is Hebrew. Root layout: `<html lang="he" dir="rtl">`.
- Use logical Tailwind classes (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`), never `ml-`/`mr-`/`pl-`/`pr-`/`left-`/`right-`.
- Use a Google font with Hebrew glyphs (Rubik or Heebo via `next/font/google`, subsets `hebrew` + `latin`). Geist has no Hebrew.

## Config, not hardcoding

All event-specific content lives in one file, `config/event.ts`: Hebrew copy and guidelines, date, time window, after-party location, map center and zoom, external links. Components read from it. Nothing about Bat Galim is hardcoded inside components.

Use generic names in the database and code (`location`, `access_notes`, `display_label`, `status`) rather than Halloween-specific ones. The code may later be reused for other projects (e.g. volunteer food delivery). That is the only reuse prep: no multi-tenancy, translation framework, form builder or admin UI.

## Privacy and security rules (non-negotiable)

1. **Never collect door/entry codes.** No field for them anywhere.
2. **Two separate required checkboxes** on the host form: (a) acknowledging the guidelines, including decorating the door so it's recognizable; (b) consent to having the address and door description shown on the event map. Store both.
3. **Registrations default to `status = 'pending'`.** Only organizers set `approved`, in the Supabase Table Editor.
4. **RLS on every table.** The anon role may INSERT into `registrations` and `map_subscribers`, and SELECT from `settings` and `public_map_points`. Nothing else: no SELECT, UPDATE or DELETE on `registrations` or `map_subscribers`.
5. **The map reads only from the `public_map_points` view**, which exposes map fields only and filters to `status = 'approved' AND map_consent`. Never names, contact details or anything organizer-only. The view intentionally runs with owner privileges (no `security_invoker`) so anon can read it without SELECT on the base table. Keep its column list minimal. Supabase's linter will flag it; that is expected for this one view.
6. **`access_notes` is free text shown publicly.** Organizers read it before approving. The form's helper text says it will appear on the map.
7. **Never use the service_role/secret key** in client code, in `NEXT_PUBLIC_*` vars, or anywhere in this app.
8. **The map stays dark until organizers publish it.** A single-row `settings` table holds `map_published` (default false). The view returns rows only when it is true, and `/map` shows "the map will be published on 31.10" while it is false. Organizers flip it on the afternoon of 31.10. The gate lives in the database, not only in the page, because the anon key is public and anyone could query the view directly.
9. **Add `noindex`** to the whole site.
10. **After the event (1.11):** set `map_published` to false and delete all rows from `registrations` and `map_subscribers`.

Before calling the database work done, verify with the anon key that:
- selecting from `registrations` and `map_subscribers` returns an empty list;
- `public_map_points` returns nothing while `map_published` is false;
- with it true, the view returns only approved, consented rows with the allowed columns.

## Data model (starting point)

`registrations`
- `id` uuid, `created_at`, `status` (`pending` | `approved` | `rejected`, default `pending`)
- `names`: host names (organizer-only)
- `street`, `building_number`, `entrance`, `floor`, `apartment`
- `access_type` (`stairs` | `elevator` | `both`)
- `door_color`, `door_sign`, `access_notes`
- `lat`, `lng`: from a pin the host drops on a small map in the form (more reliable than geocoding)
- `guidelines_ack` boolean, `map_consent` boolean (both must be true)

`public_map_points` (view): `id`, `lat`, `lng`, `street`, `building_number`, `entrance`, `floor`, `apartment`, `access_type`, `door_color`, `door_sign`, `access_notes`.

`map_subscribers`
- `id`, `created_at`, `name`, `contact` (phone or email), `consent_to_contact` boolean
- Filled in by a parent or guardian. Collect only what's needed to send the link.

`settings`: a single row with `map_published` boolean, default false.

Schema, RLS policies and the view go in SQL files under `supabase/migrations/`, committed to the repo.

## Pages

- `/`: event info and guidelines, with links to register, view the map, or get the map sent.
- `/register`: host form. Guidelines appear above the form; the two checkboxes sit at the end.
- `/map`: map of approved homes, gated by `map_published`. Tapping a pin shows the address and door description.
- `/get-map`: Kiryat Eliezer sign-up.

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

Organizer export: use the Supabase Table Editor's CSV export. Don't build one.

## Commands

- `npm run dev`: local server at localhost:3000
- `npm run build`: must pass before a step is done
- `npm run lint`

Check every page at phone width before calling it done.

## Open questions (ask, don't guess)

- After-party location: Bar Galim or the community garden?
- Should hosts give a phone number so organizers can verify them before approving?
- Link to the community file for allergen-free food (mentioned in the brief).
- How subscribers get the map link: organizers send it manually, or automated?

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
