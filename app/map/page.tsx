import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { event } from "@/config/event";
import { supabase } from "@/lib/supabase";
import MapClient from "./MapClient";
import type { Point } from "./MapView";

const t = event.map;

export const metadata: Metadata = { title: t.title };

async function Homes() {
  await connection(); // the published flag and the homes are read on every request, never at build
  // The gate lives in the database: the view returns no rows until map_published is true.
  const [settings, points] = await Promise.all([
    supabase.from("settings").select("map_published").single(),
    supabase.from("public_map_points").select("*"),
  ]);
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
