import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { type, data } = await request.json();

  const subjects: Record<string, string> = {
    business: `🏢 New Business Submission: ${data.name}`,
    event: `📅 New Event Submission: ${data.title}`,
    job: `💼 New Job Submission: ${data.title}`,
    classified: `🏷 New Classified Submission: ${data.title}`,
  };

  const bodies: Record<string, string> = {
    business: `
      <h2>New Business Listing Submitted</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Business Name</td><td style="padding:8px;border:1px solid #eee">${data.name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Category</td><td style="padding:8px;border:1px solid #eee">${data.category}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #eee">${data.phone || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee">${data.email || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Website</td><td style="padding:8px;border:1px solid #eee">${data.website || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Address</td><td style="padding:8px;border:1px solid #eee">${data.address || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Description</td><td style="padding:8px;border:1px solid #eee">${data.description || "—"}</td></tr>
      </table>
      <p style="margin-top:20px"><a href="https://www.bentonla.com/admin" style="background:#111;color:#fff;padding:10px 20px;text-decoration:none;font-family:sans-serif;font-size:13px">Review in Admin →</a></p>
    `,
    event: `
      <h2>New Event Submitted</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Title</td><td style="padding:8px;border:1px solid #eee">${data.title}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Date</td><td style="padding:8px;border:1px solid #eee">${data.date}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Location</td><td style="padding:8px;border:1px solid #eee">${data.location}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Description</td><td style="padding:8px;border:1px solid #eee">${data.description || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Link</td><td style="padding:8px;border:1px solid #eee">${data.link || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee">${data.email || "—"}</td></tr>
      </table>
      <p style="margin-top:20px"><a href="https://www.bentonla.com/admin" style="background:#111;color:#fff;padding:10px 20px;text-decoration:none;font-family:sans-serif;font-size:13px">Review in Admin →</a></p>
    `,
    job: `
      <h2>New Job Posted</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Job Title</td><td style="padding:8px;border:1px solid #eee">${data.title}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Company</td><td style="padding:8px;border:1px solid #eee">${data.company}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Type</td><td style="padding:8px;border:1px solid #eee">${data.type}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Pay</td><td style="padding:8px;border:1px solid #eee">${data.pay || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Description</td><td style="padding:8px;border:1px solid #eee">${data.description || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee">${data.email || "—"}</td></tr>
      </table>
      <p style="margin-top:20px"><a href="https://www.bentonla.com/admin" style="background:#111;color:#fff;padding:10px 20px;text-decoration:none;font-family:sans-serif;font-size:13px">Review in Admin →</a></p>
    `,
    classified: `
      <h2>New Classified Listing</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Title</td><td style="padding:8px;border:1px solid #eee">${data.title}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Price</td><td style="padding:8px;border:1px solid #eee">${data.price}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Condition</td><td style="padding:8px;border:1px solid #eee">${data.condition || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Description</td><td style="padding:8px;border:1px solid #eee">${data.description || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Contact</td><td style="padding:8px;border:1px solid #eee">${data.contact || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee">${data.email || "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Images</td><td style="padding:8px;border:1px solid #eee">${data.imageCount || 0} photo(s)</td></tr>
      </table>
      <p style="margin-top:20px"><a href="https://www.bentonla.com/admin" style="background:#111;color:#fff;padding:10px 20px;text-decoration:none;font-family:sans-serif;font-size:13px">Review in Admin →</a></p>
    `,
  };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BentonLA.com <onboarding@resend.dev>",
        to: ["bentonlacom@gmail.com"],
        subject: subjects[type] || "New BentonLA Submission",
        html: bodies[type] || `<p>New ${type} submission received.</p>`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email send failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}