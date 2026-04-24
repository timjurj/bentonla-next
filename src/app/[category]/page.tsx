import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import businessData from "@/data/businesses.json";
import { categories, getCategoryBySlug } from "@/data/categories";
import type { Business } from "@/types/business";

const businesses = businessData as Business[];

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  return {
    title: cat.title,
    description: cat.metaDescription,
    alternates: { canonical: `https://www.bentonla.com/${category}` },
    openGraph: {
      title: cat.title,
      description: cat.metaDescription,
      url: `https://www.bentonla.com/${category}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const bizList = businesses
    .filter((b) => b.category === category && b.is_active)
    .sort((a, b) => {
      const order = { featured: 0, premium: 1, standard: 2, free: 3 };
      return order[a.tier] - order[b.tier];
    });

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: cat.title,
    description: cat.metaDescription,
    url: `https://www.bentonla.com/${category}`,
    itemListElement: bizList.map((biz, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: biz.name,
      url: `https://www.bentonla.com/business/${biz.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Masthead />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 48px" }}>

        {/* Breadcrumb */}
        <p style={{ fontSize: 11, color: "var(--ink-light)", marginBottom: 16, letterSpacing: 1 }}>
          <Link href="/">BENTONLA.COM</Link>
          <span style={{ margin: "0 8px", color: "var(--ink-xlight)" }}>»</span>
          <span style={{ textTransform: "uppercase" }}>{cat.name}</span>
        </p>

        {/* Page header */}
        <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 20 }}>
          <h1 style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            lineHeight: 1.1,
          }}>
            {cat.icon} {cat.title}
          </h1>
          <p style={{ fontSize: 11, color: "var(--ink-light)", marginTop: 6, letterSpacing: 1 }}>
            {bizList.length} LISTINGS · BENTON, LA &amp; BOSSIER PARISH
          </p>
        </div>

        {/* SEO intro copy */}
        <p style={{
          fontSize: 13,
          lineHeight: 1.8,
          color: "#444",
          marginBottom: 24,
          padding: "12px 14px",
          borderLeft: "3px solid var(--ink)",
          background: "#fffef8",
        }}>
          {cat.seoIntro}
        </p>

        {/* Listings */}
        <div>
          {bizList.map((biz, i) => (
            <div key={biz.id}>
              <BusinessCard biz={biz} />
              {i < bizList.length - 1 && (
                <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "10px 0" }} />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 32,
          border: "1px dashed var(--border)",
          padding: "18px",
          textAlign: "center",
          fontSize: 12,
        }}>
          <p style={{ marginBottom: 8, color: "#888" }}>
            Is your {cat.name.toLowerCase()} business in Benton, LA missing from this list?
          </p>
          <Link href="/add-listing" style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}>
            » Add Your Free Listing «
          </Link>
          <span style={{ margin: "0 10px", color: "var(--ink-xlight)" }}>|</span>
          <Link href="/advertise" style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "var(--red)",
          }}>
            » Go Featured — $49/mo «
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}