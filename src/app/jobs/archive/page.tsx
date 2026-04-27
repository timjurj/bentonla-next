import type { Metadata } from "next";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Past Job Listings Archive — Benton, LA | BentonLA.com",
  description: "Archive of past job listings in Benton, Louisiana and Bossier Parish.",
  alternates: { canonical: "https://www.bentonla.com/jobs/archive" },
};

export const dynamic = "force-dynamic";

export default async function JobsArchivePage() {
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("archived", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <Masthead />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 60px" }}>
        <p style={{ fontSize: 11, color: "var(--ink-light)", marginBottom: 16, letterSpacing: 1 }}>
          <Link href="/">BENTONLA.COM</Link>
          <span style={{ margin: "0 8px" }}>»</span>
          <Link href="/jobs">JOBS</Link>
          <span style={{ margin: "0 8px" }}>»</span>
          ARCHIVE
        </p>
        <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              💼 Past Jobs Archive
            </h1>
            <p style={{ fontSize: 11, color: "#888", marginTop: 6 }}>Benton, LA &amp; Bossier Parish · {jobs?.length || 0} archived listings</p>
          </div>
          <Link href="/jobs" style={{ fontSize: 11, fontFamily: "'Oswald', sans-serif", letterSpacing: 2, textTransform: "uppercase", color: "var(--blue)" }}>
            ← Current Jobs
          </Link>
        </div>

        {!jobs || jobs.length === 0 ? (
          <p style={{ color: "#888", fontSize: 13 }}>No archived jobs yet.</p>
        ) : (
          <div>
            {jobs.map((job: { id: string; title: string; company: string; type: string; pay?: string; description?: string }, i: number) => (
              <div key={job.id}>
                <div style={{ padding: "12px 0", lineHeight: 1.6, opacity: 0.8 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                    <span style={{ color: "#aaa", marginRight: 6 }}>·</span>
                    {job.title}
                    <span style={{ fontSize: 10, background: "#eee", color: "#888", padding: "1px 6px", marginLeft: 8, fontWeight: 400, textTransform: "uppercase", letterSpacing: 1 }}>Expired</span>
                  </p>
                  <p style={{ fontSize: 12, color: "#888" }}>{job.company} · {job.type}</p>
                  {job.pay && <p style={{ fontSize: 12, color: "#aaa" }}>{job.pay}</p>}
                  {job.description && <p style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>{job.description}</p>}
                </div>
                {i < jobs.length - 1 && <hr style={{ border: "none", borderTop: "1px solid #f0f0f0" }} />}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}