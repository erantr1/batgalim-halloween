"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { event } from "@/config/event";
import { supabase } from "@/lib/supabase";
import type { Pin } from "./PinPicker";

// Leaflet needs window; ssr: false is only allowed inside a Client Component.
const PinPicker = dynamic(() => import("./PinPicker"), {
  ssr: false,
  loading: () => <div className="h-72 w-full rounded-lg bg-stone-800" />,
});

const t = event.register;
const input = "w-full rounded-lg border border-stone-600 bg-stone-800 px-3 py-2 text-base";

type FieldProps = {
  name: keyof typeof t.labels;
  maxLength: number;
  required?: boolean;
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>;

function Field({ name, required, hint, ...props }: FieldProps) {
  return (
    <label className="flex flex-col gap-1">
      <span>
        {t.labels[name]} {!required && <span className="text-stone-400">{t.optional}</span>}
      </span>
      <input name={name} required={required} className={input} {...props} />
      {hint && <span className="text-sm text-stone-400">{hint}</span>}
    </label>
  );
}

export default function RegisterForm() {
  const [pin, setPin] = useState<Pin | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pin) return setError(t.pinMissing);

    const f = new FormData(e.currentTarget);
    const text = (k: string) => String(f.get(k) ?? "").trim() || null;
    setSending(true);
    setError("");
    // No .select(): anon may only INSERT, so asking for the row back would fail.
    const { error } = await supabase.from("registrations").insert({
      names: text("names"),
      phone: text("phone"),
      street: text("street"),
      building_number: text("building_number"),
      entrance: text("entrance"),
      floor: text("floor"),
      apartment: text("apartment"),
      access_type: text("access_type"),
      door_color: text("door_color"),
      door_sign: text("door_sign"),
      access_notes: text("access_notes"),
      lat: pin[0],
      lng: pin[1],
      guidelines_ack: f.get("guidelines_ack") === "on",
      map_consent: f.get("map_consent") === "on",
    });
    setSending(false);
    if (error) {
      console.error(error);
      setError(t.error);
    } else {
      setDone(true);
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
      <Field name="names" required maxLength={200} autoComplete="name" hint={t.hints.private} />
      <Field name="phone" required minLength={9} maxLength={20} type="tel" dir="ltr" autoComplete="tel" hint={t.hints.private} />

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <Field name="street" required maxLength={100} />
        </div>
        <Field name="building_number" required maxLength={10} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field name="entrance" maxLength={10} />
        <Field name="floor" maxLength={10} />
        <Field name="apartment" maxLength={10} />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1">{t.labels.access_type}</legend>
        {Object.entries(t.accessTypes).map(([value, label]) => (
          <label key={value} className="flex items-center gap-3">
            <input type="radio" name="access_type" value={value} required className="size-5 accent-orange-500" />
            {label}
          </label>
        ))}
      </fieldset>

      <Field name="door_color" maxLength={50} />
      <Field name="door_sign" maxLength={100} />
      <label className="flex flex-col gap-1">
        <span>
          {t.labels.access_notes} <span className="text-stone-400">{t.optional}</span>
        </span>
        <textarea name="access_notes" maxLength={500} rows={3} className={input} />
        <span className="text-sm text-stone-400">{t.hints.access_notes}</span>
      </label>

      <div className="flex flex-col gap-2">
        <span>{t.labels.pin}</span>
        <PinPicker pin={pin} onChange={setPin} />
        <span className="text-sm text-stone-400">{t.hints.pin}</span>
      </div>

      <label className="flex items-start gap-3">
        <input type="checkbox" name="guidelines_ack" required className="mt-1 size-5 shrink-0 accent-orange-500" />
        <span>{t.guidelinesAck}</span>
      </label>
      <label className="flex items-start gap-3">
        <input type="checkbox" name="map_consent" required className="mt-1 size-5 shrink-0 accent-orange-500" />
        <span>{t.mapConsent}</span>
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
