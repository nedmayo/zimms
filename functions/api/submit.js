/**
 * Cloudflare Pages Function: POST /api/submit
 * Receives the order/contact form and emails it via Resend.
 *
 * Env (Cloudflare Pages → Settings → Environment variables):
 *   TO_EMAIL   - where to receive submissions (e.g. zimmdrygoods@gmail.com)
 *   FROM_EMAIL - verified sender in Resend (e.g. onboarding@resend.dev for testing)
 */

const RESEND_API_KEY = "re_7C14Di79_H4eEQPdnNjzvatWBeYoAsdL9";

export async function onRequestPost({ request, env }) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  if (!RESEND_API_KEY || !env.TO_EMAIL || !env.FROM_EMAIL) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: "Server is missing email configuration.",
      }),
      { status: 500, headers: corsHeaders },
    );
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, message: "Invalid form data." }),
      { status: 400, headers: corsHeaders },
    );
  }

  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const phone = (formData.get("phone") || "").toString().trim();
  const message = (formData.get("message") || "").toString().trim();

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: "Name, email, and message are required.",
      }),
      { status: 400, headers: corsHeaders },
    );
  }

  const subject = `Order/Contact from ${name}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    "",
    "Message:",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: "nedjmayo@gmail.com",
      reply_to: email,
      subject,
      text: body,
    }),
  });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: corsHeaders,
  });
}
