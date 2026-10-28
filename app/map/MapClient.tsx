"use client";

import dynamic from "next/dynamic";

// Leaflet needs window; ssr: false is only allowed inside a Client Component.
export default dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="h-[70svh] max-h-[600px] w-full rounded-lg bg-stone-800" />,
});
