export function sortCards(cards, sortMode) {
  const sorted = [...cards];

  switch (sortMode) {
    case "id-desc":
      return sorted.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

    case "member":
      return sorted.sort((a, b) =>
        String(a.member ?? "").localeCompare(String(b.member ?? ""))
      );

    case "category":
      return sorted.sort((a, b) => {
        const aValue = `${a.top_level_category ?? ""} ${a.sub_category ?? ""}`;
        const bValue = `${b.top_level_category ?? ""} ${b.sub_category ?? ""}`;
        return aValue.localeCompare(bValue);
      });

    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
      );

    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.created_at ?? 0).getTime() -
          new Date(b.created_at ?? 0).getTime()
      );

    case "id-asc":
    default:
      return sorted.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  }
}