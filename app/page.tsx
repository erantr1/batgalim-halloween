import Link from "next/link";
import { event } from "@/config/event";

const button =
  "flex min-h-12 w-full items-center justify-center rounded-xl px-4 text-center font-medium";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-orange-500">{event.name}</h1>
        <p className="text-2xl">{event.tagline}</p>
        <p className="text-stone-300">
          {event.dateLong} · {event.timeLabel}
        </p>
      </header>

      <p className="text-lg">{event.home.intro}</p>

      <nav className="flex flex-col gap-3">
        <Link href="/register" className={`${button} bg-orange-500 text-stone-950`}>
          {event.home.cta.register}
        </Link>
        <Link href="/map" className={`${button} border border-orange-500`}>
          {event.home.cta.map}
        </Link>
        <Link href="/get-map" className={`${button} border border-stone-600`}>
          {event.home.cta.getMap}
        </Link>
      </nav>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">{event.home.guidelinesTitle}</h2>
        <ul className="flex list-disc flex-col gap-2 ps-5">
          {event.guidelines.map((g) => (
            <li key={g.text}>
              {g.text}
              {g.link && (
                <>
                  {" "}
                  <a href={g.link.href} target="_blank" rel="noopener noreferrer" className="text-orange-400 underline">
                    {g.link.label}
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
