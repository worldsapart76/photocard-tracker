import { useEffect, useState } from "react";
import { getMembersForGroup } from "./utils/groupUtils";
import {
  fetchInbox,
  fetchSubcategoryOptions,
  ingestFront,
  fetchCardCandidates,
  attachBack,
} from "./api";

const API = "http://127.0.0.1:8000";

export default function InboxManager() {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [mode, setMode] = useState("front");

  const [groupCode, setGroupCode] = useState("skz");
  const [member, setMember] = useState("");
  const [topCategory, setTopCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);

  const [ownershipStatus, setOwnershipStatus] = useState("Owned");
  const [price, setPrice] = useState("");

  const [includeCardsWithBack, setIncludeCardsWithBack] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  const [message, setMessage] = useState("");
  const [warningData, setWarningData] = useState(null);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  const memberOptions = getMembersForGroup(groupCode);

  function resetSelections() {
    setMode("front");
    setGroupCode("skz");
    setMember("");
    setTopCategory("");
    setSubcategory("");
    setSubcategoryOptions([]);
    setOwnershipStatus("Owned");
    setPrice("");
    setIncludeCardsWithBack(false);
    setCandidates([]);
    setSelectedCandidateId(null);
    setMessage("");
    setWarningData(null);
  }

  async function loadInbox() {
    const data = await fetchInbox();
    const newFiles = data.files || [];
    setFiles(newFiles);

    if (newFiles.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex > newFiles.length - 1) {
      setCurrentIndex(newFiles.length - 1);
    }
  }

  async function loadSubcategories(category) {
    if (!category) {
      setSubcategoryOptions([]);
      return;
    }

    const data = await fetchSubcategoryOptions(category);
    setSubcategoryOptions(data);
  }

  async function loadCandidates() {
    if (mode !== "back") {
      setCandidates([]);
      return;
    }

    if (!member || !topCategory || !subcategory) {
      setCandidates([]);
      return;
    }

    setLoadingCandidates(true);
    try {
      const data = await fetchCardCandidates({
        groupCode,
        member,
        topLevelCategory: topCategory,
        subCategory: subcategory,
        includeCardsWithBack,
      });
      setCandidates(data);
    } finally {
      setLoadingCandidates(false);
    }
  }

  async function saveFront() {
    const current = files[currentIndex];
    if (!current) return;

    if (!member || !topCategory || !subcategory) {
      setMessage("Please select group, member, top category, and subcategory first.");
      return;
    }

    setMessage("");

    await ingestFront({
      filename: current.filename,
      groupCode,
      member,
      topLevelCategory: topCategory,
      subCategory: subcategory,
      ownershipStatus,
      price: price === "" ? "" : Number(price),
    });

    await loadInbox();
    resetSelections();
  }

  async function saveBack(forceReplace = false) {
    const current = files[currentIndex];
    if (!current) return;

    if (!selectedCandidateId) {
      setMessage("Please select a matching front card first.");
      return;
    }

    setMessage("");

    const result = await attachBack({
      cardId: selectedCandidateId,
      filename: current.filename,
      forceReplace,
    });

    if (result.needs_confirmation) {
      setWarningData(result);
      setMessage(result.message);
      return;
    }

    setWarningData(null);
    await loadInbox();
    resetSelections();
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

  function handleGroupChange(nextGroupCode) {
    setGroupCode(nextGroupCode);
    setMember("");
    setSelectedCandidateId(null);
    setWarningData(null);
    setMessage("");
    setCandidates([]);
  }

  useEffect(() => {
    loadInbox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadSubcategories(topCategory);
  }, [topCategory]);

  useEffect(() => {
    loadCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, groupCode, member, topCategory, subcategory, includeCardsWithBack]);

  const current = files[currentIndex];

  return (
    <div style={{ padding: 12 }}>
      <h2 style={{ marginTop: 0, marginBottom: 6, fontSize: 18 }}>Inbox Manager</h2>

      {!current && <p>No images in inbox.</p>}

      {current && (
        <>
          <div style={{ marginBottom: 6, fontSize: 14 }}>
            <strong>
              Image {currentIndex + 1} of {files.length}
            </strong>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
            }}
          >
            <div style={{ flex: "0 0 300px" }}>
              <img
                src={`${API}${current.url}`}
                alt={current.filename}
                style={{
                  width: "100%",
                  maxHeight: "75vh",
                  objectFit: "contain",
                  border: "1px solid #ccc",
                }}
              />

              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                  <button
                    onClick={goPrevious}
                    disabled={currentIndex === 0}
                    style={{ padding: "2px 8px" }}
                  >
                    Previous
                  </button>

                  <button
                    onClick={goNext}
                    disabled={currentIndex === files.length - 1}
                    style={{ padding: "2px 8px" }}
                  >
                    Next
                  </button>
                </div>

                <div>
                  <div style={{ fontWeight: "bold", marginBottom: 4 }}>Mode</div>

                  <button
                    onClick={() => {
                      setMode("front");
                      setCandidates([]);
                      setSelectedCandidateId(null);
                      setWarningData(null);
                      setMessage("");
                    }}
                    style={{
                      marginRight: 6,
                      padding: "2px 8px",
                      background: mode === "front" ? "#88f" : "#eee",
                    }}
                  >
                    Front
                  </button>

                  <button
                    onClick={() => {
                      setMode("back");
                      setSelectedCandidateId(null);
                      setWarningData(null);
                      setMessage("");
                    }}
                    style={{
                      padding: "2px 8px",
                      background: mode === "back" ? "#88f" : "#eee",
                    }}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ marginTop: 0, marginBottom: 4 }}>Group</h3>

              <div style={{ marginBottom: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => handleGroupChange("skz")}
                  style={{
                    padding: "2px 8px",
                    background: groupCode === "skz" ? "#88f" : "#eee",
                  }}
                >
                  Stray Kids
                </button>

                <button
                  type="button"
                  onClick={() => handleGroupChange("atz")}
                  style={{
                    padding: "2px 8px",
                    background: groupCode === "atz" ? "#88f" : "#eee",
                  }}
                >
                  ATEEZ
                </button>

                <button
                  type="button"
                  onClick={() => handleGroupChange("txt")}
                  style={{
                    padding: "2px 8px",
                    background: groupCode === "txt" ? "#88f" : "#eee",
                  }}
                >
                  TXT
                </button>
              </div>

              <h3 style={{ marginTop: 0, marginBottom: 4 }}>Member</h3>

              <div style={{ marginBottom: 10 }}>
                {memberOptions.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMember(m);
                      setSelectedCandidateId(null);
                      setWarningData(null);
                      setMessage("");
                    }}
                    style={{
                      margin: 2,
                      padding: "2px 8px",
                      background: member === m ? "#88f" : "#eee",
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <h3 style={{ marginTop: 0, marginBottom: 4 }}>Top Category</h3>

              <div style={{ marginBottom: 10 }}>
                <button
                  onClick={() => {
                    setTopCategory("Album");
                    setSubcategory("");
                    setSelectedCandidateId(null);
                    setWarningData(null);
                  }}
                  style={{
                    marginRight: 6,
                    padding: "2px 8px",
                    background: topCategory === "Album" ? "#88f" : "#eee",
                  }}
                >
                  Album
                </button>

                <button
                  onClick={() => {
                    setTopCategory("Non-Album");
                    setSubcategory("");
                    setSelectedCandidateId(null);
                    setWarningData(null);
                  }}
                  style={{
                    padding: "2px 8px",
                    background: topCategory === "Non-Album" ? "#88f" : "#eee",
                  }}
                >
                  Non-Album
                </button>
              </div>

              {topCategory && (
                <>
                  <h3 style={{ marginTop: 0, marginBottom: 4 }}>Sub Category</h3>

                  <div style={{ marginBottom: 6 }}>
                    {subcategoryOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSubcategory(opt);
                          setSelectedCandidateId(null);
                          setWarningData(null);
                        }}
                        style={{
                          margin: 2,
                          padding: "2px 8px",
                          background: subcategory === opt ? "#88f" : "#eee",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <input
                      placeholder="Or type new value"
                      value={subcategory}
                      onChange={(e) => {
                        setSubcategory(e.target.value);
                        setSelectedCandidateId(null);
                        setWarningData(null);
                      }}
                      style={{ padding: 4, width: 250 }}
                    />
                  </div>
                </>
              )}

              <h3 style={{ marginTop: 0, marginBottom: 4 }}>Ownership Status</h3>

              <div style={{ marginBottom: 10 }}>
                <button
                  onClick={() => setOwnershipStatus("Owned")}
                  style={{
                    marginRight: 6,
                    padding: "2px 8px",
                    background: ownershipStatus === "Owned" ? "#88f" : "#eee",
                  }}
                >
                  Owned
                </button>

                <button
                  onClick={() => setOwnershipStatus("Want")}
                  style={{
                    marginRight: 6,
                    padding: "2px 8px",
                    background: ownershipStatus === "Want" ? "#88f" : "#eee",
                  }}
                >
                  Want
                </button>

                <button
                  onClick={() => setOwnershipStatus("For Trade")}
                  style={{
                    padding: "2px 8px",
                    background: ownershipStatus === "For Trade" ? "#88f" : "#eee",
                  }}
                >
                  For Trade
                </button>
              </div>

              <h3 style={{ marginTop: 0, marginBottom: 4 }}>Price</h3>

              <div style={{ marginBottom: 10 }}>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Optional"
                  style={{ padding: 4, width: 120 }}
                />
              </div>

              {mode === "back" && (
                <>
                  <h3 style={{ marginTop: 0, marginBottom: 4 }}>Matching Front Cards</h3>

                  <label style={{ display: "block", marginBottom: 6 }}>
                    <input
                      type="checkbox"
                      checked={includeCardsWithBack}
                      onChange={(e) => {
                        setIncludeCardsWithBack(e.target.checked);
                        setSelectedCandidateId(null);
                        setWarningData(null);
                      }}
                    />{" "}
                    Show all cards, including ones that already have a back
                  </label>

                  {!member || !topCategory || !subcategory ? (
                    <p style={{ color: "#666", marginTop: 0 }}>
                      Select member, top category, and subcategory to load candidate front cards.
                    </p>
                  ) : loadingCandidates ? (
                    <p style={{ marginTop: 0 }}>Loading matching cards...</p>
                  ) : candidates.length === 0 ? (
                    <p style={{ marginTop: 0 }}>No matching front cards found.</p>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                        gap: 8,
                        marginBottom: 10,
                        maxHeight: "38vh",
                        overflowY: "auto",
                        paddingRight: 4,
                      }}
                    >
                      {candidates.map((card) => (
                        <button
                          key={card.id}
                          onClick={() => {
                            setSelectedCandidateId(card.id);
                            setWarningData(null);
                            setMessage("");
                          }}
                          style={{
                            border:
                              selectedCandidateId === card.id
                                ? "3px solid #4a67ff"
                                : "1px solid #ccc",
                            borderRadius: 8,
                            padding: 4,
                            background: "#fff",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          <img
                            src={`${API}${card.front_url}`}
                            alt={`Card ${card.id}`}
                            style={{
                              width: "100%",
                              aspectRatio: "55 / 85",
                              objectFit: "cover",
                              borderRadius: 4,
                              marginBottom: 4,
                            }}
                          />

                          <div style={{ fontSize: 11, lineHeight: 1.25 }}>
                            <div>
                              <strong>ID:</strong> {card.id}
                            </div>
                            <div>{card.member || "—"}</div>
                            <div>{card.sub_category || "—"}</div>
                            <div style={{ color: card.has_back ? "#b00" : "#090" }}>
                              {card.has_back ? "Already has back" : "No back yet"}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {message && (
                <div
                  style={{
                    marginBottom: 8,
                    padding: 8,
                    border: "1px solid #ccc",
                    background: "#f8f8f8",
                    fontSize: 13,
                  }}
                >
                  {message}
                </div>
              )}

              {warningData && (
                <div
                  style={{
                    marginBottom: 8,
                    padding: 8,
                    border: "1px solid #d99",
                    background: "#fff3f3",
                    fontSize: 13,
                  }}
                >
                  <div style={{ marginBottom: 8 }}>
                    This card already has a back image.
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => {
                        setWarningData(null);
                        setMessage("");
                      }}
                      style={{ padding: "2px 8px" }}
                    >
                      Cancel
                    </button>

                    <button onClick={() => saveBack(true)} style={{ padding: "2px 8px" }}>
                      Replace Anyway
                    </button>
                  </div>
                </div>
              )}

              {mode === "front" ? (
                <button onClick={saveFront} style={{ padding: "4px 10px" }}>
                  Save Front and Next
                </button>
              ) : (
                <button onClick={() => saveBack(false)} style={{ padding: "4px 10px" }}>
                  Attach Back and Next
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}