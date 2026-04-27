"use client";
import { useState } from "react";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function SubmitEventPage() {
  const [form, setForm] = useState({ title: "", date: "", location: "", description: "", link: "", email: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!form.title || !form.date || !form.location) {
      alert("Please fill in event title, date, and location.");
      return;
    }
    setStatus("submitting");
    const id = `event-${Date.now()}`;
    const { error } = await supabase.from("events").insert([{
      id, title: form.title, date: form.date,
      location: form.location, description: form.description,
      link: form.link || "#", is_active: false,
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
          <Link href="/events">EVENTS</Link>
          <span style={{ margin: "0 8px" }}>»</span>
          SUBMIT
        </p>

        <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
            Submit an Event
          </h1>
          <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>Free · Reviewed within 24 hours</p>
        </div>

        {status === "success" ? (
          <div style={{ border: "2px solid #111", padding: 24, textAlign: "center" }}>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>✓ Submitted!</p>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>Your event is under review and will be published within 24 hours.</p>
            <Link href="/events" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", background: "#111", color: "#f5f2eb", padding: "8px 20px", textDecoration: "none", display: "inline-block" }}>
              ← Back to Events
            </Link>
          </div>
        ) : (
          <div>
            <label style={labelStyle}>Event Title * <span style={{ color: "#999" }}>({form.title.length}/100)</span></label>
            <input name="title" value={form.title} onChange={handle} maxLength={100} placeholder="e.g. Benton Farmers Market" style={inputStyle} />

            <label style={labelStyle}>Date &amp; Time *</label>
            <input name="date" value={form.date} onChange={handle} maxLength={80} placeholder="e.g. Saturday May 10, 9AM–1PM" style={inputStyle} />

            <label style={labelStyle}>Location *</label>
            <input name="location" value={form.location} onChange={handle} maxLength={150} placeholder="e.g. Town Square, Benton, LA" style={inputStyle} />

            <label style={labelStyle}>Description <span style={{ color: "#999" }}>({form.description.length}/300)</span></label>
            <textarea name="description" value={form.description} onChange={handle} rows={3} maxLength={300} placeholder="Brief description of the event..." style={{ ...inputStyle, resize: "vertical" }} />

            <label style={labelStyle}>Event Website or Link (optional)</label>
            <input name="link" value={form.link} onChange={handle} maxLength={200} placeholder="https://..." style={inputStyle} />

            <label style={labelStyle}>Your Email (for confirmation)</label>
            <input name="email" value={form.email} onChange={handle} maxLength={100} placeholder="you@email.com" style={inputStyle} />

            {status === "error" && <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 12 }}>Something went wrong. Please try again.</p>}

            <button onClick={submit} disabled={status === "submitting"} style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 700,
              letterSpacing: 2, textTransform: "uppercase", background: status === "submitting" ? "#888" : "#111",
              color: "#f5f2eb", border: "none", padding: "12px 28px",
              cursor: status === "submitting" ? "not-allowed" : "pointer", width: "100%",
            }}>
              {status === "submitting" ? "Submitting..." : "Submit Event »"}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}