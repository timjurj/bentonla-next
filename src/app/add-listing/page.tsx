"use client";
import { useState } from "react";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { notifyAll } from "@/lib/notify";

const categoryOptions = [
  "Home Services", "Plumbers", "Electricians", "HVAC", "Contractors",
  "Restaurants", "Shopping", "Pharmacies", "Gyms & Fitness",
  "Real Estate", "Health & Medical", "Dentists", "Automotive",
  "Daycares", "Veterinarians", "Hair Salons & Barbers",
  "Insurance", "Lawyers & Legal", "Churches", "Education", "Government", "Other",
];

const tiers = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Listed on category page only",
    stripeLink: null,
  },
  {
    id: "standard",
    name: "Standard",
    price: "$19/mo",
    description: "Homepage listing + website link + full description",
    stripeLink: "https://buy.stripe.com/9B69AUeqIbho8hwfjx9fW01",
  },
  {
    id: "featured",
    name: "Featured",
    price: "$49/mo",
    description: "Top of homepage + Recommended badge + priority placement",
    stripeLink: "https://buy.stripe.com/6oU14o4Q85X4gO2fjx9fW00",
  },
];

export default function AddListingPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", website: "", address: "", category: "", description: "",
  });
  const [selectedTier, setSelectedTier] = useState("free");
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
    await notifyAll("business", { ...form, tier: selectedTier });

    // Redirect to Stripe if paid tier selected
    const tier = tiers.find(t => t.id === selectedTier);
    if (tier?.stripeLink) {
      // Small delay so Supabase insert completes
      setTimeout(() => {
        window.location.href = `${tier.stripeLink}?prefilled_email=${encodeURIComponent(form.email)}`;
      }, 800);
    } else {
      setStatus("success");
    }
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
      <main style={{ maxWidth: 580, margin: "0 auto", padding: "28px 16px 60px" }}>

        <p style={{ fontSize: 11, color: "var(--ink-light)", marginBottom: 16, letterSpacing: 1 }}>
          <Link href="/">BENTONLA.COM</Link>
          <span style={{ margin: "0 8px", color: "var(--ink-xlight)" }}>»</span>
          ADD YOUR LISTING
        </p>

        <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
            List Your Business
          </h1>
          <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
            Free listings reviewed within 24 hours. Paid listings go live immediately after payment.
          </p>
        </div>

        {status === "success" ? (
          <div style={{ border: "2px solid #111", padding: 24, textAlign: "center" }}>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>✓ Submitted!</p>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
              Your listing is under review and will be published within 24 hours. We&apos;ll email you when it&apos;s live.
            </p>
            <Link href="/" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", background: "#111", color: "#f5f2eb", padding: "8px 20px", textDecoration: "none", display: "inline-block" }}>
              ← Back to BentonLA.com
            </Link>
          </div>
        ) : (
          <div>
            {/* Tier selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Select Your Listing Plan</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {tiers.map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    style={{
                      padding: "12px 10px",
                      border: selectedTier === tier.id ? "2px solid #111" : "1px solid #ccc",
                      background: selectedTier === tier.id ? "#111" : "#fff",
                      color: selectedTier === tier.id ? "#f5f2eb" : "#111",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
                      {tier.name}
                    </p>
                    <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                      {tier.price}
                    </p>
                    <p style={{ fontSize: 10, lineHeight: 1.5, opacity: 0.8 }}>
                      {tier.description}
                    </p>
                  </button>
                ))}
              </div>
              {selectedTier !== "free" && (
                <p style={{ fontSize: 11, color: "#888", marginTop: 8, textAlign: "center" }}>
                  After submitting your info you&apos;ll be taken to Stripe to complete payment. Your listing goes live immediately.
                </p>
              )}
            </div>

            <label style={labelStyle}>Business Name * <span style={{ color: "#999" }}>({form.name.length}/80)</span></label>
            <input name="name" value={form.name} onChange={handle} maxLength={80} placeholder="e.g. Gleaux Cleaning LLC" style={inputStyle} />

            <label style={labelStyle}>Your Email *</label>
            <input name="email" type="email" value={form.email} onChange={handle} maxLength={100} placeholder="you@yourbusiness.com" style={inputStyle} />

            <label style={labelStyle}>Phone Number</label>
            <input name="phone" value={form.phone} onChange={handle} maxLength={20} placeholder="(318) 555-0101" style={inputStyle} />

            <label style={labelStyle}>Website</label>
            <input name="website" value={form.website} onChange={handle} maxLength={200} placeholder="https://yourbusiness.com" style={inputStyle} />

            <label style={labelStyle}>Address</label>
            <input name="address" value={form.address} onChange={handle} maxLength={150} placeholder="123 Main St, Benton, LA 71006" style={inputStyle} />

            <label style={labelStyle}>Category *</label>
            <select name="category" value={form.category} onChange={handle} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">Select a category...</option>
              {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label style={labelStyle}>Tell us about your business <span style={{ color: "#999" }}>({form.description.length}/500)</span></label>
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
                Something went wrong. Please try again.
              </p>
            )}

            <button
              onClick={submit}
              disabled={status === "submitting"}
              style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 700,
                letterSpacing: 2, textTransform: "uppercase",
                background: status === "submitting" ? "#888" : "#111",
                color: "#f5f2eb", border: "none", padding: "12px 28px",
                cursor: status === "submitting" ? "not-allowed" : "pointer", width: "100%",
              }}
            >
              {status === "submitting"
                ? "Submitting..."
                : selectedTier === "free"
                  ? "Submit Free Listing »"
                  : `Continue to Payment — ${tiers.find(t => t.id === selectedTier)?.price} »`
              }
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