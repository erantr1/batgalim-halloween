"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { event } from "@/config/event";
import { supabase } from "@/lib/supabase";

const t = event.getMap;
const input = "w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-base";

export default function SubscribeForm() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const submitted = useRef(false);

  // Next keeps visited pages mounted (<Activity>). After a successful sign-up, reset when the
  // page is hidden, so coming back shows a fresh form instead of the thank-you message.
  useLayoutEffect(
    () => () => {
      if (!submitted.current) return;
      submitted.current = false;
      setDone(false);
    },
    [],
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSending(true);
    setError("");
    // No .select(): anon may only INSERT, so asking for the row back would fail.
    const { error } = await supabase.from("map_subscribers").insert({
      name: String(f.get("name")).trim(),
      contact: String(f.get("contact")).trim(),
      consent_to_contact: f.get("consent_to_contact") === "on",
    });
    setSending(false);
    if (error) {
      console.error(error);
      setError(t.error);
    } else {
      setDone(true);
      submitted.current = true;
    }
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-orange-500 p-4">
        <p className="text-lg">{t.success}</p>
        <Link href="/" className="text-orange-400 underline">
          {event.backHome}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
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
