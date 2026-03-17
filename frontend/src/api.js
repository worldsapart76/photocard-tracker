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

export async function fetchInbox() {
  const r = await fetch(`${API_BASE}/inbox`);
  if (!r.ok) throw new Error("Failed to fetch inbox");
  return r.json();
}

export async function fetchSubcategoryOptions(topLevelCategory) {
  const r = await fetch(
    `${API_BASE}/subcategory-options?top_level_category=${encodeURIComponent(topLevelCategory)}`
  );
  if (!r.ok) throw new Error("Failed to fetch subcategory options");
  return r.json();
}

export async function ingestFront({
  filename,
  member,
  topLevelCategory,
  subCategory,
}) {
  const params = new URLSearchParams({
    filename,
    group_code: "skz",
    member: member || "",
    top_level_category: topLevelCategory || "",
    sub_category: subCategory || "",
  });

  const r = await fetch(`${API_BASE}/ingest/front?${params.toString()}`, {
    method: "POST",
  });

  if (!r.ok) throw new Error("Failed to ingest front");
  return r.json();
}

export async function fetchCardCandidates({
  member,
  topLevelCategory,
  subCategory,
  includeCardsWithBack = false,
}) {
  const params = new URLSearchParams();

  if (member) params.set("member", member);
  if (topLevelCategory) params.set("top_level_category", topLevelCategory);
  if (subCategory) params.set("sub_category", subCategory);
  params.set("include_cards_with_back", includeCardsWithBack ? "true" : "false");

  const r = await fetch(`${API_BASE}/card-candidates?${params.toString()}`);
  if (!r.ok) throw new Error("Failed to fetch card candidates");
  return r.json();
}

export async function attachBack({
  cardId,
  filename,
  forceReplace = false,
}) {
  const params = new URLSearchParams({
    card_id: String(cardId),
    filename,
    force_replace: forceReplace ? "true" : "false",
  });

  const r = await fetch(`${API_BASE}/attach-back?${params.toString()}`, {
    method: "POST",
  });

  if (!r.ok) throw new Error("Failed to attach back");
  return r.json();
}