import type { Metadata } from "next";
import Guidelines from "@/components/Guidelines";
import { event } from "@/config/event";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = { title: event.register.title };

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-orange-500">{event.register.title}</h1>
        <p className="text-lg">{event.register.intro}</p>
      </header>
      <Guidelines />
      <RegisterForm />
    </main>
  );
}
