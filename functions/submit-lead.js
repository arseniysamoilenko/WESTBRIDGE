const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  let payload;

  try {
    payload = JSON.parse(event.body || "{}");
  } catch (error) {
    return json(400, { error: "Invalid JSON body" });
  }

  const lead = normalizeLead(payload);
  const validationError = validateLead(lead);

  if (validationError) {
    return json(422, { error: validationError });
  }

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/olympiad_leads`, {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(lead),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Supabase lead insert failed", details);
      return json(502, { error: "Lead storage failed" });
    }

    return json(202, { ok: true, storage: "supabase" });
  }

  console.info("Preview lead received", lead);
  return json(202, { ok: true, storage: "function-log-preview" });
};

function normalizeLead(payload) {
  return {
    name: clean(payload.name),
    email: clean(payload.email).toLowerCase(),
    phone: clean(payload.phone),
    subject: clean(payload.subject),
    message: clean(payload.message),
    source: "westbridge-olympiads-website",
    created_at: new Date().toISOString(),
  };
}

function validateLead(lead) {
  if (!lead.name) return "Name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return "A valid email is required";
  if (!lead.subject) return "Subject is required";
  return "";
}

function clean(value) {
  return String(value || "").trim().slice(0, 2000);
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}
