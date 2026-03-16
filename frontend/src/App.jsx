import { useEffect, useState } from "react";
import { fetchCards, fetchCardImageUrls } from "./api";

function CardTile({ card, onOpen }) {
  const url = `http://127.0.0.1:8000/${card.front_image_path}`;

  return (
    <div
      onClick={() => onOpen(card.id)}
      style={{
        cursor: "pointer",
        border: "1px solid #ddd",
        padding: 6,
        borderRadius: 10
      }}
    >
      <img
        src={url}
        style={{ width: "100%", aspectRatio: "55/85", objectFit: "cover" }}
      />
    </div>
  );
}

function DetailView({ cardId, onClose }) {
  const [urls, setUrls] = useState(null);

  useEffect(() => {
    fetchCardImageUrls(cardId).then(setUrls);
  }, [cardId]);

  if (!urls) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={onClose}>Back</button>

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <img
          src={`http://127.0.0.1:8000${urls.front_url}`}
          style={{ height: 300 }}
        />

        {urls.back_url && (
          <img
            src={`http://127.0.0.1:8000${urls.back_url}`}
            style={{ height: 300 }}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchCards().then(setCards);
  }, []);

  if (selected) {
    return <DetailView cardId={selected} onClose={() => setSelected(null)} />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Photocard Binder</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,140px)",
          gap: 10
        }}
      >
        {cards.map((c) => (
          <CardTile key={c.id} card={c} onOpen={setSelected} />
        ))}
      </div>
    </div>
  );
}