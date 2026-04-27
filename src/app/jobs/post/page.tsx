"use client";
import { useState } from "react";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function PostJobPage() {
  const [form, setForm] = useState({ title: "", company: "", type: "Full-Time", pay: "", description: "", link: "", email: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!form.title || !form.company) { alert("Please fill in job title and company name."); return; }
    setStatus("submitting");
    const id = `job-${Date.now()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const { error } = await supabase.from("jobs").insert([{
      id, title: form.title, company: form.company, type: form.type,
      pay: form.pay || null, description: form.description,
      link: form.link || "#",
      is_active: false,
      expires_at: expiresAt.toISOString(),
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
          <Link href="/jobs">JOBS</Link>
          <span style={{ margin: "0 8px" }}>»</span>
          POST A JOB
        </p>

        <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
            Post a Job
          </h1>
          <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>Free for Benton area businesses · Reviewed within 24 hours</p>
        </div>

        {status === "success" ? (
          <div style={{ border: "2px solid #111", padding: 24, textAlign: "center" }}>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>✓ Submitted!</p>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>Your job listing is under review and will be published within 24 hours.</p>
            <Link href="/jobs" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", background: "#111", color: "#f5f2eb", padding: "8px 20px", textDecoration: "none", display: "inline-block" }}>
              ← Back to Jobs
            </Link>
          </div>
        ) : (
          <div>
            <label style={labelStyle}>Job Title * <span style={{ color: "#999" }}>({form.title.length}/100)</span></label>
            <input name="title" value={form.title} onChange={handle} maxLength={100} placeholder="e.g. Residential Cleaning Technician" style={inputStyle} />

            <label style={labelStyle}>Company Name *</label>
            <input name="company" value={form.company} onChange={handle} maxLength={100} placeholder="e.g. Gleaux Cleaning LLC" style={inputStyle} />

            <label style={labelStyle}>Job Type</label>
            <select name="type" value={form.type} onChange={handle} style={{ ...inputStyle, cursor: "pointer" }}>
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Contract</option>
              <option>Commission</option>
              <option>Temporary</option>
            </select>

            <label style={labelStyle}>Pay / Salary (optional)</label>
            <input name="pay" value={form.pay} onChange={handle} maxLength={80} placeholder="e.g. $15–$18/hr or $45,000/yr" style={inputStyle} />

            <label style={labelStyle}>Job Description <span style={{ color: "#999" }}>({form.description.length}/500)</span></label>
            <textarea name="description" value={form.description} onChange={handle} rows={4} maxLength={500} placeholder="Describe the role, requirements, and how to apply..." style={{ ...inputStyle, resize: "vertical" }} />

            <label style={labelStyle}>Apply Link or Website (optional)</label>
            <input name="link" value={form.link} onChange={handle} maxLength={200} placeholder="https://..." style={inputStyle} />

            <label style={labelStyle}>Your Email (for confirmation)</label>
            <input name="email" value={form.email} onChange={handle} maxLength={100} placeholder="you@yourbusiness.com" style={inputStyle} />

            {status === "error" && <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 12 }}>Something went wrong. Please try again.</p>}

            <button onClick={submit} disabled={status === "submitting"} style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 700,
              letterSpacing: 2, textTransform: "uppercase",
              background: status === "submitting" ? "#888" : "#111",
              color: "#f5f2eb", border: "none", padding: "12px 28px",
              cursor: status === "submitting" ? "not-allowed" : "pointer", width: "100%",
            }}>
              {status === "submitting" ? "Submitting..." : "Post Job »"}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}