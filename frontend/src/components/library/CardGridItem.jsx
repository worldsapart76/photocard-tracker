import CardCaption from "./CardCaption";

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

export default function CardGridItem({
  card,
  imagePath,
  captionsEnabled,
  showMissingBackBadge,
  onClick,
  isSelectMode = false,
  isSelected = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "relative",
        width: "100%",
        display: "block",
        background: "#fff",
        border: isSelected ? "3px solid #4a67ff" : "1px solid #ccc",
        borderRadius: 8,
        padding: 4,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      {isSelectMode ? (
        <div
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            width: 16,
            height: 16,
            borderRadius: 3,
            border: "1px solid #666",
            background: isSelected ? "#4a67ff" : "#fff",
            zIndex: 2,
          }}
        />
      ) : null}

      <img
        src={toImageUrl(imagePath)}
        alt={`${card.member || "Card"} front`}
        style={{
          width: "100%",
          aspectRatio: "55 / 85",
          objectFit: "cover",
          display: "block",
          borderRadius: 4,
        }}
      />

      {showMissingBackBadge ? (
        <div style={{ fontSize: 11, marginTop: 4 }}>Missing back</div>
      ) : null}

      {captionsEnabled ? <CardCaption card={card} /> : null}
    </button>
  );
}