import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { event } from "@/config/event";
import { accessKeyCookie } from "@/lib/accessKey";
import { supabase } from "@/lib/supabase";
import MapClient from "./MapClient";
import type { Point } from "./MapView";
import SubscribeForm from "@/components/SubscribeForm";

const t = event.map;

export const metadata: Metadata = { title: t.title };

async function Homes() {
  // Read on every request, never at build.
  const key = (await cookies()).get(accessKeyCookie)?.value;
  // The gate lives in the database: map_points() checks the key, and returns no rows until map_published is true.
  const [settings, points] = await Promise.all([
    supabase.from("settings").select("map_published").single(),
    key ? supabase.rpc("map_points", { viewer: key }) : null,
  ]);
  // 28000: unknown key, or hidden by organizers; handled below
  if (settings.error || (points?.error && points.error.code !== "28000")) {
    console.error(settings.error ?? points?.error);
    return (
      <p role="alert" className="text-red-400">
        {t.error}
      </p>
    );
  }
  // Everyone sees this until organizers publish the map.
  if (!settings.data.map_published) return <p className="text-lg">{t.notPublished}</p>;
  // Then only hosts and registered viewers; everyone else registers right here (no key, an unknown
  // one, or hidden by organizers). Not a redirect: Next keeps visited pages mounted and would replay it.
  if (!points || points.error) return <Join />;

  return (
    <>
      <p>{points.data.length ? t.intro : t.empty}</p>
      <MapClient points={points.data as Point[]} />
    </>
  );
}

function Join() {
  return (
    <>
      <h2 className="text-2xl font-bold">{event.subscribe.title}</h2>
      <p className="text-lg">{event.subscribe.intro}</p>
      <SubscribeForm />
    </>
  );
}

export default function MapPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-8">
      <h1 className="text-3xl">{t.title}</h1>
      <Suspense fallback={<p>{t.loading}</p>}>
        <Homes />
      </Suspense>
    </main>
  );
}
