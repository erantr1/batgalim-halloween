"use client";

import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { useEffect, useRef } from "react";
import { event } from "@/config/event";

export type Pin = [number, number];

const pumpkin = L.divIcon({ html: "🎃", className: "text-3xl leading-8 text-center", iconSize: [32, 32] });

// Plain Leaflet, not react-leaflet: Next hides visited pages with <Activity>, which runs effect
// cleanups, so the map is removed on hide and rebuilt here when the page is shown again.
export default function PinPicker({ pin, onChange }: { pin: Pin | null; onChange: (pin: Pin) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);

  useEffect(() => {
    const m = L.map(container.current!).setView(event.map.center, event.map.zoom);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m);
    m.on("click", (e) => onChange([e.latlng.lat, e.latlng.lng]));
    map.current = m;
    return () => {
      m.remove();
      map.current = marker.current = null;
    };
  }, [onChange]);

  useEffect(() => {
    if (!map.current || !pin) return;
    if (marker.current) marker.current.setLatLng(pin);
    else marker.current = L.marker(pin, { icon: pumpkin }).addTo(map.current);
  }, [pin]);

  return <div ref={container} dir="ltr" className="h-72 w-full rounded-lg" />;
}
