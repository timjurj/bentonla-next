import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { getBusinessBySlug, getAllBusinessSlugs } from "@/lib/data";
import { getCategoryBySlug } from "@/data/categories";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getAllBusinessSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const biz = await getBusinessBySlug(slug);
  if (!biz) return {};
  return {
    title: `${biz.name} — Benton, LA`,
    description: biz.description,
    alternates: { canonical: `https://www.bentonla.com/business/${slug}` },
    openGraph: {
      title: `${biz.name} — Benton, LA`,
      description: biz.description,
      url: `https://www.bentonla.com/business/${slug}`,
    },
  };
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const biz = await getBusinessBySlug(slug);
  if (!biz) notFound();

  const cat = getCategoryBySlug(biz.category);

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: biz.name,
    description: biz.description,
    telephone: biz.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: biz.address,
      addressLocality: "Benton",
      addressRegion: "LA",
      postalCode: "71006",
      addressCountry: "US",
    },
    url: biz.website || `https://www.bentonla.com/business/${biz.slug}`,
    areaServed: "Benton, Louisiana",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Masthead />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px 48px" }}>

        {/* Breadcrumb */}
        <p style={{ fontSize: 11, color: "var(--ink-light)", marginBottom: 16, letterSpacing: 1 }}>
          <Link href="/">BENTONLA.COM</Link>
          <span style={{ margin: "0 8px", color: "var(--ink-xlight)" }}>»</span>
          {cat && <><Link href={`/${biz.category}`} style={{ textTransform: "uppercase" }}>{cat.name}</Link><span style={{ margin: "0 8px", color: "var(--ink-xlight)" }}>»</span></>}
          <span>{biz.name}</span>
        </p>

        {/* Business header */}
        <div style={{ borderBottom: "2px solid #111", paddingBottom: 16, marginBottom: 20 }}>
          {biz.tier === "featured" && (
            <p style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: 9,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#999",
              marginBottom: 6,
            }}>★ Featured Sponsor ★</p>
          )}
          <h1 style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 700,
            letterSpacing: 1,
            lineHeight: 1.1,
          }}>
            {biz.name}
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-mid)", marginTop: 6 }}>{biz.tagline}</p>
          {biz.is_new && (
            <span style={{
              display: "inline-block",
              background: "var(--red)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              padding: "2px 8px",
              marginTop: 8,
            }}>New to Directory</span>
          )}
        </div>

        {/* Details */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "#444", marginBottom: 16 }}>
            {biz.description}
          </p>

          <table style={{ fontSize: 13, borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              {biz.phone && (
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px 0", color: "var(--ink-mid)", width: 100, fontFamily: "'Oswald', sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>Phone</td>
                  <td style={{ padding: "8px 0", fontWeight: 700 }}>{biz.phone}</td>
                </tr>
              )}
              {biz.address && (
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px 0", color: "var(--ink-mid)", fontFamily: "'Oswald', sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>Address</td>
                  <td style={{ padding: "8px 0" }}>{biz.address}</td>
                </tr>
              )}
              {cat && (
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px 0", color: "var(--ink-mid)", fontFamily: "'Oswald', sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>Category</td>
                  <td style={{ padding: "8px 0" }}>
                    <Link href={`/${biz.category}`}>{cat.name}</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {biz.website && (
            <a href={`${biz.website}?utm_source=bentonla&utm_medium=directory`}
              target="_blank" rel="noopener"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                background: "#111",
                color: "#f5f2eb",
                padding: "8px 18px",
                textDecoration: "none",
                display: "inline-block",
              }}>
              Visit Website »
            </a>
          )}
          <Link href={`/${biz.category}`} style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            border: "1px solid #111",
            color: "#111",
            padding: "8px 18px",
            textDecoration: "none",
            display: "inline-block",
          }}>
            ← Back to {cat?.name}
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}