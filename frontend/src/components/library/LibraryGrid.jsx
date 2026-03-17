import CardGridItem from "./CardGridItem";
import CardPairItem from "./CardPairItem";

export default function LibraryGrid({ items, sizeMode, captionsEnabled, onSelectItem }) {
  return (
    <div className={`library-grid size-${sizeMode.toLowerCase()}`}>
      {items.map((item) => {
        if (item.type === "pair") {
          return (
            <CardPairItem
              key={`pair-${item.card.id}`}
              card={item.card}
              frontImagePath={item.frontImagePath}
              backImagePath={item.backImagePath}
              captionsEnabled={captionsEnabled}
              onClick={() => onSelectItem(item)}
            />
          );
        }

        return (
          <CardGridItem
            key={`single-${item.card.id}`}
            card={item.card}
            imagePath={item.imagePath}
            captionsEnabled={captionsEnabled}
            showMissingBackBadge={Boolean(item.missingBack)}
            onClick={() => onSelectItem(item)}
          />
        );
      })}
    </div>
  );
}