"use server"

// CURSOR: API call to POST /api/v1/marketing/demo-requests
export async function submitDemoRequest(formData: FormData) {
  // In production, send the payload to the backend. For now, simulate latency.
  const payload = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    company: String(formData.get("company") || ""),
    intent: String(formData.get("intent") || ""),
  }
  await new Promise((r) => setTimeout(r, 600))
  console.log("Demo request submitted", payload)
  return { ok: true }
}
