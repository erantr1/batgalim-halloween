import type { Metadata } from "next";
import { event } from "@/config/event";
import SubscribeForm from "./SubscribeForm";

export const metadata: Metadata = { title: event.getMap.title };

export default function GetMapPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl">{event.getMap.title}</h1>
        <p className="text-lg">{event.getMap.intro}</p>
      </header>
      <SubscribeForm />
    </main>
  );
}
