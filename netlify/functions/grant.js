export default async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const { name, email, base_grant_url, user_continue_url } = await req.json();

    if (!email || !base_grant_url) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    console.log("WIFI_LEAD", {
      name,
      email,
      user_continue_url,
      base_grant_url,
      ts: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        redirect: base_grant_url
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};