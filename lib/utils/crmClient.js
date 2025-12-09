export async function fetchCRM(path, init = {}) {
  const appBase = process.env.APP_BASE_URL || "http://localhost:3000";
  const key = process.env.CRM_API_KEY;
  const res = await fetch(`${appBase}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      ...(init.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`CRM fetch failed: ${res.status}`);
  return res.json();
}

export async function postCRM(path, body) {
  return fetchCRM(path, { method: "POST", body: JSON.stringify(body) });
}


