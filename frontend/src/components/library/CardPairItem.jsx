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

export default function CardPairItem({
  card,
  frontImagePath,
  backImagePath,
  captionsEnabled,
  onClick,
  isSelectMode = false,
  isSelected = false,
}) {
  return (
    <button
      type="button"
      className={`card-pair-item${isSelected ? " selected" : ""}`}
      onClick={onClick}
      style={{
        position: "relative",
        width: "100%",
        background: "transparent",
        border: isSelected ? "3px solid #4a67ff" : "1px solid #ccc",
        borderRadius: 8,
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
        overflow: "hidden",
        display: "block",
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

      <div
        className="card-pair-images"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          width: "100%",
        }}
      >
        <div
          style={{
            aspectRatio: "2.5 / 3.5",
            overflow: "hidden",
            borderRight: "1px solid #ddd",
            background: "#fff",
          }}
        >
          <img
            src={toImageUrl(frontImagePath)}
            alt={`${card.member || "Card"} front`}
            className="card-grid-image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            aspectRatio: "2.5 / 3.5",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <img
            src={toImageUrl(backImagePath)}
            alt={`${card.member || "Card"} back`}
            className="card-grid-image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>

      {captionsEnabled ? <CardCaption card={card} /> : null}
    </button>
  );
}