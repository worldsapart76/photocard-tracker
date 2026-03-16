const API_BASE = "http://127.0.0.1:8000";

export async function fetchCards(limit = 200) {
  const r = await fetch(`${API_BASE}/cards?limit=${limit}`);
  if (!r.ok) throw new Error("Failed to fetch cards");
  return r.json();
}

export async function fetchCardImageUrls(id) {
  const r = await fetch(`${API_BASE}/cards/${id}/image_urls`);
  if (!r.ok) throw new Error("Failed to fetch image urls");
  return r.json();
}