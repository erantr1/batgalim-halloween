import { event, type Guideline } from "@/config/event";

export default function Guidelines({ items }: { items: Guideline[] }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-orange-500/30 bg-stone-950/60 p-4">
      <h2 className="text-2xl font-bold">{event.guidelinesTitle}</h2>
      <ul className="flex list-['🎃_'] flex-col gap-2 ps-7">
        {items.map((g) => (
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
  );
}
