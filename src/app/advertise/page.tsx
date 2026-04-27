import type { Metadata } from "next";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Advertise on BentonLA.com — Reach Benton, Louisiana Customers",
  description: "Advertise your Benton, Louisiana business on BentonLA.com. Featured and standard listing options starting at $19/month.",
};

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    color: "#555",
    features: [
      "Listed on category page",
      "Business name & phone",
      "Individual profile page",
      "Bottom of category ranking",
    ],
    cta: "Add Free Listing",
    ctaLink: "/add-listing",
    ctaStyle: "outline",
  },
  {
    name: "Standard",
    price: "$19",
    period: "per month",
    color: "#00008b",
    features: [
      "Everything in Free",
      "Listed on homepage",
      "Full description",
      "Website link with tracking",
      "Address & map link",
      "Middle homepage ranking",
    ],
    cta: "Get Started — $19/mo",
    ctaLink: "https://buy.stripe.com/9B69AUeqIbho8hwfjx9fW01",
    ctaStyle: "solid-blue",
  },
  {
    name: "Featured",
    price: "$49",
    period: "per month",
    color: "#111",
    badge: "Most Popular",
    features: [
      "Everything in Standard",
      "TOP of homepage category",
      "» bullet + bold name",
      "RECOMMENDED badge",
      "Full profile with CTA button",
      "Priority placement always",
    ],
    cta: "Get Featured — $49/mo",
    ctaLink: "https://buy.stripe.com/6oU14o4Q85X4gO2fjx9fW00",
    ctaStyle: "solid-black",
  },
];

export default function AdvertisePage() {
  return (
    <>
      <Masthead />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "28px 16px 60px" }}>

        <p style={{ fontSize: 11, color: "var(--ink-light)", marginBottom: 16, letterSpacing: 1 }}>
          <Link href="/">BENTONLA.COM</Link>
          <span style={{ margin: "0 8px", color: "var(--ink-xlight)" }}>»</span>
          ADVERTISE
        </p>

        <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 8 }}>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
            Reach Benton, Louisiana Customers
          </h1>
        </div>

        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, marginBottom: 32 }}>
          BentonLA.com is the go-to local business directory for Benton and Bossier Parish.
          Get your business in front of thousands of Benton residents and newcomers every month.
        </p>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          background: "#bbb",
          border: "1px solid #bbb",
          marginBottom: 36,
        }}>
          {[
            { stat: "Benton, LA", label: "Fastest Growing Parish Seat" },
            { stat: "33+", label: "Indexed Pages on Google" },
            { stat: "Free", label: "Basic Listing Forever" },
          ].map((s) => (
            <div key={s.stat} style={{ background: "#f5f2eb", padding: "16px 12px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 700 }}>{s.stat}</p>
              <p style={{ fontSize: 11, color: "#888", marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pricing tiers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 40 }}>
          {tiers.map((tier) => (
            <div key={tier.name} style={{
              border: `2px solid ${tier.name === "Featured" ? "#111" : "#bbb"}`,
              padding: "20px 18px",
              background: tier.name === "Featured" ? "#fff" : "#f5f2eb",
              position: "relative",
            }}>
              {tier.badge && (
                <div style={{
                  position: "absolute",
                  top: -1,
                  right: 16,
                  background: "#111",
                  color: "#f5f2eb",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  padding: "3px 10px",
                  fontFamily: "'Oswald', sans-serif",
                }}>
                  {tier.badge}
                </div>
              )}

              <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#999", marginBottom: 6 }}>
                {tier.name}
              </p>
              <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 32, fontWeight: 700, lineHeight: 1 }}>
                {tier.price}
              </p>
              <p style={{ fontSize: 11, color: "#888", marginBottom: 16 }}>{tier.period}</p>

              <ul style={{ listStyle: "none", padding: 0, marginBottom: 20 }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ fontSize: 12, color: "#444", padding: "4px 0", borderBottom: "1px solid #eee", lineHeight: 1.5 }}>
                    <span style={{ color: "#111", marginRight: 6 }}>·</span>{f}
                  </li>
                ))}
              </ul>

              <a href={tier.ctaLink} style={{
                display: "block",
                textAlign: "center",
                fontFamily: "'Oswald', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "10px 16px",
                background: tier.ctaStyle === "outline" ? "transparent" : "#111",
                color: tier.ctaStyle === "outline" ? "#111" : "#f5f2eb",
                border: "1px solid #111",
              }}>
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ borderTop: "2px solid #111", paddingTop: 24 }}>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            Frequently Asked Questions
          </h2>
          {[
            {
              q: "How long does it take to go live?",
              a: "Free listings are reviewed and published within 24 hours. Paid listings go live immediately after payment confirmation.",
            },
            {
              q: "Can I upgrade my free listing later?",
              a: "Absolutely. Email us anytime at bentonlacom@gmail.com and we'll upgrade your existing listing.",
            },
            {
              q: "Is there a contract or commitment?",
              a: "No contracts. Paid listings are month-to-month and can be cancelled anytime.",
            },
            {
              q: "What areas do you serve?",
              a: "BentonLA.com covers Benton, LA and the greater Bossier Parish area including Haughton and surrounding communities.",
            },
          ].map((faq) => (
            <div key={faq.q} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #eee" }}>
              <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{faq.q}</p>
              <p style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>{faq.a}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32, padding: 20, border: "1px dashed #bbb" }}>
          <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
            Questions? Let&apos;s talk.
          </p>
          <a href="mailto:bentonlacom@gmail.com" style={{ fontSize: 13, color: "var(--blue)" }}>
            bentonlacom@gmail.com
          </a>
        </div>

      </main>
      <Footer />
    </>
  );
}