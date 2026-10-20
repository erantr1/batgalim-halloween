import { event } from "@/config/event";

export default function Guidelines() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold">{event.guidelinesTitle}</h2>
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
  );
}
