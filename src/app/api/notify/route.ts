import { NextResponse } from "next/server";

type EmailData = Record<string, string | number>;

function adminTable(fields: [string, string][]) {
  return `<table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:13px">
    ${fields.map(([label, value]) => `
      <tr>
        <td style="padding:8px;border:1px solid #eee;font-weight:bold;width:140px">${label}</td>
        <td style="padding:8px;border:1px solid #eee">${value || "—"}</td>
      </tr>`).join("")}
  </table>`;
}

function adminButton() {
  return `<p style="margin-top:20px">
    <a href="https://www.bentonla.com/admin" style="background:#111;color:#fff;padding:10px 20px;text-decoration:none;font-family:sans-serif;font-size:13px;display:inline-block">
      Review in Admin →
    </a>
  </p>`;
}

function confirmationEmail(type: string, data: EmailData) {
  const typeLabels: Record<string, string> = {
    business: "business listing",
    event: "event",
    job: "job posting",
    classified: "classified listing",
  };
  const label = typeLabels[type] || "submission";
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#222">
      <div style="border-bottom:3px solid #111;padding-bottom:12px;margin-bottom:20px">
        <h1 style="font-size:22px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0">
          BentonLA.com
        </h1>
        <p style="color:#888;font-size:12px;margin:4px 0 0">Benton, Louisiana Local Directory</p>
      </div>
      <p style="font-size:15px;margin-bottom:12px">Thanks for submitting your ${label}!</p>
      <p style="font-size:13px;color:#555;line-height:1.7;margin-bottom:16px">
        We received your submission and will review it within 24 hours. 
        You'll get another email once it's live on BentonLA.com.
      </p>
      <div style="background:#f5f5f5;padding:14px 16px;border-left:3px solid #111;margin-bottom:20px;font-size:13px">
        <strong>${type === "business" ? data.name : data.title}</strong>
        ${type === "event" ? `<br><span style="color:#666">${data.date} · ${data.location}</span>` : ""}
        ${type === "job" ? `<br><span style="color:#666">${data.company} · ${data.type}</span>` : ""}
        ${type === "classified" ? `<br><span style="color:#666">${data.price}</span>` : ""}
      </div>
      <p style="font-size:12px;color:#888;">
        Questions? Email us at <a href="mailto:bentonlacom@gmail.com" style="color:#00008b">bentonlacom@gmail.com</a>
      </p>
      <div style="border-top:1px solid #eee;margin-top:24px;padding-top:12px;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:1px">
        BentonLA.com · Benton, Louisiana · Bossier Parish
      </div>
    </div>
  `;
}

function approvalEmail(type: string, data: EmailData) {
  const typeLabels: Record<string, string> = {
    business: "business listing",
    event: "event",
    job: "job posting",
    classified: "classified listing",
  };
  const label = typeLabels[type] || "submission";
  const urls: Record<string, string> = {
    business: `https://www.bentonla.com/business/${String(data.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    event: "https://www.bentonla.com/events",
    job: "https://www.bentonla.com/jobs",
    classified: "https://www.bentonla.com/classifieds",
  };
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#222">
      <div style="border-bottom:3px solid #111;padding-bottom:12px;margin-bottom:20px">
        <h1 style="font-size:22px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0">
          BentonLA.com
        </h1>
        <p style="color:#888;font-size:12px;margin:4px 0 0">Benton, Louisiana Local Directory</p>
      </div>
      <p style="font-size:15px;margin-bottom:12px">🎉 Your ${label} is now live!</p>
      <p style="font-size:13px;color:#555;line-height:1.7;margin-bottom:16px">
        <strong>${type === "business" ? data.name : data.title}</strong> has been approved and 
        is now listed on BentonLA.com.
      </p>
      <p style="margin-bottom:20px">
        <a href="${urls[type]}" style="background:#111;color:#fff;padding:10px 20px;text-decoration:none;font-family:sans-serif;font-size:13px;display:inline-block">
          View Your Listing →
        </a>
      </p>
      ${type === "business" ? `
        <div style="background:#fffef8;border:1px solid #ddd;padding:14px 16px;font-size:13px;margin-bottom:20px">
          <p style="margin:0 0 8px;font-weight:bold">Want more visibility?</p>
          <p style="margin:0 0 10px;color:#555">Upgrade to a featured listing to appear on the BentonLA.com homepage.</p>
          <a href="https://buy.stripe.com/6oU14o4Q85X4gO2fjx9fW00" style="background:#111;color:#fff;padding:8px 16px;text-decoration:none;font-size:12px;display:inline-block;margin-right:8px">Featured — $49/mo</a>
          <a href="https://buy.stripe.com/9B69AUeqIbho8hwfjx9fW01" style="border:1px solid #111;color:#111;padding:8px 16px;text-decoration:none;font-size:12px;display:inline-block">Standard — $19/mo</a>
        </div>
      ` : ""}
      <p style="font-size:12px;color:#888;">
        Questions? Email us at <a href="mailto:bentonlacom@gmail.com" style="color:#00008b">bentonlacom@gmail.com</a>
      </p>
      <div style="border-top:1px solid #eee;margin-top:24px;padding-top:12px;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:1px">
        BentonLA.com · Benton, Louisiana · Bossier Parish
      </div>
    </div>
  `;
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "BentonLA.com <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) console.error("Resend error:", await res.text());
  return res.ok;
}

export async function POST(request: Request) {
  const { type, subtype, data } = await request.json();
  // subtype: "admin" | "confirmation" | "approval"

  try {
    if (subtype === "confirmation" && data.email) {
      // Send confirmation to submitter
      const subjects: Record<string, string> = {
        business: `Your listing "${data.name}" has been submitted`,
        event: `Your event "${data.title}" has been submitted`,
        job: `Your job posting "${data.title}" has been submitted`,
        classified: `Your listing "${data.title}" has been submitted`,
      };
      await sendEmail(data.email as string, subjects[type] || "Submission received", confirmationEmail(type, data));
    }

    if (subtype === "approval" && data.email) {
      // Send approval to submitter
      const subjects: Record<string, string> = {
        business: `✓ Your listing "${data.name}" is now live on BentonLA.com`,
        event: `✓ Your event "${data.title}" is now live on BentonLA.com`,
        job: `✓ Your job posting "${data.title}" is now live on BentonLA.com`,
        classified: `✓ Your listing "${data.title}" is now live on BentonLA.com`,
      };
      await sendEmail(data.email as string, subjects[type] || "Your submission is live", approvalEmail(type, data));
    }

    if (subtype === "admin") {
      // Notify admin
      const adminSubjects: Record<string, string> = {
        business: `🏢 New Business Submission: ${data.name}`,
        event: `📅 New Event Submission: ${data.title}`,
        job: `💼 New Job Submission: ${data.title}`,
        classified: `🏷 New Classified Submission: ${data.title}`,
      };

      const adminBodies: Record<string, string> = {
        business: `<h2>New Business Listing</h2>${adminTable([
          ["Name", String(data.name)], ["Category", String(data.category)],
          ["Phone", String(data.phone)], ["Email", String(data.email)],
          ["Website", String(data.website)], ["Address", String(data.address)],
          ["Description", String(data.description)],
        ])}${adminButton()}`,
        event: `<h2>New Event</h2>${adminTable([
          ["Title", String(data.title)], ["Date", String(data.date)],
          ["Location", String(data.location)], ["Description", String(data.description)],
          ["Email", String(data.email)],
        ])}${adminButton()}`,
        job: `<h2>New Job Posted</h2>${adminTable([
          ["Title", String(data.title)], ["Company", String(data.company)],
          ["Type", String(data.type)], ["Pay", String(data.pay)],
          ["Description", String(data.description)], ["Email", String(data.email)],
        ])}${adminButton()}`,
        classified: `<h2>New Classified</h2>${adminTable([
          ["Title", String(data.title)], ["Price", String(data.price)],
          ["Condition", String(data.condition)], ["Description", String(data.description)],
          ["Contact", String(data.contact)], ["Email", String(data.email)],
          ["Images", `${data.imageCount || 0} photo(s)`],
        ])}${adminButton()}`,
      };

      await sendEmail(
        "bentonlacom@gmail.com",
        adminSubjects[type] || "New BentonLA Submission",
        adminBodies[type] || `<p>New ${type} submission.</p>`
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Notify error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}