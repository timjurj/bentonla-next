import type { Metadata } from "next";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Past Listings Archive — Benton, LA | BentonLA.com",
  description: "Archive of past buy and sell listings in Benton, Louisiana and Bossier Parish.",
  alternates: { canonical: "https://www.bentonla.com/classifieds/archive" },
};

export const dynamic = "force-dynamic";

export default async function ClassifiedsArchivePage() {
  const { data: classifieds } = await supabase
    .from("classifieds")
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
          <Link href="/classifieds">BUY / SELL</Link>
          <span style={{ margin: "0 8px" }}>»</span>
          ARCHIVE
        </p>
        <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              🏷 Past Listings Archive
            </h1>
            <p style={{ fontSize: 11, color: "#888", marginTop: 6 }}>Benton, LA &amp; Bossier Parish · {classifieds?.length || 0} archived listings</p>
          </div>
          <Link href="/classifieds" style={{ fontSize: 11, fontFamily: "'Oswald', sans-serif", letterSpacing: 2, textTransform: "uppercase", color: "var(--blue)" }}>
            ← Current Listings
          </Link>
        </div>

        {!classifieds || classifieds.length === 0 ? (
          <p style={{ color: "#888", fontSize: 13 }}>No archived listings yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {classifieds.map((item: { id: string; title: string; price: string; condition?: string; description?: string }) => (
              <div key={item.id} style={{ border: "1px solid #eee", padding: "14px 16px", background: "#fafafa", opacity: 0.75 }}>
                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#555" }}>{item.title}</p>
                <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 700, color: "#888", marginBottom: 4 }}>{item.price}</p>
                {item.condition && <p style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>{item.condition}</p>}
                {item.description && <p style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>{item.description}</p>}
                <p style={{ fontSize: 10, color: "#ccc", marginTop: 8, textTransform: "uppercase", letterSpacing: 1 }}>Listing Expired</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}