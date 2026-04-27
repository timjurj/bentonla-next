export async function notify(type: string, data: Record<string, string | number>) {
  try {
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data }),
    });
  } catch (err) {
    console.error("Notify failed:", err);
  }
}