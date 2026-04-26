import Link from "next/link";
import { getEvents, getJobs, getClassifieds } from "@/lib/data";

function SectionHead({ title, link }: { title: string; link: string }) {
  return (
    <h2 style={{
      fontFamily: "'Oswald', sans-serif",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 3,
      textTransform: "uppercase",
      color: "#555",
      borderBottom: "1px solid #bbb",
      paddingBottom: 5,
      marginBottom: 10,
    }}>
      <Link href={link} style={{ color: "#555" }}>{title}</Link>
    </h2>
  );
}

export default async function CommunitySection() {
  const [eventsData, jobsData, classifiedsData] = await Promise.all([
    getEvents(),
    getJobs(),
    getClassifieds(),
  ]);
  return (
    <div style={{
      borderTop: "3px solid #111",
      borderBottom: "3px solid #111",
      margin: "16px 0",
      padding: "14px 0",
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: 12,
      }}>
        <p style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: 11,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "#999",
        }}>Community Board</p>
      </div>

      <div className="dir-grid">
        {/* EVENTS */}
        <div className="dir-col-1">
          <SectionHead title="📅 Upcoming Events" link="/events" />
          {eventsData.map((event, i) => (
            <div key={event.id}>
              <div style={{ marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ display: "block", fontWeight: 700, fontSize: 13 }}>
                  <span style={{ color: "#cc0000", marginRight: 4 }}>·</span>
                  <Link href={event.link}>{event.title}</Link>
                </span>
                <span style={{ display: "block", fontSize: 11, color: "#555" }}>
                  {event.date}
                </span>
                <span style={{ display: "block", fontSize: 11, color: "#888" }}>
                  {event.location}
                </span>
              </div>
              {i < eventsData.length - 1 && (
                <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "6px 0" }} />
              )}
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <Link href="/events" style={{ fontSize: 11, color: "#cc0000" }}>
              » Submit an Event →
            </Link>
          </div>
        </div>

        <div className="dir-divider" />

        {/* JOBS */}
        <div className="dir-col-2">
          <SectionHead title="💼 Local Jobs" link="/jobs" />
          {jobsData.map((job, i) => (
            <div key={job.id}>
              <div style={{ marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ display: "block", fontWeight: 700, fontSize: 13 }}>
                  <span style={{ color: "#cc0000", marginRight: 4 }}>·</span>
                  <Link href={job.link}>{job.title}</Link>
                </span>
                <span style={{ display: "block", fontSize: 11, color: "#555" }}>
                  {job.company}
                </span>
                <span style={{ display: "inline-block", fontSize: 10, color: "#888", border: "1px solid #ddd", padding: "1px 6px", marginTop: 2 }}>
                  {job.type}
                </span>
              </div>
              {i < jobsData.length - 1 && (
                <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "6px 0" }} />
              )}
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <Link href="/jobs" style={{ fontSize: 11, color: "#cc0000" }}>
              » Post a Job →
            </Link>
          </div>
        </div>

        <div className="dir-divider" />

        {/* BUY / SELL */}
        <div className="dir-col-3">
          <SectionHead title="🏷 Buy / Sell" link="/classifieds" />
          {classifiedsData.map((item, i) => (
            <div key={item.id}>
              <div style={{ marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ display: "block", fontWeight: 700, fontSize: 13 }}>
                  <span style={{ color: "#cc0000", marginRight: 4 }}>·</span>
                  <Link href={item.link}>{item.title}</Link>
                </span>
                <span style={{ display: "block", fontSize: 12, color: "#111", fontWeight: 700 }}>
                  {item.price}
                </span>
                <span style={{ display: "block", fontSize: 11, color: "#888" }}>
                  {item.condition}
                </span>
              </div>
              {i < classifiedsData.length - 1 && (
                <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "6px 0" }} />
              )}
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <Link href="/classifieds" style={{ fontSize: 11, color: "#cc0000" }}>
              » Post a Listing →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}