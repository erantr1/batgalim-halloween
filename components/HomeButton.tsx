"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { event } from "@/config/event";

// On every page but the home page, in the decorated band at the top.
export default function HomeButton() {
  if (usePathname() === "/") return null;
  return (
    <Link
      href="/"
      aria-label={event.backHome}
      className="absolute start-3 top-2 flex print:hidden size-11 animate-flicker items-center justify-center rounded-full border border-orange-500/60 bg-linear-to-br from-purple-900 to-stone-950 text-2xl shadow-[0_0_14px_rgb(249_115_22/0.6)] motion-reduce:animate-none"
    >
      🏚️
      {/* a big spider dropping over the house */}
      <span
        aria-hidden
        className="absolute start-1 -top-3 flex origin-top animate-swing flex-col items-center motion-reduce:animate-none"
      >
        <span className="h-5 w-px bg-stone-300/70" />
        <span className="text-[1.7rem] leading-none drop-shadow-[0_0_4px_rgb(249_115_22/0.9)]">🕷️</span>
      </span>
    </Link>
  );
}
