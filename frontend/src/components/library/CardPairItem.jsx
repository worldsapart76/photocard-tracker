import CardCaption from "./CardCaption";

export default function CardPairItem({
  card,
  frontImagePath,
  backImagePath,
  captionsEnabled,
  onClick,
}) {
  return (
    <button type="button" className="card-item pair-card-item" onClick={onClick}>
      <div className="card-pair-images">
        <div className="card-image-wrap">
          <img
            src={frontImagePath}
            alt={`${card.member ?? "Card"} front`}
            className="card-image"
          />
        </div>

        <div className="card-image-wrap">
          <img
            src={backImagePath}
            alt={`${card.member ?? "Card"} back`}
            className="card-image"
          />
        </div>
      </div>

      {captionsEnabled ? <CardCaption card={card} /> : null}
    </button>
  );
}