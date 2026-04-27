"use client";
// Force dynamic rendering
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  category: string;
  description: string;
  status: string;
  created_at: string;
};

type Business = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  phone: string;
  website: string;
  address: string;
  tier: string;
  is_active: boolean;
  is_new: boolean;
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<"submissions" | "businesses">("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Business | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    const [{ data: subs }, { data: biz }] = await Promise.all([
      supabase.from("submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("businesses").select("*").order("category"),
    ]);
    setSubmissions((subs as Submission[]) || []);
    setBusinesses((biz as Business[]) || []);
    setLoading(false);
  }

  async function approveSubmission(sub: Submission) {
    const slug = sub.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { error } = await supabase.from("businesses").insert([{
      id: slug, slug,
      name: sub.name,
      category: sub.category.toLowerCase().replace(/\s+/g, "-"),
      tagline: sub.category + " · Benton, LA",
      description: sub.description || sub.name + " serves Benton and Bossier Parish.",
      phone: sub.phone, website: sub.website || null,
      address: sub.address, tier: "free", is_new: true, is_active: true,
    }]);
    if (!error) { await supabase.from("submissions").update({ status: "approved" }).eq("id", sub.id); fetchAll(); }
    else alert("Error: " + error.message);
  }

  async function rejectSubmission(id: string) {
    await supabase.from("submissions").update({ status: "rejected" }).eq("id", id);
    fetchAll();
  }

  async function toggleActive(biz: Business) {
    await supabase.from("businesses").update({ is_active: !biz.is_active }).eq("id", biz.id);
    fetchAll();
  }

  async function updateTier(id: string, tier: string) {
    await supabase.from("businesses").update({ tier }).eq("id", id);
    fetchAll();
  }

  async function deleteBusiness(id: string) {
    if (!confirm("Delete this business? This cannot be undone.")) return;
    await supabase.from("businesses").delete().eq("id", id);
    fetchAll();
  }

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    const { error } = await supabase.from("businesses").update({
      name: editing.name,
      tagline: editing.tagline,
      description: editing.description,
      phone: editing.phone,
      website: editing.website,
      address: editing.address,
      category: editing.category,
      tier: editing.tier,
      is_active: editing.is_active,
      is_new: editing.is_new,
    }).eq("id", editing.id);
    setSaving(false);
    if (error) alert("Save failed: " + error.message);
    else { setEditing(null); fetchAll(); }
  }

  const pendingSubs = submissions.filter(s => s.status === "pending");
  const filteredBiz = businesses.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  const s = {
    container: { minHeight: "100vh", background: "#0f0f14", color: "#e8e8f0", fontFamily: "'Courier Prime', monospace", fontSize: 13 },
    header: { background: "#111", borderBottom: "1px solid #222", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    title: { fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" as const, color: "#f5f2eb" },
    main: { maxWidth: 1100, margin: "0 auto", padding: "24px 16px" },
    tab: (active: boolean) => ({
      fontFamily: "'Oswald', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" as const,
      padding: "8px 18px", border: "1px solid #333",
      background: active ? "#f5f2eb" : "transparent", color: active ? "#111" : "#888",
      cursor: "pointer", marginRight: 8,
    }),
    card: { background: "#1a1a22", border: "1px solid #2a2a35", borderRadius: 6, padding: "14px 16px", marginBottom: 10 },
    badge: (tier: string) => ({
      display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: 1,
      textTransform: "uppercase" as const, padding: "2px 8px", borderRadius: 3,
      background: tier === "featured" ? "#3ecf8e22" : tier === "premium" ? "#4a9eff22" : "#ffffff08",
      color: tier === "featured" ? "#3ecf8e" : tier === "premium" ? "#4a9eff" : "#aaa",
      border: `1px solid ${tier === "featured" ? "#3ecf8e44" : tier === "premium" ? "#4a9eff44" : "#333"}`,
    }),
    btn: (color: string) => ({
      fontFamily: "'Oswald', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1,
      textTransform: "uppercase" as const, padding: "4px 12px", border: "none", borderRadius: 3,
      background: color, color: "#fff", cursor: "pointer", marginLeft: 6,
    }),
    input: {
      background: "#1a1a22", border: "1px solid #333", color: "#e8e8f0",
      fontFamily: "'Courier Prime', monospace", fontSize: 13, padding: "7px 12px",
      width: "100%", marginBottom: 16, boxSizing: "border-box" as const,
    },
    select: { background: "#1a1a22", border: "1px solid #333", color: "#e8e8f0", fontFamily: "'Courier Prime', monospace", fontSize: 12, padding: "3px 8px", cursor: "pointer" },
    modalOverlay: {
      position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16,
    },
    modal: {
      background: "#1a1a22", border: "1px solid #333", borderRadius: 8,
      padding: 24, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" as const,
    },
    label: { display: "block", fontFamily: "'Oswald', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" as const, color: "#666", marginBottom: 4 },
  };

  return (
    <div style={s.container}>
      {/* Edit Modal */}
      {editing && (
        <div style={s.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div style={s.modal}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#f5f2eb" }}>
                Edit Listing
              </h2>
              <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: "#666", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            {([
              { label: "Business Name", field: "name", maxLen: 80 },
              { label: "Tagline", field: "tagline", maxLen: 100 },
              { label: "Phone", field: "phone", maxLen: 20 },
              { label: "Website", field: "website", maxLen: 200 },
              { label: "Address", field: "address", maxLen: 150 },
              { label: "Category", field: "category", maxLen: 50 },
            ] as { label: string; field: keyof Business; maxLen: number }[]).map(({ label, field, maxLen }) => (
              <div key={field}>
                <label style={s.label}>{label} <span style={{ color: "#444" }}>({String(editing[field] || "").length}/{maxLen})</span></label>
                <input
                  value={String(editing[field] || "")}
                  maxLength={maxLen}
                  onChange={e => setEditing({ ...editing, [field]: e.target.value })}
                  style={{ ...s.input }}
                />
              </div>
            ))}

            <label style={s.label}>Description <span style={{ color: "#444" }}>({(editing.description || "").length}/500)</span></label>
            <textarea
              value={editing.description || ""}
              maxLength={500}
              rows={4}
              onChange={e => setEditing({ ...editing, description: e.target.value })}
              style={{ ...s.input, resize: "vertical" }}
            />

            <label style={s.label}>Tier</label>
            <select value={editing.tier} onChange={e => setEditing({ ...editing, tier: e.target.value })} style={{ ...s.select, width: "100%", padding: "8px 12px", marginBottom: 16 }}>
              <option value="free">Free</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="featured">Featured</option>
            </select>

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888", cursor: "pointer" }}>
                <input type="checkbox" checked={editing.is_active} onChange={e => setEditing({ ...editing, is_active: e.target.checked })} />
                Active
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888", cursor: "pointer" }}>
                <input type="checkbox" checked={editing.is_new} onChange={e => setEditing({ ...editing, is_new: e.target.checked })} />
                Show NEW badge
              </label>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveEdit} disabled={saving} style={{ ...s.btn("#2d7a4f"), padding: "10px 20px", fontSize: 12, flex: 1, marginLeft: 0 }}>
                {saving ? "Saving..." : "✓ Save Changes"}
              </button>
              <button onClick={() => setEditing(null)} style={{ ...s.btn("#444"), padding: "10px 20px", fontSize: 12 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={s.header}>
        <span style={s.title}>BentonLA Admin</span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {pendingSubs.length > 0 && (
            <span style={{ background: "#cc0000", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>
              {pendingSubs.length} pending
            </span>
          )}
          <Link href="/" style={{ fontSize: 11, color: "#666", letterSpacing: 1 }}>← View Site</Link>
        </div>
      </div>

      <div style={s.main}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total Businesses", value: businesses.length },
            { label: "Active", value: businesses.filter(b => b.is_active).length },
            { label: "Featured/Premium", value: businesses.filter(b => b.tier === "featured" || b.tier === "premium").length },
            { label: "Pending Reviews", value: pendingSubs.length },
          ].map(stat => (
            <div key={stat.label} style={{ background: "#1a1a22", border: "1px solid #2a2a35", borderRadius: 6, padding: "14px 16px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, color: "#f5f2eb" }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: "#666", marginTop: 4 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 20 }}>
          <button style={s.tab(tab === "submissions")} onClick={() => setTab("submissions")}>
            Submissions {pendingSubs.length > 0 && `(${pendingSubs.length})`}
          </button>
          <button style={s.tab(tab === "businesses")} onClick={() => setTab("businesses")}>
            Businesses ({businesses.length})
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#666" }}>Loading...</p>
        ) : tab === "submissions" ? (
          <div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "#666", marginBottom: 14 }}>
              Pending Submissions
            </h2>
            {pendingSubs.length === 0 ? (
              <p style={{ color: "#555" }}>No pending submissions.</p>
            ) : pendingSubs.map(sub => (
              <div key={sub.id} style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, color: "#f5f2eb", marginBottom: 4 }}>{sub.name}</p>
                    <p style={{ color: "#888", fontSize: 12 }}>{sub.category} · {sub.phone} · {sub.email}</p>
                    {sub.address && <p style={{ color: "#666", fontSize: 11, marginTop: 2 }}>{sub.address}</p>}
                    {sub.website && <p style={{ color: "#4a9eff", fontSize: 11, marginTop: 2 }}>{sub.website}</p>}
                    {sub.description && <p style={{ color: "#777", fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>{sub.description}</p>}
                    <p style={{ color: "#444", fontSize: 10, marginTop: 6 }}>Submitted {new Date(sub.created_at).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={s.btn("#2d7a4f")} onClick={() => approveSubmission(sub)}>✓ Approve</button>
                    <button style={s.btn("#7a2d2d")} onClick={() => rejectSubmission(sub.id)}>✕ Reject</button>
                  </div>
                </div>
              </div>
            ))}

            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "#444", marginBottom: 14, marginTop: 28 }}>
              All Submissions
            </h2>
            {submissions.filter(s => s.status !== "pending").map(sub => (
              <div key={sub.id} style={{ ...s.card, opacity: 0.5 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ color: "#888" }}>{sub.name} · {sub.category}</p>
                  <span style={{ fontSize: 10, color: sub.status === "approved" ? "#3ecf8e" : "#cc0000", textTransform: "uppercase", letterSpacing: 1 }}>
                    {sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search businesses..."
              style={s.input}
            />
            {filteredBiz.map(biz => (
              <div key={biz.id} style={{ ...s.card, opacity: biz.is_active ? 1 : 0.45 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <span style={{ fontWeight: 700, color: "#f5f2eb", marginRight: 10 }}>{biz.name}</span>
                    <span style={{ fontSize: 11, color: "#666", marginRight: 10 }}>{biz.category}</span>
                    <span style={s.badge(biz.tier)}>{biz.tier}</span>
                    {!biz.is_active && (
                      <span style={{ fontSize: 10, color: "#666", marginLeft: 6, textTransform: "uppercase", letterSpacing: 1 }}>inactive</span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <select
                      value={biz.tier}
                      onChange={e => updateTier(biz.id, e.target.value)}
                      style={s.select}
                    >
                      <option value="free">Free</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="featured">Featured</option>
                    </select>
                    <button style={s.btn("#2255aa")} onClick={() => setEditing(biz)}>Edit</button>
                    <button style={s.btn(biz.is_active ? "#555" : "#2d7a4f")} onClick={() => toggleActive(biz)}>
                      {biz.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button style={s.btn("#7a2d2d")} onClick={() => deleteBusiness(biz.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type Business = {
  id: string;
  name: string;
  category: string;
  tier: string;
  is_active: boolean;
  phone: string;
  website: string;
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<"submissions" | "businesses">("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    const [{ data: subs }, { data: biz }] = await Promise.all([
      supabase.from("submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("businesses").select("*").order("category"),
    ]);
    setSubmissions((subs as Submission[]) || []);
    setBusinesses((biz as Business[]) || []);
    setLoading(false);
  }

  async function approveSubmission(sub: Submission) {
    const slug = sub.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { error } = await supabase.from("businesses").insert([{
      id: slug,
      slug,
      name: sub.name,
      category: sub.category.toLowerCase().replace(/\s+/g, "-"),
      tagline: sub.category + " · Benton, LA",
      description: sub.description || sub.name + " serves Benton and Bossier Parish.",
      phone: sub.phone,
      website: sub.website || null,
      address: sub.address,
      tier: "free",
      is_new: true,
      is_active: true,
    }]);
    if (!error) {
      await supabase.from("submissions").update({ status: "approved" }).eq("id", sub.id);
      fetchAll();
    } else {
      alert("Error: " + error.message);
    }
  }

  async function rejectSubmission(id: string) {
    await supabase.from("submissions").update({ status: "rejected" }).eq("id", id);
    fetchAll();
  }

  async function toggleActive(biz: Business) {
    await supabase.from("businesses").update({ is_active: !biz.is_active }).eq("id", biz.id);
    fetchAll();
  }

  async function updateTier(id: string, tier: string) {
    await supabase.from("businesses").update({ tier }).eq("id", id);
    fetchAll();
  }

  async function deleteBusiness(id: string) {
    if (!confirm("Delete this business? This cannot be undone.")) return;
    await supabase.from("businesses").delete().eq("id", id);
    fetchAll();
  }

  const pendingSubs = submissions.filter(s => s.status === "pending");
  const filteredBiz = businesses.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  const s = {
    container: { minHeight: "100vh", background: "#0f0f14", color: "#e8e8f0", fontFamily: "'Courier Prime', monospace", fontSize: 13 },
    header: { background: "#111", borderBottom: "1px solid #222", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    title: { fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" as const, color: "#f5f2eb" },
    main: { maxWidth: 1100, margin: "0 auto", padding: "24px 16px" },
    tab: (active: boolean) => ({
      fontFamily: "'Oswald', sans-serif",
      fontSize: 11,
      letterSpacing: 2,
      textTransform: "uppercase" as const,
      padding: "8px 18px",
      border: "1px solid #333",
      background: active ? "#f5f2eb" : "transparent",
      color: active ? "#111" : "#888",
      cursor: "pointer",
      marginRight: 8,
    }),
    card: { background: "#1a1a22", border: "1px solid #2a2a35", borderRadius: 6, padding: "14px 16px", marginBottom: 10 },
    badge: (tier: string) => ({
      display: "inline-block",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: "uppercase" as const,
      padding: "2px 8px",
      borderRadius: 3,
      background: tier === "featured" ? "#3ecf8e22" : tier === "premium" ? "#4a9eff22" : tier === "standard" ? "#ffffff11" : "#ffffff08",
      color: tier === "featured" ? "#3ecf8e" : tier === "premium" ? "#4a9eff" : "#aaa",
      border: `1px solid ${tier === "featured" ? "#3ecf8e44" : tier === "premium" ? "#4a9eff44" : "#333"}`,
    }),
    btn: (color: string) => ({
      fontFamily: "'Oswald', sans-serif",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: "uppercase" as const,
      padding: "4px 12px",
      border: "none",
      borderRadius: 3,
      background: color,
      color: "#fff",
      cursor: "pointer",
      marginLeft: 6,
    }),
    input: {
      background: "#1a1a22",
      border: "1px solid #333",
      color: "#e8e8f0",
      fontFamily: "'Courier Prime', monospace",
      fontSize: 13,
      padding: "7px 12px",
      width: "100%",
      marginBottom: 16,
      boxSizing: "border-box" as const,
    },
    select: {
      background: "#1a1a22",
      border: "1px solid #333",
      color: "#e8e8f0",
      fontFamily: "'Courier Prime', monospace",
      fontSize: 12,
      padding: "3px 8px",
      cursor: "pointer",
    },
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <span style={s.title}>BentonLA Admin</span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {pendingSubs.length > 0 && (
            <span style={{ background: "#cc0000", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>
              {pendingSubs.length} pending
            </span>
          )}
          <Link href="/" style={{ fontSize: 11, color: "#666", letterSpacing: 1 }}>← View Site</Link>
        </div>
      </div>

      <div style={s.main}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total Businesses", value: businesses.length },
            { label: "Active", value: businesses.filter(b => b.is_active).length },
            { label: "Featured", value: businesses.filter(b => b.tier === "featured").length },
            { label: "Pending Reviews", value: pendingSubs.length },
          ].map(stat => (
            <div key={stat.label} style={{ background: "#1a1a22", border: "1px solid #2a2a35", borderRadius: 6, padding: "14px 16px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, color: "#f5f2eb" }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: "#666", marginTop: 4 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 20 }}>
          <button style={s.tab(tab === "submissions")} onClick={() => setTab("submissions")}>
            Submissions {pendingSubs.length > 0 && `(${pendingSubs.length})`}
          </button>
          <button style={s.tab(tab === "businesses")} onClick={() => setTab("businesses")}>
            Businesses ({businesses.length})
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#666" }}>Loading...</p>
        ) : tab === "submissions" ? (
          <div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "#666", marginBottom: 14 }}>
              Pending Submissions
            </h2>
            {pendingSubs.length === 0 ? (
              <p style={{ color: "#555" }}>No pending submissions.</p>
            ) : pendingSubs.map(sub => (
              <div key={sub.id} style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, color: "#f5f2eb", marginBottom: 4 }}>{sub.name}</p>
                    <p style={{ color: "#888", fontSize: 12 }}>{sub.category} · {sub.phone} · {sub.email}</p>
                    {sub.address && <p style={{ color: "#666", fontSize: 11, marginTop: 2 }}>{sub.address}</p>}
                    {sub.website && <p style={{ color: "#4a9eff", fontSize: 11, marginTop: 2 }}>{sub.website}</p>}
                    {sub.description && <p style={{ color: "#777", fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>{sub.description}</p>}
                    <p style={{ color: "#444", fontSize: 10, marginTop: 6 }}>Submitted {new Date(sub.created_at).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={s.btn("#2d7a4f")} onClick={() => approveSubmission(sub)}>✓ Approve</button>
                    <button style={s.btn("#7a2d2d")} onClick={() => rejectSubmission(sub.id)}>✕ Reject</button>
                  </div>
                </div>
              </div>
            ))}

            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "#444", marginBottom: 14, marginTop: 28 }}>
              All Submissions
            </h2>
            {submissions.filter(s => s.status !== "pending").map(sub => (
              <div key={sub.id} style={{ ...s.card, opacity: 0.5 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ color: "#888" }}>{sub.name} · {sub.category}</p>
                  <span style={{ fontSize: 10, color: sub.status === "approved" ? "#3ecf8e" : "#cc0000", textTransform: "uppercase", letterSpacing: 1 }}>
                    {sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search businesses..."
              style={s.input}
            />
            {filteredBiz.map(biz => (
              <div key={biz.id} style={{ ...s.card, opacity: biz.is_active ? 1 : 0.45 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <span style={{ fontWeight: 700, color: "#f5f2eb", marginRight: 10 }}>{biz.name}</span>
                    <span style={{ fontSize: 11, color: "#666", marginRight: 10 }}>{biz.category}</span>
                    <span style={s.badge(biz.tier)}>{biz.tier}</span>
                    {!biz.is_active && <span style={{ ...s.badge("inactive"), marginLeft: 6 }}>inactive</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <select
                      value={biz.tier}
                      onChange={e => updateTier(biz.id, e.target.value)}
                      style={s.select}
                    >
                      <option value="free">Free</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="featured">Featured</option>
                    </select>
                    <button style={s.btn(biz.is_active ? "#555" : "#2d7a4f")} onClick={() => toggleActive(biz)}>
                      {biz.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button style={s.btn("#7a2d2d")} onClick={() => deleteBusiness(biz.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}