"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { event } from "@/config/event";
import { saveAccessKey } from "@/app/actions";
import { supabase } from "@/lib/supabase";

const t = event.subscribe;
const input = "w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-base";

export default function SubscribeForm() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const accessKey = crypto.randomUUID();
    setSending(true);
    setError("");
    // No .select(): anon may only INSERT, so asking for the row back would fail.
    const { error } = await supabase.from("map_subscribers").insert({
      name: String(f.get("name")).trim(),
      contact: String(f.get("contact")).trim(),
      consent_to_contact: f.get("consent_to_contact") === "on",
      access_key: accessKey,
    });
    if (error) {
      console.error(error);
      setSending(false);
      return setError(t.error);
    }
    await saveAccessKey(accessKey).catch(console.error);
    setSending(false);
    router.refresh(); // /map renders again, now with the key: the map instead of this form
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold">{t.title}</h2>
      <p className="text-lg">{t.intro}</p>
      <label className="flex flex-col gap-1">
        <span>{t.labels.name}</span>
        <input name="name" required maxLength={100} autoComplete="name" className={input} />
      </label>
      <label className="flex flex-col gap-1">
        <span>{t.labels.contact}</span>
        <input name="contact" required minLength={5} maxLength={100} dir="ltr" autoComplete="tel" className={input} />
        <span className="text-sm text-stone-400">{t.hints.contact}</span>
      </label>
      <label className="flex items-start gap-3">
        <input type="checkbox" name="consent_to_contact" required className="mt-1 size-5 shrink-0 accent-orange-500" />
        <span>{t.consent}</span>
      </label>

      {error && (
        <p role="alert" className="text-red-400">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={sending}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-4 font-medium text-stone-950 disabled:opacity-60"
      >
        {sending ? t.sending : t.submit}
      </button>
    </form>
  );
}
