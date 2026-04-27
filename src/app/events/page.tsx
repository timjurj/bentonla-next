import type { Metadata } from "next";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { getEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Upcoming Events in Benton, LA | BentonLA.com",
  description: "Find upcoming events in Benton, Louisiana and Bossier Parish. Community events, festivals, school events, church events and more.",
  alternates: { canonical: "https://www.bentonla.com/events" },
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <Masthead />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 60px" }}>

        <p style={{ fontSize: 11, color: "var(--ink-light)", marginBottom: 16, letterSpacing: 1 }}>
          <Link href="/">BENTONLA.COM</Link>
          <span style={{ margin: "0 8px", color: "var(--ink-xlight)" }}>»</span>
          EVENTS
        </p>

        <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              📅 Upcoming Events
            </h1>
            <p style={{ fontSize: 11, color: "#888", marginTop: 6 }}>Benton, LA &amp; Bossier Parish</p>
          </div>
          <Link href="/events/submit" style={{
            fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 2, textTransform: "uppercase", background: "#111",
            color: "#f5f2eb", padding: "8px 16px", textDecoration: "none",
          }}>
            + Submit Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
            <p style={{ fontSize: 14 }}>No upcoming events listed yet.</p>
            <Link href="/events/submit" style={{ color: "var(--red)", fontSize: 12, marginTop: 8, display: "block" }}>
              Be the first to submit one →
            </Link>
          </div>
        ) : (
          <div>
            {events.map((event: { id: string; title: string; date: string; location: string; description?: string; link: string }, i: number) => (
              <div key={event.id}>
                <div style={{ padding: "14px 0", lineHeight: 1.6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 15 }}>
                        <span style={{ color: "var(--red)", marginRight: 6 }}>»</span>
                        {event.link && event.link !== "#"
                          ? <a href={event.link} target="_blank" rel="noopener">{event.title}</a>
                          : event.title
                        }
                      </p>
                      <p style={{ fontSize: 12, color: "#555", marginTop: 3 }}>📍 {event.location}</p>
                      {event.description && <p style={{ fontSize: 12, color: "#777", marginTop: 4 }}>{event.description}</p>}
                    </div>
                    <div style={{
                      fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700,
                      letterSpacing: 1, textTransform: "uppercase", color: "#888",
                      whiteSpace: "nowrap", border: "1px solid #ddd", padding: "4px 10px",
                    }}>
                      {event.date}
                    </div>
                  </div>
                </div>
                {i < events.length - 1 && <hr style={{ border: "none", borderTop: "1px solid #eee" }} />}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 32, border: "1px dashed #bbb", padding: 20, textAlign: "center" }}>
          <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
            Have an event in Benton?
          </p>
          <p style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>
            Submit your community event, fundraiser, school event, or church service for free.
          </p>
          <Link href="/events/submit" style={{
            fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 2, textTransform: "uppercase", background: "#111",
            color: "#f5f2eb", padding: "10px 20px", textDecoration: "none", display: "inline-block",
          }}>
            Submit Your Event »
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}