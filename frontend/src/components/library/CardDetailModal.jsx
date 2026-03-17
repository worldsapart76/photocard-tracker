import { useEffect } from "react";

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

export default function CardDetailModal({ card, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !card) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card-modal" onClick={(e) => e.stopPropagation()}>
        <div className="card-modal-header">
          <h2>Card #{card.id}</h2>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="card-modal-body">
          <div className="card-modal-images">
            {card.front_image_path ? (
              <img
                src={toImageUrl(card.front_image_path)}
                alt={`${card.member ?? "Card"} front`}
                className="card-modal-image"
              />
            ) : null}

            {card.back_image_path ? (
              <img
                src={toImageUrl(card.back_image_path)}
                alt={`${card.member ?? "Card"} back`}
                className="card-modal-image"
              />
            ) : null}
          </div>

          <div className="card-modal-meta">
            <div><strong>ID:</strong> {card.id ?? "—"}</div>
            <div><strong>Member:</strong> {card.member || "—"}</div>
            <div><strong>Group:</strong> {card.group_code || "—"}</div>
            <div><strong>Category:</strong> {card.top_level_category || "—"}</div>
            <div><strong>Subcategory:</strong> {card.sub_category || "—"}</div>
            <div><strong>Created:</strong> {card.created_at || "—"}</div>
            <div><strong>Notes:</strong> {card.notes || "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}