"use client";

import * as L from "leaflet";
import { useEffect, useRef } from "react";
import { createMap, icons } from "@/lib/map";

export type Pin = [number, number];

type Props = { pin: Pin | null; onChange: (pin: Pin) => void; kind: keyof typeof icons };

export default function PinPicker({ pin, onChange, kind }: Props) {
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
    // Same icon as on the final map; kind can change while the pin stays (the page is kept mounted).
    if (marker.current) marker.current.setLatLng(pin).setIcon(icons[kind]);
    else marker.current = L.marker(pin, { icon: icons[kind] }).addTo(map.current);
  }, [pin, kind]);

  return <div ref={container} dir="ltr" className="h-72 w-full rounded-lg" />;
}
