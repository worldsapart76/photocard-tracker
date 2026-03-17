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
  const [current, setCurrent] = useState(null);

  const [member, setMember] = useState("");
  const [topCategory, setTopCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);

  async function loadInbox() {
    const res = await fetch(`${API}/inbox`);
    const data = await res.json();

    setFiles(data.files);

    if (data.files.length > 0) {
      setCurrent(data.files[0]);
    } else {
      setCurrent(null);
    }
  }

  async function loadSubcategories(category) {
    if (!category) return;

    const res = await fetch(
      `${API}/subcategory-options?top_level_category=${encodeURIComponent(
        category
      )}`
    );

    const data = await res.json();
    setSubcategoryOptions(data);
  }

  async function ingest() {
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

    setMember("");
    setTopCategory("");
    setSubcategory("");
    setSubcategoryOptions([]);

    await loadInbox();
  }

  useEffect(() => {
    loadInbox();
  }, []);

  useEffect(() => {
    loadSubcategories(topCategory);
  }, [topCategory]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Inbox Manager</h2>

      {!current && <p>No images in inbox.</p>}

      {current && (
        <>
          <img
            src={`${API}${current.url}`}
            style={{ height: 300, border: "1px solid #ccc" }}
          />

          <h3>Member</h3>

          <div>
            {MEMBERS.map((m) => (
              <button
                key={m}
                onClick={() => setMember(m)}
                style={{
                  margin: 4,
                  background: member === m ? "#88f" : "#eee"
                }}
              >
                {m}
              </button>
            ))}
          </div>

          <h3>Top Category</h3>

          <button
            onClick={() => setTopCategory("Album")}
            style={{
              marginRight: 10,
              background: topCategory === "Album" ? "#88f" : "#eee"
            }}
          >
            Album
          </button>

          <button
            onClick={() => setTopCategory("Non-Album")}
            style={{
              background: topCategory === "Non-Album" ? "#88f" : "#eee"
            }}
          >
            Non-Album
          </button>

          {topCategory && (
            <>
              <h3>Sub Category</h3>

              <div>
                {subcategoryOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSubcategory(opt)}
                    style={{
                      margin: 4,
                      background: subcategory === opt ? "#88f" : "#eee"
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <input
                placeholder="Or type new value"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              />
            </>
          )}

          <div style={{ marginTop: 20 }}>
            <button onClick={ingest} style={{ padding: 10 }}>
              Save and Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}