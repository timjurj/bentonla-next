import type { Metadata } from "next";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import SearchDirectory from "@/components/SearchDirectory";
import CommunitySection from "@/components/CommunitySection";
import businessData from "@/data/businesses.json";
import { categories } from "@/data/categories";
import type { Business } from "@/types/business";

const businesses = businessData as Business[];

export const metadata: Metadata = {
  title: "BentonLA.com — Benton, Louisiana Local Business Directory",
  description:
    "The complete local business directory for Benton, Louisiana and Bossier Parish. Find restaurants, home services, real estate, churches, cleaning, and more.",
  alternates: { canonical: "https://www.bentonla.com" },
  openGraph: {
    title: "BentonLA.com — Benton, Louisiana Business Directory",
    description: "The complete guide to businesses in Benton, LA and Bossier Parish.",
    url: "https://www.bentonla.com",
  },
};

const col1Cats = ["home-services", "real-estate"];
const col2Cats = ["restaurants", "health", "automotive"];
const col3Cats = ["churches", "education", "government"];

function ColSection({ catSlug }: { catSlug: string }) {
  const cat = categories.find((c) => c.slug === catSlug);
  if (!cat) return null;
  const bizList = businesses
    .filter((b) => b.category === catSlug && b.is_active)
    .sort((a, b) => {
      const order = { featured: 0, premium: 1, standard: 2, free: 3 };
      return order[a.tier] - order[b.tier];
    });

  return (
    <div style={{ marginBottom: 8 }}>
      <h2 style={{
        fontFamily: "'Oswald', sans-serif",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: "var(--ink-mid)",
        borderBottom: "1px solid var(--border)",
        paddingBottom: 5,
        marginBottom: 10,
        marginTop: 16,
      }}>
        <Link href={`/${catSlug}`} style={{ color: "var(--ink-mid)" }}>
          {cat.icon} {cat.name} — Benton, LA
        </Link>
      </h2>
      {bizList.map((biz, i) => (
        <div key={biz.id}>
          <BusinessCard biz={biz} />
          {i < bizList.length - 1 && (
            <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "8px 0" }} />
          )}
        </div>
      ))}
      <div style={{ marginTop: 8 }}>
        <Link href={`/${catSlug}`} style={{ fontSize: 11, color: "var(--red)" }}>
          » See all {cat.name} →
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BentonLA.com",
    url: "https://www.bentonla.com",
    description: "The complete local business directory for Benton, Louisiana and Bossier Parish",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.bentonla.com/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Masthead />

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "0 12px" }}>

        {/* Featured Sponsor */}
        <div style={{
          textAlign: "center",
          border: "2px solid #111",
          padding: "14px 12px",
          margin: "16px 0 14px",
          background: "#fff",
        }}>
          <p style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 9,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#999",
            marginBottom: 4,
          }}>★ Featured Sponsor ★</p>
          <p style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}>
            <Link href="/business/gleaux-cleaning" style={{ color: "#111" }}>
              Gleaux Cleaning LLC
            </Link>
          </p>
          <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
            Benton&apos;s Premier Cleaning Service — Residential &amp; Commercial
          </p>
          <a href="https://gleauxcleaning.com?utm_source=bentonla&utm_medium=directory&utm_campaign=featured"
            target="_blank" rel="noopener"
            style={{
              display: "inline-block",
              marginTop: 10,
              fontFamily: "'Oswald', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              background: "#111",
              color: "#f5f2eb",
              padding: "6px 16px",
              textDecoration: "none",
            }}>
            Get a Free Quote »
          </a>
        </div>

        {/* New to Benton box */}
        <div style={{
          border: "1px solid var(--border)",
          padding: "10px 12px",
          marginBottom: 16,
          background: "#fffef8",
          fontSize: 12,
          lineHeight: 1.6,
          color: "#444",
        }}>
          <strong style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 13,
            letterSpacing: 1,
            textTransform: "uppercase",
            display: "block",
            marginBottom: 4,
          }}>🏡 New to Benton, LA?</strong>
          Just moved in? Get your home professionally cleaned before you unpack.{" "}
          <a href="https://gleauxcleaning.com?utm_source=bentonla&utm_medium=directory&utm_campaign=newcomer"
            target="_blank" rel="noopener">
            Gleaux Cleaning
          </a>{" "}
          serves all of Bossier Parish.
        </div>

        {/* Community Board */}
        <CommunitySection />

        {/* Search */}
        <SearchDirectory businesses={businesses} categories={categories} />

        {/* Responsive grid */}
        <div className="dir-grid">
          <div className="dir-col-1">
            {col1Cats.map((s) => <ColSection key={s} catSlug={s} />)}
          </div>
          <div className="dir-divider" />
          <div className="dir-col-2">
            <div style={{
              textAlign: "center",
              borderBottom: "2px solid #111",
              paddingBottom: 12,
              marginBottom: 14,
            }}>
              <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#999", marginBottom: 2 }}>
                Bossier Parish, Louisiana
              </p>
              <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
                THE COMPLETE GUIDE<br />TO BENTON, LA
              </p>
              <p style={{ fontSize: 11, color: "#888", marginTop: 6 }}>
                Updated Weekly · Free Listings Available
              </p>
            </div>
            {col2Cats.map((s) => <ColSection key={s} catSlug={s} />)}
            <div style={{
              textAlign: "center",
              borderTop: "1px dashed var(--border)",
              padding: "12px 0",
              fontSize: 12,
              marginTop: 8,
            }}>
              <p style={{ marginBottom: 6, color: "#888" }}>Own a Benton, LA business?</p>
              <Link href="/add-listing" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>
                » Add Your Free Listing «
              </Link>
              <span style={{ margin: "0 8px", color: "var(--ink-xlight)" }}>|</span>
              <Link href="/advertise" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--red)" }}>
                » Go Premium — $49/mo «
              </Link>
            </div>
          </div>
          <div className="dir-divider" />
          <div className="dir-col-3">
            {col3Cats.map((s) => <ColSection key={s} catSlug={s} />)}
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}