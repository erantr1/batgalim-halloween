"use server";

import { cookies } from "next/headers";
import { accessKeyCookie } from "@/lib/accessKey";

// Set on the server, so page scripts can't read it (httpOnly).
export async function saveAccessKey(key: string) {
  (await cookies()).set(accessKeyCookie, key, { maxAge: 60 * 60 * 24 * 30, httpOnly: true, secure: true, sameSite: "lax" });
}
