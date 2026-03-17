import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

const MEMBERS = [
  "Bang Chan",
  "Lee Know",
  "Changbin",
  "Hyunjin",
  "Han",
  "Felix",
  "Seungmin",
  "I.N",
  "Multiple"
];

export default function InboxManager() {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [member, setMember] = useState("");
  const [topCategory, setTopCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);

  function resetSelections() {
    setMember("");
    setTopCategory("");
    setSubcategory("");
    setSubcategoryOptions([]);
  }

  async function loadInbox() {
    const res = await fetch(`${API}/inbox`);
    const data = await res.json();
    setFiles(data.files || []);
    setCurrentIndex(0);
    resetSelections();
  }

  async function loadSubcategories(category) {
    if (!category) {
      setSubcategoryOptions([]);
      return;
    }

    const res = await fetch(
      `${API}/subcategory-options?top_level_category=${encodeURIComponent(category)}`
    );
    const data = await res.json();
    setSubcategoryOptions(data);
  }

  async function ingest() {
    const current = files[currentIndex];
    if (!current) return;

    const params = new URLSearchParams({
      filename: current.filename,
      group_code: "skz",
      member: member,
      top_level_category: topCategory,
      sub_category: subcategory
    });

    await fetch(`${API}/ingest/front?${params.toString()}`, {
      method: "POST"
    });

    await loadInbox();
  }

  function goPrevious() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetSelections();
    }
  }

  function goNext() {
    if (currentIndex < files.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetSelections();
    }
  }

  useEffect(() => {
    loadInbox();
  }, []);

  useEffect(() => {
    loadSubcategories(topCategory);
  }, [topCategory]);

  const current = files[currentIndex];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>Inbox Manager</h2>

      {!current && <p>No images in inbox.</p>}

      {current && (
        <>
          <div style={{ marginBottom: 12 }}>
            <strong>
              Image {currentIndex + 1} of {files.length}
            </strong>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 24
            }}
          >
            <div style={{ flex: "0 0 320px" }}>
              <img
                src={`${API}${current.url}`}
                style={{
                  width: "100%",
                  maxHeight: "75vh",
                  objectFit: "contain",
                  border: "1px solid #ccc"
                }}
              />

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button onClick={goPrevious} disabled={currentIndex === 0}>
                  Previous
                </button>

                <button
                  onClick={goNext}
                  disabled={currentIndex === files.length - 1}
                >
                  Next
                </button>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ marginTop: 0 }}>Member</h3>

              <div style={{ marginBottom: 16 }}>
                {MEMBERS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMember(m)}
                    style={{
                      margin: 4,
                      padding: "8px 12px",
                      background: member === m ? "#88f" : "#eee"
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <h3>Top Category</h3>

              <div style={{ marginBottom: 16 }}>
                <button
                  onClick={() => {
                    setTopCategory("Album");
                    setSubcategory("");
                  }}
                  style={{
                    marginRight: 10,
                    padding: "8px 12px",
                    background: topCategory === "Album" ? "#88f" : "#eee"
                  }}
                >
                  Album
                </button>

                <button
                  onClick={() => {
                    setTopCategory("Non-Album");
                    setSubcategory("");
                  }}
                  style={{
                    padding: "8px 12px",
                    background: topCategory === "Non-Album" ? "#88f" : "#eee"
                  }}
                >
                  Non-Album
                </button>
              </div>

              {topCategory && (
                <>
                  <h3>Sub Category</h3>

                  <div style={{ marginBottom: 12 }}>
                    {subcategoryOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSubcategory(opt)}
                        style={{
                          margin: 4,
                          padding: "8px 12px",
                          background: subcategory === opt ? "#88f" : "#eee"
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <input
                      placeholder="Or type new value"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      style={{ padding: 8, width: 250 }}
                    />
                  </div>
                </>
              )}

              <button onClick={ingest} style={{ padding: "10px 16px" }}>
                Save and Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}