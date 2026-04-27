import type { Metadata } from "next";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import { getJobs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Local Jobs in Benton, LA | BentonLA.com",
  description: "Find local job listings in Benton, Louisiana and Bossier Parish. Full-time, part-time, and contract positions.",
  alternates: { canonical: "https://www.bentonla.com/jobs" },
};

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await getJobs();

  const typeColor: Record<string, string> = {
    "Full-Time": "#2d7a4f",
    "Part-Time": "#2255aa",
    "Contract": "#7a5c2d",
    "Commission": "#7a2d7a",
    "Temporary": "#555",
  };

  return (
    <>
      <Masthead />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 60px" }}>

        <p style={{ fontSize: 11, color: "var(--ink-light)", marginBottom: 16, letterSpacing: 1 }}>
          <Link href="/">BENTONLA.COM</Link>
          <span style={{ margin: "0 8px", color: "var(--ink-xlight)" }}>»</span>
          JOBS
        </p>

        <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              💼 Local Jobs
            </h1>
            <p style={{ fontSize: 11, color: "#888", marginTop: 6 }}>{jobs.length} listing{jobs.length !== 1 ? "s" : ""} · Benton, LA &amp; Bossier Parish</p>
          </div>
          <Link href="/jobs/post" style={{
            fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 2, textTransform: "uppercase", background: "#111",
            color: "#f5f2eb", padding: "8px 16px", textDecoration: "none",
          }}>
            + Post a Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
            <p style={{ fontSize: 14 }}>No job listings yet.</p>
            <Link href="/jobs/post" style={{ color: "var(--red)", fontSize: 12, marginTop: 8, display: "block" }}>Post the first job →</Link>
          </div>
        ) : (
          <div>
            {jobs.map((job: { id: string; title: string; company: string; type: string; description?: string; pay?: string; link: string }, i: number) => (
              <div key={job.id}>
                <div style={{ padding: "16px 0", lineHeight: 1.6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>
                        <span style={{ color: "var(--red)", marginRight: 6 }}>»</span>
                        {job.link && job.link !== "#"
                          ? <a href={job.link} target="_blank" rel="noopener">{job.title}</a>
                          : job.title
                        }
                      </p>
                      <p style={{ fontSize: 13, color: "#555" }}>{job.company}</p>
                      {job.pay && <p style={{ fontSize: 12, color: "#333", fontWeight: 700, marginTop: 2 }}>{job.pay}</p>}
                      {job.description && <p style={{ fontSize: 12, color: "#777", marginTop: 6, lineHeight: 1.7 }}>{job.description}</p>}
                    </div>
                    <div style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
                      padding: "4px 10px", border: "1px solid",
                      color: typeColor[job.type] || "#555",
                      borderColor: typeColor[job.type] || "#555",
                      whiteSpace: "nowrap",
                    }}>
                      {job.type}
                    </div>
                  </div>
                </div>
                {i < jobs.length - 1 && <hr style={{ border: "none", borderTop: "1px solid #eee" }} />}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 32, border: "1px dashed #bbb", padding: 20, textAlign: "center" }}>
          <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
            Hiring in Benton?
          </p>
          <p style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>
            Post a job listing and reach the Benton community. Free for local businesses.
          </p>
          <Link href="/jobs/post" style={{
            fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 2, textTransform: "uppercase", background: "#111",
            color: "#f5f2eb", padding: "10px 20px", textDecoration: "none", display: "inline-block",
          }}>
            Post a Job »
          </Link>
        </div>

        <div style={{ textAlign: "center", marginTop: 14 }}>
          <Link href="/jobs/archive" style={{ fontSize: 11, color: "#aaa", fontFamily: "'Oswald', sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>
            View Past Jobs Archive →
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}