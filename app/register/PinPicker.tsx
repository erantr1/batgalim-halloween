"use client";

import * as L from "leaflet";
import { useEffect, useRef } from "react";
import { createMap, pumpkin } from "@/lib/map";

export type Pin = [number, number];

export default function PinPicker({ pin, onChange }: { pin: Pin | null; onChange: (pin: Pin) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);

  useEffect(() => {
    const m = createMap(container.current!);
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
