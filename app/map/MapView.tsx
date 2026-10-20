"use client";

import * as L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { event } from "@/config/event";
import { createMap, icons } from "@/lib/map";

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
};

const t = event.map;

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
    const where = (["entrance", "floor", "apartment"] as const).filter((k) => h[k]).map((k) => `${t.labels[k]} ${h[k]}`);
    if (h.access_type) where.push(t.accessTypes[h.access_type]);
    if (where.length) add(home, where.join(" · "));
    const door = (["door_color", "door_sign"] as const).filter((k) => h[k]).map((k) => `${t.labels[k]}: ${h[k]}`);
    if (door.length) add(home, door.join(" · "));
    if (h.access_notes) add(home, h.access_notes);
    el.append(home);
  }
  return el;
}

// One marker per building and kind, so homes in the same building don't hide each other.
const building = (p: Point) => `${p.kind} ${p.street} ${p.building_number}`.replace(/\s+/g, " ").trim();

export default function MapView({ points }: { points: Point[] }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [locateError, setLocateError] = useState(false);

  useEffect(() => {
    const m = createMap(container.current!);
    const buildings: Record<string, Point[]> = {};
    for (const p of points) (buildings[building(p)] ??= []).push(p);
    for (const homes of Object.values(buildings)) {
      L.marker([homes[0].lat, homes[0].lng], { icon: icons[homes[0].kind] })
        .bindPopup(popup(homes), { maxHeight: 300 })
        .addTo(m);
    }
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

    map.current = m;
    return () => {
      m.remove(); // also stops watching the location
      map.current = null;
    };
  }, [points]);

  return (
    <div className="flex flex-col gap-3">
      <div ref={container} dir="ltr" className="h-[70svh] w-full rounded-lg" />
      <button
        type="button"
        onClick={() => map.current?.stopLocate().locate({ watch: true, enableHighAccuracy: true })}
        className="flex min-h-12 w-full items-center justify-center rounded-xl border border-stone-600 px-4 font-medium"
      >
        {t.locate}
      </button>
      {locateError && (
        <p role="alert" className="text-red-400">
          {t.locateError}
        </p>
      )}
    </div>
  );
}
