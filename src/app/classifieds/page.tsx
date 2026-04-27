import type { Metadata } from "next";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { getClassifieds } from "@/lib/data";

export const metadata: Metadata = {
  title: "Buy & Sell in Benton, LA | BentonLA.com",
  description: "Local classifieds for Benton, Louisiana. Buy and sell cars, furniture, homes, equipment and more in Bossier Parish.",
  alternates: { canonical: "https://www.bentonla.com/classifieds" },
};

export const dynamic = "force-dynamic";

export default async function ClassifiedsPage() {
  const classifieds = await getClassifieds();

  return (
    <>
      <Masthead />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 60px" }}>

        <p style={{ fontSize: 11, color: "var(--ink-light)", marginBottom: 16, letterSpacing: 1 }}>
          <Link href="/">BENTONLA.COM</Link>
          <span style={{ margin: "0 8px", color: "var(--ink-xlight)" }}>»</span>
          BUY / SELL
        </p>

        <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              🏷 Buy / Sell
            </h1>
            <p style={{ fontSize: 11, color: "#888", marginTop: 6 }}>{classifieds.length} listing{classifieds.length !== 1 ? "s" : ""} · Benton, LA &amp; Bossier Parish</p>
          </div>
          <Link href="/classifieds/post" style={{
            fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 2, textTransform: "uppercase", background: "#111",
            color: "#f5f2eb", padding: "8px 16px", textDecoration: "none",
          }}>
            + Post a Listing
          </Link>
        </div>

        {classifieds.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
            <p style={{ fontSize: 14 }}>No listings yet.</p>
            <Link href="/classifieds/post" style={{ color: "var(--red)", fontSize: 12, marginTop: 8, display: "block" }}>Post the first listing →</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {classifieds.map((item: { id: string; title: string; price: string; condition: string; description?: string; link: string }) => (
              <div key={item.id} style={{
                border: "1px solid #bbb", padding: "14px 16px", background: "#fff", lineHeight: 1.6,
              }}>
                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                  {item.link && item.link !== "#"
                    ? <a href={item.link} target="_blank" rel="noopener">{item.title}</a>
                    : item.title
                  }
                </p>
                <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 4 }}>
                  {item.price}
                </p>
                <p style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>{item.condition}</p>
                {item.description && <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{item.description}</p>}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 32, border: "1px dashed #bbb", padding: 20, textAlign: "center" }}>
          <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
            Selling something in Benton?
          </p>
          <p style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>
            Post your item for free and reach thousands of Benton area residents.
          </p>
          <Link href="/classifieds/post" style={{
            fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 2, textTransform: "uppercase", background: "#111",
            color: "#f5f2eb", padding: "10px 20px", textDecoration: "none", display: "inline-block",
          }}>
            Post a Listing »
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}