import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";

const OWNERSHIP_OPTIONS = ["Owned", "Want", "For Trade"];

export default function ExportPage() {
  const [ownershipTypes, setOwnershipTypes] = useState(["For Trade"]);
  const [includeCaptions, setIncludeCaptions] = useState(true);
  const [includeBacks, setIncludeBacks] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  function toggleOwnershipType(value) {
    setOwnershipTypes((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  }

  async function handleExport() {
    if (ownershipTypes.length === 0) {
      setError("Select at least one ownership type.");
      return;
    }

    setIsExporting(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/export/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownership_types: ownershipTypes,
          include_captions: includeCaptions,
          include_backs: includeBacks,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Export failed.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "photocard_export.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <PageContainer>
      <div style={{ maxWidth: 700 }}>
        <h2 style={{ marginTop: 0 }}>Export PDF</h2>
        <p style={{ marginTop: 0 }}>
          Choose which ownership sections to include, then export a shareable PDF.
        </p>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Ownership Types</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {OWNERSHIP_OPTIONS.map((option) => (
              <label key={option} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={ownershipTypes.includes(option)}
                  onChange={() => toggleOwnershipType(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Options</div>

          <label style={{ display: "block", marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={includeCaptions}
              onChange={(e) => setIncludeCaptions(e.target.checked)}
            />{" "}
            Include captions
          </label>

          <label style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={includeBacks}
              onChange={(e) => setIncludeBacks(e.target.checked)}
            />{" "}
            Include backs
          </label>
        </div>

        <button type="button" onClick={handleExport} disabled={isExporting}>
          {isExporting ? "Exporting..." : "Export PDF"}
        </button>

        {error ? (
          <div style={{ marginTop: 12, color: "#b00020" }}>
            {error}
          </div>
        ) : null}
      </div>
    </PageContainer>
  );
}