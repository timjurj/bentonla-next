"use client";
import { useState } from "react";
import Link from "next/link";
import type { Business } from "@/types/business";
import type { Category } from "@/data/categories";

function BusinessRow({ biz }: { biz: Business }) {
  const bullet = biz.tier === "featured" || biz.tier === "premium" ? "»" : "·";
  return (
    <div style={{ marginBottom: 8, lineHeight: 1.5 }}>
      <span style={{ display: "block", fontWeight: 700, fontSize: biz.tier === "featured" ? 15 : 14 }}>
        <span style={{ color: "#cc0000", fontWeight: 700, marginRight: 4 }}>{bullet}</span>
        <Link href={`/business/${biz.slug}`}>
          {biz.tier === "featured" ? biz.name.toUpperCase() : biz.name}
        </Link>
        {biz.is_new && (
          <span style={{
            background: "#cc0000", color: "#fff", fontSize: 9, fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase", padding: "1px 5px",
            marginLeft: 6, verticalAlign: "middle",
          }}>New</span>
        )}
        {biz.tier === "featured" && (
          <span style={{
            background: "#111", color: "#f5f2eb", fontSize: 9, fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase", padding: "1px 5px",
            marginLeft: 6, verticalAlign: "middle",
          }}>Recommended</span>
        )}
      </span>
      <span style={{ display: "block", fontSize: 11, color: "#555", marginTop: 1 }}>
        {biz.tagline}
      </span>
      {biz.phone && (
        <span style={{ display: "block", fontSize: 11, color: "#333" }}>{biz.phone}</span>
      )}
    </div>
  );
}

export default function SearchDirectory({
  businesses,
  categories,
}: {
  businesses: Business[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? businesses.filter((b) =>
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.tagline?.toLowerCase().includes(query.toLowerCase()) ||
        b.category.toLowerCase().includes(query.toLowerCase()) ||
        b.address?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const isSearching = query.trim().length > 0;

  // Group results by category
  const grouped = categories
    .map((cat) => ({
      cat,
      results: filtered.filter((b) => b.category === cat.slug),
    }))
    .filter((g) => g.results.length > 0);

  return (
    <div>
      {/* Search bar */}
      <div style={{
        textAlign: "center",
        padding: "10px 0 16px",
        borderBottom: "1px solid #bbb",
        marginBottom: 16,
      }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH BENTON BUSINESSES..."
          style={{
            fontFamily: "'Courier Prime', 'Courier New', monospace",
            fontSize: 13,
            padding: "7px 14px",
            width: "100%",
            maxWidth: 420,
            border: "1px solid #999",
            background: "#fff",
            color: "#111",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#00008b")}
          onBlur={(e) => (e.target.style.borderColor = "#999")}
        />
      </div>

      {/* Search results */}
      {isSearching && (
        <div style={{ marginBottom: 24 }}>
          {filtered.length === 0 ? (
            <p style={{ fontSize: 12, color: "#888", textAlign: "center", padding: "12px 0" }}>
              No businesses found for &quot;{query}&quot;
            </p>
          ) : (
            <>
              <p style={{
                fontSize: 11,
                color: "#888",
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 12,
              }}>
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{query}&quot;
              </p>
              {grouped.map(({ cat, results }) => (
                <div key={cat.slug} style={{ marginBottom: 16 }}>
                  <h3 style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: "#555",
                    borderBottom: "1px solid #bbb",
                    paddingBottom: 4,
                    marginBottom: 8,
                  }}>
                    <Link href={`/${cat.slug}`} style={{ color: "#555" }}>
                      {cat.icon} {cat.name}
                    </Link>
                  </h3>
                  {results.map((biz, i) => (
                    <div key={biz.id}>
                      <BusinessRow biz={biz} />
                      {i < results.length - 1 && (
                        <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "8px 0" }} />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}