import Link from "next/link";
import Guidelines from "@/components/Guidelines";
import { event } from "@/config/event";

const t = event.home;

const button = "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-center font-medium";

const links = [
  { href: "/register", label: t.cta.register, icon: "🍬", style: "bg-orange-500 text-stone-950 shadow-[0_0_20px_rgb(249_115_22/0.45)]" },
  { href: "/register?kind=activity", label: t.cta.activity, icon: "🕸️", style: "bg-purple-800 text-white" },
  { href: "/map", label: t.cta.map, icon: "🎃👻", style: "border border-orange-500" },
  { href: "/get-map", label: t.cta.getMap, icon: "📩", style: "border border-stone-600" },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl">{event.title}</h1>
        <p className="text-2xl">{event.tagline}</p>
        <p className="text-stone-300">
          {event.dateLong} · {event.timeLabel}
        </p>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl border border-orange-500/30 bg-stone-950/60 p-4">
        <h2 className="text-2xl font-bold">{t.whatTitle}</h2>
        {t.what.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>

      <nav className="flex flex-col gap-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={`${button} ${l.style}`}>
            <span aria-hidden>{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>

      <Guidelines items={event.guidelines} />
    </main>
  );
}
