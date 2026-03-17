import CardBadge from "./CardBadge";
import CardCaption from "./CardCaption";

export default function CardGridItem({
  card,
  imagePath,
  captionsEnabled,
  showMissingBackBadge,
  onClick,
}) {
  return (
    <button type="button" className="card-item single-card-item" onClick={onClick}>
      <div className="card-image-wrap">
        {showMissingBackBadge ? <CardBadge text="No Back" /> : null}
        <img
          src={imagePath}
          alt={`${card.member ?? "Card"} front`}
          className="card-image"
        />
      </div>

      {captionsEnabled ? <CardCaption card={card} /> : null}
    </button>
  );
}