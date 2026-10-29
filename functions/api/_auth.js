// Compares the request's Bearer password with the EDIT_PASSWORD secret.
export async function isEditor(request, env) {
  const given = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!env.EDIT_PASSWORD || !given) return false;
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([given, env.EDIT_PASSWORD].map(s => crypto.subtle.digest("SHA-256", enc.encode(s))));
  return crypto.subtle.timingSafeEqual(a, b);
}

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
