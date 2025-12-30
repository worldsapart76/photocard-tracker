from pathlib import Path
import shutil

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select
from sqlalchemy.orm import Session

from db import SessionLocal, engine
from models import Card
from models import Card as CardModel  # same name, just explicit

# ---------- Paths ----------
APP_ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = APP_ROOT / "images"
INBOX_DIR = IMAGES_DIR / "inbox"
LIBRARY_DIR = IMAGES_DIR / "library"

INBOX_DIR.mkdir(parents=True, exist_ok=True)
LIBRARY_DIR.mkdir(parents=True, exist_ok=True)

# ---------- App ----------
app = FastAPI(title="Photocard Tracker")

# Serve images (inbox + library)
app.mount("/images", StaticFiles(directory=str(IMAGES_DIR)), name="images")

# ---------- DB init ----------
from db import Base  # avoid circular import in some editors
Base.metadata.create_all(bind=engine)

def get_db() -> Session:
    return SessionLocal()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/inbox")
def list_inbox():
    files = [p.name for p in INBOX_DIR.iterdir() if p.is_file()]
    return {"count": len(files), "files": sorted(files)}

@app.get("/cards")
def list_cards(limit: int = 50):
    db = get_db()
    try:
        stmt = select(Card).order_by(Card.id.desc()).limit(limit)
        cards = db.execute(stmt).scalars().all()
        return [
            {
                "id": c.id,
                "group_code": c.group_code,
                "front_image_path": c.front_image_path,
                "back_image_path": c.back_image_path,
                "member": c.member,
                "notes": c.notes,
                "created_at": str(c.created_at),
            }
            for c in cards
        ]
    finally:
        db.close()

def format_card_filename(group_code: str, card_id: int, side: str, original_ext: str) -> str:
    """
    side: 'f' or 'b'
    original_ext includes the dot, like '.jpg'
    """
    return f"{group_code}_{card_id:06d}_{side}{original_ext.lower()}"

@app.post("/ingest/front")
def ingest_front(filename: str, group_code: str = "skz"):
    """
    Takes a file currently in images/inbox/<filename> and ingests it as a new card front.
    Moves it to images/library/<group>_<id>_f.ext and creates a DB row.
    """
    source_path = INBOX_DIR / filename
    if not source_path.exists() or not source_path.is_file():
        raise HTTPException(status_code=404, detail=f"File not found in inbox: {filename}")

    ext = source_path.suffix
    if ext == "":
        raise HTTPException(status_code=400, detail="File has no extension; please use .jpg/.png/.webp etc.")

    db = get_db()
    try:
        # Create row first so we get an auto-increment ID
        temp_rel_path = "PENDING"
        card = CardModel(group_code=group_code, front_image_path=temp_rel_path)
        db.add(card)
        db.commit()
        db.refresh(card)

        new_name = format_card_filename(group_code, card.id, "f", ext)
        dest_path = LIBRARY_DIR / new_name

        if dest_path.exists():
            raise HTTPException(status_code=409, detail=f"Destination already exists: {dest_path.name}")

        # Move the file
        shutil.move(str(source_path), str(dest_path))

        # Save relative path for portability
        rel_path = str(dest_path.relative_to(APP_ROOT)).replace("\\", "/")
        card.front_image_path = rel_path
        db.commit()

        return {
            "id": card.id,
            "front_image_path": card.front_image_path,
            "message": f"Ingested {filename} -> {dest_path.name}",
        }
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

@app.get("/cards/{card_id}")
def get_card(card_id: int):
    db = get_db()
    try:
        card = db.get(Card, card_id)
        if card is None:
            raise HTTPException(status_code=404, detail="Card not found")
        return {
            "id": card.id,
            "group_code": card.group_code,
            "front_image_path": card.front_image_path,
            "back_image_path": card.back_image_path,
            "member": card.member,
            "notes": card.notes,
            "created_at": str(card.created_at),
        }
    finally:
        db.close()

@app.get("/cards/{card_id}/image_urls")
def get_card_image_urls(card_id: int):
    """
    Returns URLs you can drop directly into <img src="..."> in the frontend.
    """
    db = get_db()
    try:
        card = db.get(Card, card_id)
        if card is None:
            raise HTTPException(status_code=404, detail="Card not found")

        def to_url(rel_path: str | None):
            if not rel_path:
                return None
            # rel_path like "images/library/xxx.jpg" but the static mount is "/images"
            # so we strip leading "images/"
            rp = rel_path.replace("\\", "/")
            if rp.startswith("images/"):
                rp = rp[len("images/"):]
            return f"/images/{rp}"

        return {
            "id": card.id,
            "front_url": to_url(card.front_image_path),
            "back_url": to_url(card.back_image_path),
        }
    finally:
        db.close()
