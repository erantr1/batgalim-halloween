"use client";

import * as L from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import { event } from "@/config/event";
import { createMap, glyphs, numbered } from "@/lib/map";

// The columns of the public_map_points view.
export type Point = {
  id: string;
  lat: number;
  lng: number;
  street: string;
  building_number: string;
  entrance: string | null;
  floor: string | null;
  apartment: string | null;
  access_type: keyof typeof event.map.accessTypes | null; // null for activities
  door_color: string | null;
  door_sign: string | null;
  access_notes: string | null;
  kind: keyof typeof event.register.kinds;
  description: string | null; // the activity
  building_entry: string | null;
  names: string;
};

const t = event.map;

// How to reach a home, besides its description: for its pin's popup and its place in the list.
function details(h: Point) {
  const where = (["entrance", "floor", "apartment"] as const).filter((k) => h[k]).map((k) => `${t.labels[k]} ${h[k]}`);
  if (h.access_type) where.push(t.accessTypes[h.access_type]);
  const door = (["door_color", "door_sign"] as const).filter((k) => h[k]).map((k) => `${t.labels[k]}: ${h[k]}`);
  return [
    h.names && `${t.labels.names}: ${h.names}`,
    where.join(" · "),
    h.building_entry && `${t.labels.building_entry}: ${h.building_entry}`,
    door.join(" · "),
    h.access_notes,
  ].filter((line): line is string => !!line);
}

function add(parent: HTMLElement, text: string, className = "") {
  const div = document.createElement("div");
  div.textContent = text;
  div.className = className;
  parent.append(div);
}

// Hosts write this text themselves, so it goes in with textContent, never as HTML.
function popup(homes: Point[]) {
  const el = document.createElement("div");
  el.dir = "rtl";
  el.className = "flex flex-col gap-3 font-sans text-base";
  add(el, `${homes[0].street} ${homes[0].building_number}`, "font-bold");
  for (const h of homes) {
    const home = document.createElement("div");
    if (h.description) add(home, h.description, "font-medium");
    for (const line of details(h)) add(home, line);
    el.append(home);
  }
  return el;
}

// One marker per building and kind, so homes in the same building don't hide each other.
// Sorted by street and number: pins are numbered in this order, and the list follows it.
function byBuilding(points: Point[]) {
  const buildings: Record<string, Point[]> = {};
  for (const p of points) (buildings[`${p.street} ${p.building_number} ${p.kind}`.replace(/\s+/g, " ").trim()] ??= []).push(p);
  return Object.entries(buildings)
    .sort(([a], [b]) => a.localeCompare(b, "he", { numeric: true }))
    .map(([, homes]) => homes);
}

export default function MapView({ points }: { points: Point[] }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [locateError, setLocateError] = useState(false);
  const buildings = useMemo(() => byBuilding(points), [points]);

  useEffect(() => {
    const el = container.current!;
    const m = createMap(el);
    buildings.forEach((homes, i) => {
      L.marker([homes[0].lat, homes[0].lng], { icon: numbered(homes[0].kind, i + 1) })
        .bindPopup(popup(homes), { maxHeight: 300 })
        .addTo(m);
    });
    if (points.length) m.fitBounds(L.latLngBounds(points.map((p) => L.latLng(p.lat, p.lng))), { padding: [40, 40], maxZoom: 17 });

    // "You are here": only after the button is tapped, so nobody gets a location prompt on page load.
    let me: L.CircleMarker | null = null;
    m.on("locationfound", (e) => {
      setLocateError(false);
      if (me) me.setLatLng(e.latlng);
      else {
        me = L.circleMarker(e.latlng, { radius: 8, color: "white", weight: 2, fillColor: "#2563eb", fillOpacity: 1 }).addTo(m);
        m.panTo(e.latlng);
      }
    });
    m.on("locationerror", () => setLocateError(true));

    // Printing lays the page out again for the paper. Keep the map at its size on screen, where its
    // tiles are already loaded; a new size would print before the missing tiles arrive.
    const freeze = () => {
      el.style.width = `${el.offsetWidth}px`;
      el.style.height = `${el.offsetHeight}px`;
    };
    const thaw = () => {
      el.style.width = el.style.height = "";
    };
    addEventListener("beforeprint", freeze);
    addEventListener("afterprint", thaw);

    map.current = m;
    return () => {
      removeEventListener("beforeprint", freeze);
      removeEventListener("afterprint", thaw);
      m.remove(); // also stops watching the location
      map.current = null;
    };
  }, [buildings, points]);

  return (
    <div className="flex flex-col gap-3">
      <div ref={container} dir="ltr" className="h-[70svh] max-h-[600px] w-full rounded-lg" />
      <button
        type="button"
        onClick={() => map.current?.stopLocate().locate({ watch: true, enableHighAccuracy: true })}
        className="flex min-h-12 w-full items-center justify-center rounded-xl border border-stone-600 px-4 font-medium print:hidden"
      >
        {t.locate}
      </button>
      {locateError && (
        <p role="alert" className="text-red-400 print:hidden">
          {t.locateError}
        </p>
      )}
      {/* For kids without a phone: the map on the first page, the list from the second. */}
      <button
        type="button"
        onClick={() => window.print()}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-stone-600 px-4 font-medium print:hidden"
      >
        <span aria-hidden>🖨️</span>
        {t.print}
      </button>
      {buildings.length > 0 && (
        <section className="mt-4 flex flex-col gap-3 print:break-before-page">
          <h2 className="text-2xl font-bold">{t.listTitle}</h2>
          <ol className="flex list-decimal flex-col gap-3 ps-6">
            {buildings.map((homes) => (
              <li key={homes[0].id} className="break-inside-avoid">
                <p className="font-bold">
                  {glyphs[homes[0].kind]} {homes[0].street} {homes[0].building_number}
                </p>
                {homes.map((h) => (
                  <div key={h.id} className="mt-1">
                    {h.description && <p className="font-medium">{h.description}</p>}
                    {details(h).map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                ))}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
