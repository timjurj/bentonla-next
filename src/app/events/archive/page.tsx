import type { Metadata } from "next";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Past Events Archive — Benton, LA | BentonLA.com",
  description: "Archive of past community events in Benton, Louisiana and Bossier Parish.",
  alternates: { canonical: "https://www.bentonla.com/events/archive" },
};

export const dynamic = "force-dynamic";

export default async function EventsArchivePage() {
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("archived", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <Masthead />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 60px" }}>
        <p style={{ fontSize: 11, color: "var(--ink-light)", marginBottom: 16, letterSpacing: 1 }}>
          <Link href="/">BENTONLA.COM</Link>
          <span style={{ margin: "0 8px" }}>»</span>
          <Link href="/events">EVENTS</Link>
          <span style={{ margin: "0 8px" }}>»</span>
          ARCHIVE
        </p>
        <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              📅 Past Events Archive
            </h1>
            <p style={{ fontSize: 11, color: "#888", marginTop: 6 }}>Benton, LA &amp; Bossier Parish · {events?.length || 0} archived events</p>
          </div>
          <Link href="/events" style={{ fontSize: 11, fontFamily: "'Oswald', sans-serif", letterSpacing: 2, textTransform: "uppercase", color: "var(--blue)" }}>
            ← Upcoming Events
          </Link>
        </div>

        {!events || events.length === 0 ? (
          <p style={{ color: "#888", fontSize: 13 }}>No archived events yet.</p>
        ) : (
          <div>
            {events.map((evt: { id: string; title: string; date: string; location: string; description?: string }, i: number) => (
              <div key={evt.id}>
                <div style={{ padding: "12px 0", lineHeight: 1.6, opacity: 0.8 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                    <span style={{ color: "#aaa", marginRight: 6 }}>·</span>
                    {evt.title}
                    <span style={{ fontSize: 10, background: "#eee", color: "#888", padding: "1px 6px", marginLeft: 8, fontWeight: 400, textTransform: "uppercase", letterSpacing: 1 }}>Past</span>
                  </p>
                  <p style={{ fontSize: 12, color: "#888" }}>{evt.date} · {evt.location}</p>
                  {evt.description && <p style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>{evt.description}</p>}
                </div>
                {i < events.length - 1 && <hr style={{ border: "none", borderTop: "1px solid #f0f0f0" }} />}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}