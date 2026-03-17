const BACKEND_BASE_URL = "http://127.0.0.1:8000";

function toImageUrl(path) {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${BACKEND_BASE_URL}${path}`;
  }

  return `${BACKEND_BASE_URL}/${path}`;
}

export function buildDisplayItems(cards, viewMode) {
  if (viewMode === "fronts") {
    return cards
      .filter((card) => card.front_image_path)
      .map((card) => ({
        type: "single",
        card,
        imagePath: toImageUrl(card.front_image_path),
        missingBack: !card.back_image_path,
      }));
  }

  return cards
    .filter((card) => card.front_image_path)
    .map((card) => {
      if (card.back_image_path) {
        return {
          type: "pair",
          card,
          frontImagePath: toImageUrl(card.front_image_path),
          backImagePath: toImageUrl(card.back_image_path),
        };
      }

      return {
        type: "single",
        card,
        imagePath: toImageUrl(card.front_image_path),
        missingBack: true,
      };
    });
}