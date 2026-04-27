import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "3px solid #111",
      textAlign: "center",
      padding: "14px",
      fontSize: 11,
      color: "var(--ink-light)",
      letterSpacing: 1,
      marginTop: 8,
      background: "var(--bg-alt)",
    }}>
      <div style={{ marginBottom: 6 }}>
        <Link href="/">HOME</Link>
        <span style={{ margin: "0 8px", color: "var(--ink-xlight)" }}>|</span>
        <Link href="/add-listing">ADD LISTING</Link>
        <span style={{ margin: "0 8px", color: "var(--ink-xlight)" }}>|</span>
        <Link href="/advertise">ADVERTISE</Link>
        <span style={{ margin: "0 8px", color: "var(--ink-xlight)" }}>|</span>
        <a href="mailto:bentonlacom@gmail.com">CONTACT</a>
        <span style={{ margin: "0 8px", color: "var(--ink-xlight)" }}>|</span>
        <Link href="/sitemap.xml">SITEMAP</Link>
      </div>
      <div>© {new Date().getFullYear()} BENTONLA.COM · ALL RIGHTS RESERVED · BENTON, LOUISIANA · BOSSIER PARISH</div>
    </footer>
  );
}