"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Submission = { id: string; name: string; email: string; phone: string; website: string; address: string; category: string; description: string; status: string; created_at: string; };
type Business = { id: string; slug: string; name: string; category: string; tagline: string; description: string; phone: string; website: string; address: string; tier: string; is_active: boolean; is_new: boolean; };
type Event = { id: string; title: string; date: string; location: string; description: string; link: string; is_active: boolean; created_at: string; };
type Job = { id: string; title: string; company: string; type: string; pay: string; description: string; link: string; is_active: boolean; created_at: string; };
type Classified = { id: string; title: string; price: string; condition: string; description: string; link: string; is_active: boolean; created_at: string; };
type Tab = "submissions" | "businesses" | "events" | "jobs" | "classifieds";
type EditTarget = { table: string; data: Record<string, string | boolean> } | null;

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [classifieds, setClassifieds] = useState<Classified[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editBiz, setEditBiz] = useState<Business | null>(null);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    const [{ data: subs }, { data: biz }, { data: evts }, { data: jbs }, { data: cls }] = await Promise.all([
      supabase.from("submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("businesses").select("*").order("category"),
      supabase.from("events").select("*").order("created_at", { ascending: false }),
      supabase.from("jobs").select("*").order("created_at", { ascending: false }),
      supabase.from("classifieds").select("*").order("created_at", { ascending: false }),
    ]);
    setSubmissions((subs as Submission[]) || []);
    setBusinesses((biz as Business[]) || []);
    setEvents((evts as Event[]) || []);
    setJobs((jbs as Job[]) || []);
    setClassifieds((cls as Classified[]) || []);
    setLoading(false);
  }

  async function approveSubmission(sub: Submission) {
    const slug = sub.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { error } = await supabase.from("businesses").insert([{
      id: slug, slug, name: sub.name,
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

  async function toggleActive(table: string, id: string, current: boolean) {
    await supabase.from(table).update({ is_active: !current }).eq("id", id);
    fetchAll();
  }

  async function deleteRow(table: string, id: string) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    await supabase.from(table).delete().eq("id", id);
    fetchAll();
  }

  async function updateTier(id: string, tier: string) {
    await supabase.from("businesses").update({ tier }).eq("id", id);
    fetchAll();
  }

  async function saveBizEdit() {
    if (!editBiz) return;
    setSaving(true);
    const { error } = await supabase.from("businesses").update({
      name: editBiz.name, tagline: editBiz.tagline, description: editBiz.description,
      phone: editBiz.phone, website: editBiz.website, address: editBiz.address,
      category: editBiz.category, tier: editBiz.tier, is_active: editBiz.is_active, is_new: editBiz.is_new,
    }).eq("id", editBiz.id);
    setSaving(false);
    if (error) alert("Save failed: " + error.message);
    else { setEditBiz(null); fetchAll(); }
  }

  async function saveGenericEdit() {
    if (!editTarget) return;
    setSaving(true);
    const { id, ...fields } = editTarget.data;
    const { error } = await supabase.from(editTarget.table).update(fields).eq("id", id);
    setSaving(false);
    if (error) alert("Save failed: " + error.message);
    else { setEditTarget(null); fetchAll(); }
  }

  const pendingSubs = submissions.filter(s => s.status === "pending");
  const pendingEvents = events.filter(e => !e.is_active);
  const pendingJobs = jobs.filter(j => !j.is_active);
  const pendingClassifieds = classifieds.filter(c => !c.is_active);
  const totalPending = pendingSubs.length + pendingEvents.length + pendingJobs.length + pendingClassifieds.length;
  const filteredBiz = businesses.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  const s = {
    container: { minHeight: "100vh", background: "#0f0f14", color: "#e8e8f0", fontFamily: "'Courier Prime', monospace", fontSize: 13 },
    header: { background: "#111", borderBottom: "1px solid #222", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    title: { fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" as const, color: "#f5f2eb" },
    main: { maxWidth: 1100, margin: "0 auto", padding: "24px 16px" },
    tab: (active: boolean) => ({ fontFamily: "'Oswald', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" as const, padding: "8px 14px", border: "1px solid #333", background: active ? "#f5f2eb" : "transparent", color: active ? "#111" : "#888", cursor: "pointer", marginRight: 6, marginBottom: 6 }),
    card: { background: "#1a1a22", border: "1px solid #2a2a35", borderRadius: 6, padding: "14px 16px", marginBottom: 10 },
    pendingCard: { background: "#1a2a1a", border: "1px solid #2a4a2a", borderRadius: 6, padding: "14px 16px", marginBottom: 10 },
    badge: (tier: string) => ({ display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" as const, padding: "2px 8px", borderRadius: 3, background: tier === "featured" ? "#3ecf8e22" : tier === "premium" ? "#4a9eff22" : "#ffffff08", color: tier === "featured" ? "#3ecf8e" : tier === "premium" ? "#4a9eff" : "#aaa", border: `1px solid ${tier === "featured" ? "#3ecf8e44" : tier === "premium" ? "#4a9eff44" : "#333"}` }),
    btn: (color: string) => ({ fontFamily: "'Oswald', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" as const, padding: "4px 12px", border: "none", borderRadius: 3, background: color, color: "#fff", cursor: "pointer", marginLeft: 6 }),
    input: { background: "#1a1a22", border: "1px solid #333", color: "#e8e8f0", fontFamily: "'Courier Prime', monospace", fontSize: 13, padding: "7px 12px", width: "100%", marginBottom: 14, boxSizing: "border-box" as const },
    select: { background: "#1a1a22", border: "1px solid #333", color: "#e8e8f0", fontFamily: "'Courier Prime', monospace", fontSize: 12, padding: "3px 8px", cursor: "pointer" },
    overlay: { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 },
    modal: { background: "#1a1a22", border: "1px solid #333", borderRadius: 8, padding: 24, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" as const },
    label: { display: "block", fontFamily: "'Oswald', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" as const, color: "#666", marginBottom: 4 },
    sh: { fontFamily: "'Oswald', sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" as const, color: "#666", marginBottom: 12, marginTop: 20 },
  };

  function PendingBadge({ count }: { count: number }) {
    if (!count) return null;
    return <span style={{ background: "#cc0000", color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 8, marginLeft: 4 }}>{count}</span>;
  }

  function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#f5f2eb" }}>{title}</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", fontSize: 18, cursor: "pointer" }}>✕</button>
      </div>
    );
  }

  function Field({ label, value, onChange, maxLen, multiline }: { label: string; value: string; onChange: (v: string) => void; maxLen?: number; multiline?: boolean }) {
    return (
      <div>
        <label style={s.label}>{label}{maxLen && <span style={{ color: "#444" }}> ({value.length}/{maxLen})</span>}</label>
        {multiline
          ? <textarea value={value} maxLength={maxLen} rows={3} onChange={e => onChange(e.target.value)} style={{ ...s.input, resize: "vertical" }} />
          : <input value={value} maxLength={maxLen} onChange={e => onChange(e.target.value)} style={s.input} />
        }
      </div>
    );
  }

  return (
    <div style={s.container}>

      {/* Business Edit Modal */}
      {editBiz && (
        <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) setEditBiz(null); }}>
          <div style={s.modal}>
            <ModalHeader title="Edit Business" onClose={() => setEditBiz(null)} />
            {([
              { label: "Name", field: "name", maxLen: 80 },
              { label: "Tagline", field: "tagline", maxLen: 100 },
              { label: "Phone", field: "phone", maxLen: 20 },
              { label: "Website", field: "website", maxLen: 200 },
              { label: "Address", field: "address", maxLen: 150 },
              { label: "Category", field: "category", maxLen: 50 },
            ] as { label: string; field: keyof Business; maxLen: number }[]).map(({ label, field, maxLen }) => (
              <Field key={field} label={label} value={String(editBiz[field] || "")} maxLen={maxLen} onChange={v => setEditBiz({ ...editBiz, [field]: v })} />
            ))}
            <Field label="Description" value={editBiz.description || ""} maxLen={500} multiline onChange={v => setEditBiz({ ...editBiz, description: v })} />
            <label style={s.label}>Tier</label>
            <select value={editBiz.tier} onChange={e => setEditBiz({ ...editBiz, tier: e.target.value })} style={{ ...s.select, width: "100%", padding: "8px 12px", marginBottom: 14 }}>
              <option value="free">Free</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="featured">Featured</option>
            </select>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888", cursor: "pointer" }}>
                <input type="checkbox" checked={editBiz.is_active} onChange={e => setEditBiz({ ...editBiz, is_active: e.target.checked })} /> Active
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888", cursor: "pointer" }}>
                <input type="checkbox" checked={editBiz.is_new} onChange={e => setEditBiz({ ...editBiz, is_new: e.target.checked })} /> NEW badge
              </label>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveBizEdit} disabled={saving} style={{ ...s.btn("#2d7a4f"), padding: "10px 20px", fontSize: 12, flex: 1, marginLeft: 0 }}>
                {saving ? "Saving..." : "✓ Save"}
              </button>
              <button onClick={() => setEditBiz(null)} style={{ ...s.btn("#444"), padding: "10px 20px", fontSize: 12 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Generic Edit Modal (events/jobs/classifieds) */}
      {editTarget && (
        <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) setEditTarget(null); }}>
          <div style={s.modal}>
            <ModalHeader title={`Edit ${editTarget.table.slice(0, -1)}`} onClose={() => setEditTarget(null)} />
            {editTarget.table === "events" && <>
              <Field label="Title" value={String(editTarget.data.title || "")} maxLen={100} onChange={v => setEditTarget({ ...editTarget, data: { ...editTarget.data, title: v } })} />
              <Field label="Date & Time" value={String(editTarget.data.date || "")} maxLen={80} onChange={v => setEditTarget({ ...editTarget, data: { ...editTarget.data, date: v } })} />
              <Field label="Location" value={String(editTarget.data.location || "")} maxLen={150} onChange={v => setEditTarget({ ...editTarget, data: { ...editTarget.data, location: v } })} />
              <Field label="Description" value={String(editTarget.data.description || "")} maxLen={300} multiline onChange={v => setEditTarget({ ...editTarget, data: { ...editTarget.data, description: v } })} />
              <Field label="Link (optional)" value={String(editTarget.data.link || "")} maxLen={200} onChange={v => setEditTarget({ ...editTarget, data: { ...editTarget.data, link: v } })} />
            </>}
            {editTarget.table === "jobs" && <>
              <Field label="Job Title" value={String(editTarget.data.title || "")} maxLen={100} onChange={v => setEditTarget({ ...editTarget, data: { ...editTarget.data, title: v } })} />
              <Field label="Company" value={String(editTarget.data.company || "")} maxLen={100} onChange={v => setEditTarget({ ...editTarget, data: { ...editTarget.data, company: v } })} />
              <Field label="Pay" value={String(editTarget.data.pay || "")} maxLen={80} onChange={v => setEditTarget({ ...editTarget, data: { ...editTarget.data, pay: v } })} />
              <label style={s.label}>Job Type</label>
              <select value={String(editTarget.data.type || "Full-Time")} onChange={e => setEditTarget({ ...editTarget, data: { ...editTarget.data, type: e.target.value } })} style={{ ...s.select, width: "100%", padding: "8px 12px", marginBottom: 14 }}>
                <option>Full-Time</option><option>Part-Time</option><option>Contract</option><option>Commission</option><option>Temporary</option>
              </select>
              <Field label="Description" value={String(editTarget.data.description || "")} maxLen={500} multiline onChange={v => setEditTarget({ ...editTarget, data: { ...editTarget.data, description: v } })} />
              <Field label="Apply Link" value={String(editTarget.data.link || "")} maxLen={200} onChange={v => setEditTarget({ ...editTarget, data: { ...editTarget.data, link: v } })} />
            </>}
            {editTarget.table === "classifieds" && <>
              <Field label="Title" value={String(editTarget.data.title || "")} maxLen={100} onChange={v => setEditTarget({ ...editTarget, data: { ...editTarget.data, title: v } })} />
              <Field label="Price" value={String(editTarget.data.price || "")} maxLen={40} onChange={v => setEditTarget({ ...editTarget, data: { ...editTarget.data, price: v } })} />
              <Field label="Condition" value={String(editTarget.data.condition || "")} maxLen={50} onChange={v => setEditTarget({ ...editTarget, data: { ...editTarget.data, condition: v } })} />
              <Field label="Description" value={String(editTarget.data.description || "")} maxLen={400} multiline onChange={v => setEditTarget({ ...editTarget, data: { ...editTarget.data, description: v } })} />
              <Field label="Contact / Link" value={String(editTarget.data.link || "")} maxLen={200} onChange={v => setEditTarget({ ...editTarget, data: { ...editTarget.data, link: v } })} />
            </>}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={saveGenericEdit} disabled={saving} style={{ ...s.btn("#2d7a4f"), padding: "10px 20px", fontSize: 12, flex: 1, marginLeft: 0 }}>
                {saving ? "Saving..." : "✓ Save"}
              </button>
              <button onClick={() => setEditTarget(null)} style={{ ...s.btn("#444"), padding: "10px 20px", fontSize: 12 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={s.header}>
        <span style={s.title}>BentonLA Admin</span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {totalPending > 0 && <span style={{ background: "#cc0000", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>{totalPending} pending</span>}
          <Link href="/" style={{ fontSize: 11, color: "#666", letterSpacing: 1 }}>← View Site</Link>
        </div>
      </div>

      <div style={s.main}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Businesses", value: businesses.length },
            { label: "Active", value: businesses.filter(b => b.is_active).length },
            { label: "Featured/Premium", value: businesses.filter(b => b.tier === "featured" || b.tier === "premium").length },
            { label: "Events", value: events.filter(e => e.is_active).length },
            { label: "Jobs", value: jobs.filter(j => j.is_active).length },
            { label: "Classifieds", value: classifieds.filter(c => c.is_active).length },
          ].map(stat => (
            <div key={stat.label} style={{ background: "#1a1a22", border: "1px solid #2a2a35", borderRadius: 6, padding: "12px 14px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, fontWeight: 700, color: "#f5f2eb" }}>{stat.value}</p>
              <p style={{ fontSize: 10, color: "#666", marginTop: 3 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap" }}>
          {([
            { key: "submissions", label: "Submissions", pending: pendingSubs.length },
            { key: "businesses", label: "Businesses", pending: 0 },
            { key: "events", label: "Events", pending: pendingEvents.length },
            { key: "jobs", label: "Jobs", pending: pendingJobs.length },
            { key: "classifieds", label: "Buy/Sell", pending: pendingClassifieds.length },
          ] as { key: Tab; label: string; pending: number }[]).map(t => (
            <button key={t.key} style={s.tab(tab === t.key)} onClick={() => setTab(t.key)}>
              {t.label}<PendingBadge count={t.pending} />
            </button>
          ))}
        </div>

        {loading ? <p style={{ color: "#666" }}>Loading...</p> : <>

          {/* SUBMISSIONS */}
          {tab === "submissions" && <div>
            <p style={s.sh}>Pending</p>
            {pendingSubs.length === 0 ? <p style={{ color: "#555" }}>No pending submissions.</p> : pendingSubs.map(sub => (
              <div key={sub.id} style={s.pendingCard}>
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
            <p style={{ ...s.sh, marginTop: 28 }}>All Submissions</p>
            {submissions.filter(s => s.status !== "pending").map(sub => (
              <div key={sub.id} style={{ ...s.card, opacity: 0.5 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ color: "#888" }}>{sub.name} · {sub.category}</p>
                  <span style={{ fontSize: 10, color: sub.status === "approved" ? "#3ecf8e" : "#cc0000", textTransform: "uppercase", letterSpacing: 1 }}>{sub.status}</span>
                </div>
              </div>
            ))}
          </div>}

          {/* BUSINESSES */}
          {tab === "businesses" && <div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search businesses..." style={s.input} />
            {filteredBiz.map(biz => (
              <div key={biz.id} style={{ ...s.card, opacity: biz.is_active ? 1 : 0.45 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <span style={{ fontWeight: 700, color: "#f5f2eb", marginRight: 10 }}>{biz.name}</span>
                    <span style={{ fontSize: 11, color: "#666", marginRight: 10 }}>{biz.category}</span>
                    <span style={s.badge(biz.tier)}>{biz.tier}</span>
                    {!biz.is_active && <span style={{ fontSize: 10, color: "#666", marginLeft: 6, textTransform: "uppercase", letterSpacing: 1 }}>inactive</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <select value={biz.tier} onChange={e => updateTier(biz.id, e.target.value)} style={s.select}>
                      <option value="free">Free</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="featured">Featured</option>
                    </select>
                    <button style={s.btn("#2255aa")} onClick={() => setEditBiz(biz)}>Edit</button>
                    <button style={s.btn(biz.is_active ? "#555" : "#2d7a4f")} onClick={() => toggleActive("businesses", biz.id, biz.is_active)}>
                      {biz.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button style={s.btn("#7a2d2d")} onClick={() => deleteRow("businesses", biz.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>}

          {/* EVENTS */}
          {tab === "events" && <div>
            {pendingEvents.length > 0 && <><p style={s.sh}>Pending Approval</p>
              {pendingEvents.map(evt => (
                <div key={evt.id} style={s.pendingCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "#f5f2eb", marginBottom: 3 }}>{evt.title}</p>
                      <p style={{ color: "#888", fontSize: 12 }}>{evt.date} · {evt.location}</p>
                      {evt.description && <p style={{ color: "#777", fontSize: 12, marginTop: 4 }}>{evt.description}</p>}
                      <p style={{ color: "#444", fontSize: 10, marginTop: 4 }}>Submitted {new Date(evt.created_at).toLocaleDateString()}</p>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={s.btn("#2255aa")} onClick={() => setEditTarget({ table: "events", data: { id: evt.id, title: evt.title, date: evt.date, location: evt.location, description: evt.description || "", link: evt.link || "" } })}>Edit</button>
                      <button style={s.btn("#2d7a4f")} onClick={() => toggleActive("events", evt.id, false)}>✓ Approve</button>
                      <button style={s.btn("#7a2d2d")} onClick={() => deleteRow("events", evt.id)}>✕ Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </>}
            <p style={s.sh}>Active Events</p>
            {events.filter(e => e.is_active).length === 0 ? <p style={{ color: "#555" }}>No active events.</p> : events.filter(e => e.is_active).map(evt => (
              <div key={evt.id} style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div><span style={{ fontWeight: 700, color: "#f5f2eb", marginRight: 10 }}>{evt.title}</span><span style={{ fontSize: 11, color: "#666" }}>{evt.date} · {evt.location}</span></div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={s.btn("#2255aa")} onClick={() => setEditTarget({ table: "events", data: { id: evt.id, title: evt.title, date: evt.date, location: evt.location, description: evt.description || "", link: evt.link || "" } })}>Edit</button>
                    <button style={s.btn("#555")} onClick={() => toggleActive("events", evt.id, true)}>Deactivate</button>
                    <button style={s.btn("#7a2d2d")} onClick={() => deleteRow("events", evt.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>}

          {/* JOBS */}
          {tab === "jobs" && <div>
            {pendingJobs.length > 0 && <><p style={s.sh}>Pending Approval</p>
              {pendingJobs.map(job => (
                <div key={job.id} style={s.pendingCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "#f5f2eb", marginBottom: 3 }}>{job.title}</p>
                      <p style={{ color: "#888", fontSize: 12 }}>{job.company} · {job.type}</p>
                      {job.pay && <p style={{ color: "#3ecf8e", fontSize: 12, marginTop: 2 }}>{job.pay}</p>}
                      {job.description && <p style={{ color: "#777", fontSize: 12, marginTop: 4 }}>{job.description}</p>}
                      <p style={{ color: "#444", fontSize: 10, marginTop: 4 }}>Submitted {new Date(job.created_at).toLocaleDateString()}</p>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={s.btn("#2255aa")} onClick={() => setEditTarget({ table: "jobs", data: { id: job.id, title: job.title, company: job.company, type: job.type, pay: job.pay || "", description: job.description || "", link: job.link || "" } })}>Edit</button>
                      <button style={s.btn("#2d7a4f")} onClick={() => toggleActive("jobs", job.id, false)}>✓ Approve</button>
                      <button style={s.btn("#7a2d2d")} onClick={() => deleteRow("jobs", job.id)}>✕ Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </>}
            <p style={s.sh}>Active Jobs</p>
            {jobs.filter(j => j.is_active).length === 0 ? <p style={{ color: "#555" }}>No active jobs.</p> : jobs.filter(j => j.is_active).map(job => (
              <div key={job.id} style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div><span style={{ fontWeight: 700, color: "#f5f2eb", marginRight: 10 }}>{job.title}</span><span style={{ fontSize: 11, color: "#666" }}>{job.company} · {job.type}</span>{job.pay && <span style={{ fontSize: 11, color: "#3ecf8e", marginLeft: 8 }}>{job.pay}</span>}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={s.btn("#2255aa")} onClick={() => setEditTarget({ table: "jobs", data: { id: job.id, title: job.title, company: job.company, type: job.type, pay: job.pay || "", description: job.description || "", link: job.link || "" } })}>Edit</button>
                    <button style={s.btn("#555")} onClick={() => toggleActive("jobs", job.id, true)}>Deactivate</button>
                    <button style={s.btn("#7a2d2d")} onClick={() => deleteRow("jobs", job.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>}

          {/* CLASSIFIEDS */}
          {tab === "classifieds" && <div>
            {pendingClassifieds.length > 0 && <><p style={s.sh}>Pending Approval</p>
              {pendingClassifieds.map(item => (
                <div key={item.id} style={s.pendingCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "#f5f2eb", marginBottom: 3 }}>{item.title}</p>
                      <p style={{ color: "#3ecf8e", fontSize: 13, fontWeight: 700 }}>{item.price}</p>
                      <p style={{ color: "#888", fontSize: 12 }}>{item.condition}</p>
                      {item.description && <p style={{ color: "#777", fontSize: 12, marginTop: 4 }}>{item.description}</p>}
                      <p style={{ color: "#444", fontSize: 10, marginTop: 4 }}>Submitted {new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={s.btn("#2255aa")} onClick={() => setEditTarget({ table: "classifieds", data: { id: item.id, title: item.title, price: item.price, condition: item.condition || "", description: item.description || "", link: item.link || "" } })}>Edit</button>
                      <button style={s.btn("#2d7a4f")} onClick={() => toggleActive("classifieds", item.id, false)}>✓ Approve</button>
                      <button style={s.btn("#7a2d2d")} onClick={() => deleteRow("classifieds", item.id)}>✕ Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </>}
            <p style={s.sh}>Active Listings</p>
            {classifieds.filter(c => c.is_active).length === 0 ? <p style={{ color: "#555" }}>No active listings.</p> : classifieds.filter(c => c.is_active).map(item => (
              <div key={item.id} style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div><span style={{ fontWeight: 700, color: "#f5f2eb", marginRight: 10 }}>{item.title}</span><span style={{ fontSize: 12, color: "#3ecf8e", fontWeight: 700, marginRight: 8 }}>{item.price}</span><span style={{ fontSize: 11, color: "#666" }}>{item.condition}</span></div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={s.btn("#2255aa")} onClick={() => setEditTarget({ table: "classifieds", data: { id: item.id, title: item.title, price: item.price, condition: item.condition || "", description: item.description || "", link: item.link || "" } })}>Edit</button>
                    <button style={s.btn("#555")} onClick={() => toggleActive("classifieds", item.id, true)}>Deactivate</button>
                    <button style={s.btn("#7a2d2d")} onClick={() => deleteRow("classifieds", item.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>}

        </>}
      </div>
    </div>
  );
}