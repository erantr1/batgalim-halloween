import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { event } from "@/config/event";

// Leaflet needs window: import this only from components loaded with next/dynamic and ssr: false.

const emoji = (html: string) => L.divIcon({ html, className: "text-3xl leading-8 text-center", iconSize: [32, 32] });
// The marker for each kind of registration, on the final map and on the form's pin.
export const icons = { home: emoji("🎃"), activity: emoji("👻") };

// Plain Leaflet, not react-leaflet: Next hides visited pages with <Activity>, which runs effect
// cleanups. Callers build the map in a useEffect and remove it in the cleanup, so it is rebuilt
// when the page is shown again.
export function createMap(container: HTMLElement) {
  const map = L.map(container).setView(event.map.center, event.map.zoom);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  return map;
}
