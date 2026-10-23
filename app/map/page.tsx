import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { event } from "@/config/event";
import { accessKeyCookie } from "@/lib/accessKey";
import { supabase } from "@/lib/supabase";
import MapClient from "./MapClient";
import type { Point } from "./MapView";
import SubscribeForm from "./SubscribeForm";

const t = event.map;

export const metadata: Metadata = { title: t.title };

async function Homes() {
  // Read on every request, never at build. Only hosts and registered viewers get in; everyone else
  // gets the viewer form right here. Not a redirect: Next keeps visited pages mounted and would replay it.
  const key = (await cookies()).get(accessKeyCookie)?.value;
  if (!key) return <SubscribeForm />;
  // The gate lives in the database: map_points() checks the key, and returns no rows until map_published is true.
  const [settings, points] = await Promise.all([
    supabase.from("settings").select("map_published").single(),
    supabase.rpc("map_points", { viewer: key }),
  ]);
  if (points.error?.code === "28000") return <SubscribeForm />; // unknown key, or hidden by organizers
  if (settings.error || points.error) {
    console.error(settings.error ?? points.error);
    return (
      <p role="alert" className="text-red-400">
        {t.error}
      </p>
    );
  }
  if (!settings.data.map_published) return <p className="text-lg">{t.notPublished}</p>;

  return (
    <>
      <p>{points.data.length ? t.intro : t.empty}</p>
      <MapClient points={points.data as Point[]} />
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
