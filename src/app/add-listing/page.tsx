"use client";
import { useState } from "react";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { notify, notifyAll } from "@/lib/notify";

const categoryOptions = [
  "Home Services", "Plumbers", "Electricians", "HVAC", "Contractors",
  "Restaurants", "Shopping", "Pharmacies", "Gyms & Fitness",
  "Real Estate", "Health & Medical", "Dentists", "Automotive",
  "Daycares", "Veterinarians", "Hair Salons & Barbers",
  "Insurance", "Lawyers & Legal", "Churches", "Education", "Government", "Other",
];

export default function AddListingPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", website: "", address: "", category: "", description: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!form.name || !form.email || !form.category) {
      alert("Please fill in your business name, email, and category.");
      return;
    }
    setStatus("submitting");
    const { error } = await supabase.from("submissions").insert([{
      type: "business",
      name: form.name,
      email: form.email,
      phone: form.phone,
      website: form.website,
      address: form.address,
      category: form.category,
      description: form.description,
      status: "pending",
    }]);
    if (error) { setStatus("error"); return; }
    await notifyAll("business", { ...form });
    setStatus("success");
  };

  const inputStyle = {
    width: "100%",
    fontFamily: "'Courier Prime', monospace",
    fontSize: 13,
    padding: "8px 12px",
    border: "1px solid #999",
    background: "#fff",
    color: "#111",
    marginBottom: 14,
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    fontFamily: "'Oswald', sans-serif",
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
    color: "#555",
    marginBottom: 4,
  };

  return (
    <>
      <Masthead />
      <main style={{ maxWidth: 580, margin: "0 auto", padding: "28px 16px 60px" }}>

        <p style={{ fontSize: 11, color: "var(--ink-light)", marginBottom: 16, letterSpacing: 1 }}>
          <Link href="/">BENTONLA.COM</Link>
          <span style={{ margin: "0 8px", color: "var(--ink-xlight)" }}>»</span>
          ADD YOUR LISTING
        </p>

        <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
            Add Your Business
          </h1>
          <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
            Free listings are reviewed and published within 24 hours.
          </p>
        </div>

        {status === "success" ? (
          <div style={{ border: "2px solid #111", padding: 24, textAlign: "center" }}>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              ✓ Submitted!
            </p>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
              Your listing is under review and will be published within 24 hours. We'll email you when it's live.
            </p>
            <p style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>
              Want to appear on the homepage and get more visibility?
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://buy.stripe.com/9B69AUeqIbho8hwfjx9fW01" target="_blank" rel="noopener" style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700,
                letterSpacing: 2, textTransform: "uppercase", background: "#00008b",
                color: "#fff", padding: "8px 18px", textDecoration: "none", display: "inline-block",
              }}>
                Standard — $19/mo »
              </a>
              <a href="https://buy.stripe.com/6oU14o4Q85X4gO2fjx9fW00" target="_blank" rel="noopener" style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700,
                letterSpacing: 2, textTransform: "uppercase", background: "#111",
                color: "#f5f2eb", padding: "8px 18px", textDecoration: "none", display: "inline-block",
              }}>
                Featured — $49/mo »
              </a>
            </div>
          </div>
        ) : (
          <div>
            {/* Tier info */}
            <div style={{ border: "1px solid #bbb", padding: "12px 14px", marginBottom: 24, background: "#fffef8", fontSize: 12, lineHeight: 1.8 }}>
              <strong style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>
                Free Listing Includes:
              </strong>
              <ul style={{ marginTop: 6, paddingLeft: 16, color: "#555" }}>
                <li>Listed on your category page</li>
                <li>Business name, phone & address</li>
                <li>Individual business profile page</li>
                <li>Reviewed & published within 24 hours</li>
              </ul>
              <p style={{ marginTop: 8, color: "#888" }}>
                Want homepage placement?{" "}
                <Link href="/advertise" style={{ color: "var(--red)" }}>See paid options →</Link>
              </p>
            </div>

            <label style={labelStyle}>Business Name * <span style={{ color: "#999", fontSize: 10 }}>({form.name.length}/80)</span></label>
            <input name="name" value={form.name} onChange={handle} placeholder="e.g. Gleaux Cleaning LLC" maxLength={80} style={inputStyle} />

            <label style={labelStyle}>Your Email *</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@yourbusiness.com" maxLength={100} style={inputStyle} />

            <label style={labelStyle}>Phone Number</label>
            <input name="phone" value={form.phone} onChange={handle} placeholder="(318) 555-0101" maxLength={20} style={inputStyle} />

            <label style={labelStyle}>Website</label>
            <input name="website" value={form.website} onChange={handle} placeholder="https://yourbusiness.com" maxLength={200} style={inputStyle} />

            <label style={labelStyle}>Address</label>
            <input name="address" value={form.address} onChange={handle} placeholder="123 Main St, Benton, LA 71006" maxLength={150} style={inputStyle} />

            <label style={labelStyle}>Category *</label>
            <select name="category" value={form.category} onChange={handle} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">Select a category...</option>
              {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label style={labelStyle}>Tell us about your business <span style={{ color: "#999", fontSize: 10 }}>({form.description.length}/500)</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handle}
              rows={4}
              maxLength={500}
              placeholder="Brief description of your services..."
              style={{ ...inputStyle, resize: "vertical" }}
            />

            {status === "error" && (
              <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 12 }}>
                Something went wrong. Please try again or email us directly.
              </p>
            )}

            <button
              onClick={submit}
              disabled={status === "submitting"}
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                background: status === "submitting" ? "#888" : "#111",
                color: "#f5f2eb",
                border: "none",
                padding: "12px 28px",
                cursor: status === "submitting" ? "not-allowed" : "pointer",
                width: "100%",
              }}
            >
              {status === "submitting" ? "Submitting..." : "Submit Free Listing »"}
            </button>

            <p style={{ fontSize: 11, color: "#999", textAlign: "center", marginTop: 12 }}>
              By submitting you agree to our listing guidelines. We reserve the right to decline any submission.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}