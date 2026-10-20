import type { Metadata } from "next";
import { Rubik, Rubik_Wet_Paint } from "next/font/google";
import Decorations from "@/components/Decorations";
import HomeButton from "@/components/HomeButton";
import { event } from "@/config/event";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
});

// Dripping paint, for page titles only.
const wetPaint = Rubik_Wet_Paint({
  variable: "--font-rubik-wet-paint",
  weight: "400",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: { default: event.name, template: `%s · ${event.name}` },
  description: event.description,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} ${wetPaint.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col pt-12 pb-8">
        <Decorations />
        <HomeButton />
        {children}
      </body>
    </html>
  );
}
