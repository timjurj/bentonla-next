type NotifySubtype = "admin" | "confirmation" | "approval";

export async function notify(
  type: string,
  data: Record<string, string | number>,
  subtype: NotifySubtype = "admin"
) {
  try {
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, subtype, data }),
    });
  } catch (err) {
    console.error("Notify failed:", err);
  }
}

export async function notifyAll(
  type: string,
  data: Record<string, string | number>
) {
  // Send admin notification + confirmation to submitter simultaneously
  await Promise.all([
    notify(type, data, "admin"),
    data.email ? notify(type, data, "confirmation") : Promise.resolve(),
  ]);
}