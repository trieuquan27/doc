import { isEditor, json } from "./_auth.js";

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare("SELECT title, url, updated, grp AS \"group\" FROM artifacts ORDER BY updated DESC, title").all();
  return json(results);
}

// Replaces the whole catalog with the list sent by the editor.
export async function onRequestPut({ request, env }) {
  if (!(await isEditor(request, env))) return json({ error: "Sai mật khẩu" }, 401);

  let list;
  try { list = await request.json(); } catch { return json({ error: "Dữ liệu không hợp lệ" }, 400); }
  if (!Array.isArray(list) || list.length > 2000) return json({ error: "Dữ liệu không hợp lệ" }, 400);

  const seen = new Set();
  for (const a of list) {
    const ok = a && typeof a.title === "string" && a.title.trim() && a.title.length <= 300
      && typeof a.url === "string" && /^https:\/\/\S+$/.test(a.url) && a.url.length <= 500
      && typeof a.group === "string" && a.group.trim() && a.group.length <= 100
      && typeof a.updated === "string" && /^\d{4}-\d{2}-\d{2}$/.test(a.updated);
    if (!ok) return json({ error: `Mục không hợp lệ: ${a && a.title || "(không tên)"}` }, 400);
    if (seen.has(a.url)) return json({ error: `Link bị trùng: ${a.url}` }, 400);
    seen.add(a.url);
  }

  const insert = env.DB.prepare("INSERT INTO artifacts (url, title, updated, grp) VALUES (?, ?, ?, ?)");
  await env.DB.batch([
    env.DB.prepare("DELETE FROM artifacts"),
    ...list.map(a => insert.bind(a.url, a.title.trim(), a.updated, a.group.trim()))
  ]);
  return json({ ok: true, count: list.length });
}
