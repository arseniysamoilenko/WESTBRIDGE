const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return response(204, {});
  }

  if (event.httpMethod !== "POST") {
    return response(405, { error: "Method not allowed" });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (error) {
    return response(400, { error: "Invalid JSON" });
  }

  const application = normalize(payload);
  const error = validate(application);
  if (error) {
    return response(422, { error });
  }

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const result = await fetch(`${process.env.SUPABASE_URL}/rest/v1/olympiad_test_applications`, {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(application),
    });

    if (!result.ok) {
      console.error("Supabase insert failed", await result.text());
      return response(502, { error: "Application storage failed" });
    }

    return response(202, { ok: true, storage: "supabase" });
  }

  console.info("Preview application received", application);
  return response(202, { ok: true, storage: "function-log-preview" });
};

function normalize(payload) {
  return {
    parent_name: clean(payload.parent_name),
    email: clean(payload.email).toLowerCase(),
    phone: clean(payload.phone),
    student_name: clean(payload.student_name),
    grade: clean(payload.grade),
    subject: clean(payload.subject),
    message: clean(payload.message),
    test_fee_hkd: 300,
    source: "westbridge-olympiad-academy-hk",
    created_at: new Date().toISOString(),
  };
}

function validate(application) {
  if (!application.parent_name) return "Parent name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)) return "A valid email is required";
  if (!application.phone) return "Phone is required";
  if (!application.student_name) return "Student name is required";
  if (!application.grade) return "Grade is required";
  if (!application.subject) return "Subject is required";
  return "";
}

function clean(value) {
  return String(value || "").trim().slice(0, 2000);
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: statusCode === 204 ? "" : JSON.stringify(body),
  };
}
