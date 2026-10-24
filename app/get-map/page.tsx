import type { Metadata } from "next";
import SubscribeForm from "@/components/SubscribeForm";
import { event } from "@/config/event";

const t = event.subscribe;

export const metadata: Metadata = { title: t.title };

export default function GetMapPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl">{t.title}</h1>
        <p className="text-lg">{t.intro}</p>
      </header>
      <SubscribeForm />
    </main>
  );
}
