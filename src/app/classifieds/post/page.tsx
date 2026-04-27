"use client";
import { useState } from "react";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const categories = [
  "Vehicles", "Real Estate", "Furniture", "Electronics", "Tools & Equipment",
  "Lawn & Garden", "Clothing", "Kids & Baby", "Pets & Animals",
  "Farm & Ranch", "Free Stuff", "Services", "Other",
];

export default function PostClassifiedPage() {
  const [form, setForm] = useState({ title: "", price: "", condition: "", category: "", description: "", contact: "", email: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!form.title || !form.price) { alert("Please fill in item title and price."); return; }
    setStatus("submitting");
    const id = `classified-${Date.now()}`;
    const { error } = await supabase.from("classifieds").insert([{
      id, title: form.title, price: form.price,
      condition: form.condition || form.category,
      description: form.description,
      link: form.contact || "#",
      is_active: false,
    }]);
    if (error) { setStatus("error"); return; }
    setStatus("success");
  };

  const inputStyle = {
    width: "100%", fontFamily: "'Courier Prime', monospace", fontSize: 13,
    padding: "8px 12px", border: "1px solid #999", background: "#fff",
    color: "#111", marginBottom: 14, boxSizing: "border-box" as const,
  };
  const labelStyle = {
    display: "block", fontFamily: "'Oswald', sans-serif", fontSize: 10,
    letterSpacing: 2, textTransform: "uppercase" as const, color: "#555", marginBottom: 4,
  };

  return (
    <>
      <Masthead />
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "28px 16px 60px" }}>
        <p style={{ fontSize: 11, color: "var(--ink-light)", marginBottom: 16, letterSpacing: 1 }}>
          <Link href="/">BENTONLA.COM</Link>
          <span style={{ margin: "0 8px" }}>»</span>
          <Link href="/classifieds">BUY / SELL</Link>
          <span style={{ margin: "0 8px" }}>»</span>
          POST
        </p>

        <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
            Post a Listing
          </h1>
          <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>Free · Reviewed within 24 hours</p>
        </div>

        {status === "success" ? (
          <div style={{ border: "2px solid #111", padding: 24, textAlign: "center" }}>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>✓ Submitted!</p>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>Your listing is under review and will be published within 24 hours.</p>
            <Link href="/classifieds" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", background: "#111", color: "#f5f2eb", padding: "8px 20px", textDecoration: "none", display: "inline-block" }}>
              ← Back to Listings
            </Link>
          </div>
        ) : (
          <div>
            <label style={labelStyle}>Item Title * <span style={{ color: "#999" }}>({form.title.length}/100)</span></label>
            <input name="title" value={form.title} onChange={handle} maxLength={100} placeholder="e.g. 2019 Ford F-150 XLT" style={inputStyle} />

            <label style={labelStyle}>Price *</label>
            <input name="price" value={form.price} onChange={handle} maxLength={40} placeholder="e.g. $1,200 or Free" style={inputStyle} />

            <label style={labelStyle}>Category</label>
            <select name="category" value={form.category} onChange={handle} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">Select a category...</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label style={labelStyle}>Condition</label>
            <input name="condition" value={form.condition} onChange={handle} maxLength={50} placeholder="e.g. Like New, Used, For Sale, etc." style={inputStyle} />

            <label style={labelStyle}>Description <span style={{ color: "#999" }}>({form.description.length}/400)</span></label>
            <textarea name="description" value={form.description} onChange={handle} rows={4} maxLength={400} placeholder="Describe the item — condition, features, why you're selling..." style={{ ...inputStyle, resize: "vertical" }} />

            <label style={labelStyle}>Contact Info or Link</label>
            <input name="contact" value={form.contact} onChange={handle} maxLength={200} placeholder="Phone, Facebook link, or website" style={inputStyle} />

            <label style={labelStyle}>Your Email (for confirmation)</label>
            <input name="email" value={form.email} onChange={handle} maxLength={100} placeholder="you@email.com" style={inputStyle} />

            {status === "error" && <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 12 }}>Something went wrong. Please try again.</p>}

            <button onClick={submit} disabled={status === "submitting"} style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 700,
              letterSpacing: 2, textTransform: "uppercase",
              background: status === "submitting" ? "#888" : "#111",
              color: "#f5f2eb", border: "none", padding: "12px 28px",
              cursor: status === "submitting" ? "not-allowed" : "pointer", width: "100%",
            }}>
              {status === "submitting" ? "Submitting..." : "Post Listing »"}
            </button>

            <p style={{ fontSize: 11, color: "#999", textAlign: "center", marginTop: 12 }}>
              All listings are reviewed before publishing. No adult content or illegal items.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}