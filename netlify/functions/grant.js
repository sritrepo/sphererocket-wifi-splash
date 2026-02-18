export default async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const { name, email, base_grant_url, user_continue_url } = await req.json();

    if (!email || !base_grant_url || !user_continue_url) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Attempt POST, fallback to GET
    let ok = false;

    try {
      const r1 = await fetch(base_grant_url, { method: "POST" });
      ok = r1.ok;
    } catch (_) {}

    if (!ok) {
      try {
        const r2 = await fetch(base_grant_url, { method: "GET" });
        ok = r2.ok;
      } catch (_) {}
    }

    if (!ok) {
      return new Response(JSON.stringify({ error: "Meraki grant request failed" }), { status: 502 });
    }

    // Basic logging (visible in Netlify function logs)
    console.log("WIFI_LEAD", { name, email, ts: new Date().toISOString() });

    return new Response(JSON.stringify({ redirect: user_continue_url }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
