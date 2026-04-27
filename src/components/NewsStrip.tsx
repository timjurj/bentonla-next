import Link from "next/link";
import { supabase } from "@/lib/supabase";

type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
};

export default async function NewsStrip() {
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(5);

  const items = (data as NewsItem[]) || [];
  if (items.length === 0) return null;

  return (
    <div style={{
      borderTop: "2px solid #111",
      borderBottom: "1px solid #bbb",
      background: "#f5f2eb",
      padding: "7px 16px",
      display: "flex",
      alignItems: "center",
      gap: 0,
      flexWrap: "wrap",
      lineHeight: 1.6,
    }}>
      {/* Label */}
      <span style={{
        fontFamily: "'Oswald', sans-serif",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: "#fff",
        background: "#cc0000",
        padding: "2px 8px",
        marginRight: 14,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}>
        Benton News
      </span>

      {/* Headlines */}
      <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0, flex: 1 }}>
        {items.map((item, i) => (
          <span key={item.id} style={{ display: "inline-flex", alignItems: "center" }}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12,
                color: "var(--blue)",
                textDecoration: "none",
                fontFamily: "'Courier Prime', monospace",
              }}
            >
              {item.title}
              {item.source && (
                <span style={{ color: "#999", fontSize: 10, marginLeft: 4 }}>
                  ({item.source})
                </span>
              )}
            </a>
            {i < items.length - 1 && (
              <span style={{ color: "#bbb", margin: "0 10px", fontSize: 11 }}>·</span>
            )}
          </span>
        ))}
      </span>

      {/* Manage link */}
      <Link href="/news" style={{
        fontFamily: "'Oswald', sans-serif",
        fontSize: 9,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: "#aaa",
        marginLeft: 14,
        whiteSpace: "nowrap",
        flexShrink: 0,
        textDecoration: "none",
      }}>
        More »
      </Link>
    </div>
  );
}