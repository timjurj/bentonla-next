"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Masthead() {
  const [dateline, setDateline] = useState("");

  useEffect(() => {
    const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
    const months = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
    const now = new Date();
    setDateline(`${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);
  }, []);

  return (
    <>
      <header style={{
        textAlign: "center",
        padding: "18px 20px 12px",
        borderBottom: "3px solid #111",
        background: "var(--bg)",
      }}>
        <p style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--ink-mid)", marginBottom: 4 }}>
          The Official Guide to
        </p>
        <Link href="/" style={{ textDecoration: "none" }}>
          <h1 className="oswald" style={{
            fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "var(--ink)",
            lineHeight: 1,
          }}>
            BentonLA.com
          </h1>
        </Link>
        <p style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--ink-mid)", marginTop: 4 }}>
          Bossier Parish&apos;s Fastest Growing Community
        </p>
        <p style={{ fontSize: 11, color: "var(--ink-light)", marginTop: 6, letterSpacing: 1 }}>
          {dateline}
        </p>
      </header>

      {/* Ticker */}
      <div style={{
        background: "#111",
        color: "#f5f2eb",
        padding: "5px 0",
        fontSize: 11,
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}>
        <style>{`
          @keyframes ticker {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-100%); }
          }
          .ticker-inner { display: inline-block; animation: ticker 30s linear infinite; }
          .ticker-inner span { margin: 0 40px; }
        `}</style>
        <div className="ticker-inner">
          <span>★ BENTON&apos;S BUSINESS DIRECTORY</span>
          <span>NEW BUSINESSES ADDED WEEKLY</span>
          <span>LIST YOUR BUSINESS FREE</span>
          <span>SERVING BOSSIER PARISH</span>
          <span>PREMIUM LISTINGS AVAILABLE — $49/MO</span>
          <span>BENTON, LA — POPULATION GROWING FAST</span>
          <span>★ BENTON&apos;S BUSINESS DIRECTORY</span>
        </div>
      </div>

      {/* Category Nav */}
      <nav style={{
        background: "var(--bg-alt)",
        borderBottom: "1px solid var(--border)",
        padding: "8px 16px",
        textAlign: "center",
        fontSize: 11,
        letterSpacing: "1px",
        textTransform: "uppercase",
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}>
        {[
          { slug: "home-services", label: "Home Services" },
          { slug: "plumbers", label: "Plumbers" },
          { slug: "electricians", label: "Electricians" },
          { slug: "hvac", label: "HVAC" },
          { slug: "contractors", label: "Contractors" },
          { slug: "restaurants", label: "Restaurants" },
          { slug: "shopping", label: "Shopping" },
          { slug: "pharmacies", label: "Pharmacies" },
          { slug: "gyms", label: "Gyms" },
          { slug: "real-estate", label: "Real Estate" },
          { slug: "health", label: "Health" },
          { slug: "dentists", label: "Dentists" },
          { slug: "automotive", label: "Auto" },
          { slug: "daycares", label: "Daycares" },
          { slug: "veterinarians", label: "Vets" },
          { slug: "hair-salons", label: "Salons" },
          { slug: "insurance", label: "Insurance" },
          { slug: "lawyers", label: "Lawyers" },
          { slug: "churches", label: "Churches" },
          { slug: "education", label: "Education" },
          { slug: "government", label: "Government" },
        ].map((cat, i) => (
          <span key={cat.slug}>
            {i > 0 && <span style={{ color: "var(--ink-xlight)", margin: "0 6px" }}>|</span>}
            <Link href={`/${cat.slug}`} style={{ color: "var(--blue)", fontSize: 11 }}>
              {cat.label}
            </Link>
          </span>
        ))}
      </nav>
    </>
  );
}