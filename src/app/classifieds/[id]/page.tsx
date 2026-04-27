"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

type Classified = {
  id: string;
  title: string;
  price: string;
  condition: string;
  description: string;
  link: string;
  images: string[] | null;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
};

export default function ClassifiedDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [item, setItem] = useState<Classified | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    supabase.from("classifieds").select("*").eq("id", id).single().then(({ data }) => {
      setItem(data as Classified);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <>
      <Masthead />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 16px" }}>
        <p style={{ color: "#888", fontSize: 13 }}>Loading...</p>
      </main>
      <Footer />
    </>
  );

  if (!item) return (
    <>
      <Masthead />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 16px" }}>
        <p style={{ fontSize: 14, color: "#555" }}>Listing not found or has expired.</p>
        <Link href="/classifieds" style={{ fontSize: 12, color: "var(--blue)", marginTop: 12, display: "block" }}>← Back to Listings</Link>
      </main>
      <Footer />
    </>
  );

  const images = item.images || [];
  const daysLeft = item.expires_at
    ? Math.max(0, Math.ceil((new Date(item.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <>
      <Masthead />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 60px" }}>

        <p style={{ fontSize: 11, color: "var(--ink-light)", marginBottom: 16, letterSpacing: 1 }}>
          <Link href="/">BENTONLA.COM</Link>
          <span style={{ margin: "0 8px" }}>»</span>
          <Link href="/classifieds">BUY / SELL</Link>
          <span style={{ margin: "0 8px" }}>»</span>
          {item.title}
        </p>

        <div style={{ borderBottom: "2px solid #111", paddingBottom: 14, marginBottom: 20 }}>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>
            {item.title}
          </h1>
          <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, color: "#111", marginTop: 6 }}>
            {item.price}
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
            {item.condition && (
              <span style={{ fontSize: 12, color: "#666", border: "1px solid #ddd", padding: "2px 10px" }}>{item.condition}</span>
            )}
            {daysLeft !== null && (
              <span style={{ fontSize: 11, color: daysLeft < 7 ? "#cc0000" : "#aaa" }}>
                Expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
              </span>
            )}
            <span style={{ fontSize: 11, color: "#aaa" }}>
              Posted {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            {/* Main image */}
            <div style={{ marginBottom: 8 }}>
              <img
                src={images[activeImage]}
                alt={`${item.title} photo ${activeImage + 1}`}
                style={{
                  width: "100%",
                  maxHeight: 400,
                  objectFit: "contain",
                  background: "#f0f0f0",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      padding: 0,
                      border: i === activeImage ? "2px solid #111" : "2px solid transparent",
                      background: "none",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={img}
                      alt={`thumb ${i + 1}`}
                      style={{ width: 70, height: 70, objectFit: "cover", display: "block" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {item.description && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 8 }}>
              Description
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "#444" }}>{item.description}</p>
          </div>
        )}

        {/* Contact */}
        {item.link && item.link !== "#" && (
          <div style={{ border: "1px solid #bbb", padding: "16px 18px", marginBottom: 24, background: "#fffef8" }}>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 8 }}>
              Contact Seller
            </p>
            {item.link.startsWith("http") ? (
              <a href={item.link} target="_blank" rel="noopener" style={{ fontSize: 14, color: "var(--blue)" }}>{item.link}</a>
            ) : (
              <p style={{ fontSize: 14, fontWeight: 700 }}>{item.link}</p>
            )}
          </div>
        )}

        <Link href="/classifieds" style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700,
          letterSpacing: 2, textTransform: "uppercase", border: "1px solid #111",
          color: "#111", padding: "8px 18px", textDecoration: "none", display: "inline-block",
        }}>
          ← Back to Listings
        </Link>

      </main>
      <Footer />
    </>
  );
}