import Link from "next/link";
import Guidelines from "@/components/Guidelines";
import { event } from "@/config/event";

const t = event.home;

const button = "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-center font-medium";

type Cta = { href: string; label: string; icon: string; style: string };

// "Opens on 31.10" until published; then the map, or the viewer form for anyone not registered yet.
const map: Cta = { href: "/map", label: t.cta.map, icon: "🎃🕷️", style: "border border-orange-500" };

const register: Cta[] = [
  { href: "/register", label: t.cta.register, icon: "🍬", style: "bg-orange-500 text-stone-950 shadow-[0_0_20px_rgb(249_115_22/0.45)]" },
  { href: "/register?kind=activity", label: t.cta.activity, icon: "🕸️", style: "bg-purple-800 text-white" },
  { href: "/get-map", label: t.cta.subscribe, icon: "👀", style: "bg-lime-600 text-stone-950" },
];

function CtaLink({ href, label, icon, style }: Cta) {
  return (
    <Link href={href} className={`${button} ${style}`}>
      <span aria-hidden>{icon}</span>
      {label}
    </Link>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="flex flex-col items-center gap-1">
          <span className="font-sans text-xl font-bold tracking-wide text-amber-100">{event.titleLead}</span>
          <span className="text-5xl">{event.name}</span>
        </h1>
        <p className="text-2xl">{event.tagline}</p>
        <p className="text-stone-300">
          {event.dateLong} · {event.timeLabel}
        </p>
      </header>

      <CtaLink {...map} />

      <section className="flex flex-col gap-3 rounded-2xl border border-orange-500/30 bg-stone-950/60 p-4">
        <h2 className="text-2xl font-bold">{t.whatTitle}</h2>
        {t.what.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>

      <nav className="flex flex-col gap-3">
        {register.map((l) => (
          <CtaLink key={l.href} {...l} />
        ))}
      </nav>

      <Guidelines items={event.guidelines} />
    </main>
  );
}
