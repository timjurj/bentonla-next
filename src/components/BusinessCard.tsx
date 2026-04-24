import Link from "next/link";
import type { Business } from "@/types/business";

export default function BusinessCard({ biz }: { biz: Business }) {
  const bullet = biz.tier === "featured" || biz.tier === "premium" ? "»" : "·";

  return (
    <div style={{ marginBottom: 10, lineHeight: 1.5 }}
      itemScope itemType="https://schema.org/LocalBusiness">
      <meta itemProp="name" content={biz.name} />
      {biz.address && <meta itemProp="address" content={biz.address} />}

      <span style={{ display: "block", fontWeight: 700, fontSize: biz.tier === "featured" ? 15 : 14 }}>
        <span style={{ color: "var(--red)", fontWeight: 700, marginRight: 4 }}>{bullet}</span>
        <Link href={`/business/${biz.slug}`} itemProp="url">
          {biz.tier === "featured" ? biz.name.toUpperCase() : biz.name}
        </Link>
        {biz.is_new && (
          <span style={{
            background: "var(--red)",
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            padding: "1px 5px",
            marginLeft: 6,
            verticalAlign: "middle",
          }}>New</span>
        )}
        {biz.tier === "featured" && (
          <span style={{
            background: "#111",
            color: "#f5f2eb",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            padding: "1px 5px",
            marginLeft: 6,
            verticalAlign: "middle",
          }}>Recommended</span>
        )}
      </span>

      <span style={{ display: "block", fontSize: 11, color: "var(--ink-mid)", marginTop: 1 }}
        itemProp="description">
        {biz.tagline}
      </span>

      {biz.phone && (
        <span style={{ display: "block", fontSize: 11, color: "#333" }}
          itemProp="telephone">
          {biz.phone}
        </span>
      )}
    </div>
  );
}