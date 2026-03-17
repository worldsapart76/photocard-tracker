export function buildCardCaption(card) {
  const parts = [
    card.member,
    card.sub_category,
    card.id ? `#${card.id}` : null,
  ].filter(Boolean);

  return parts.join(" • ");
}