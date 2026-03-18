import FilterSection from "./FilterSection";
import FilterSearchList from "./FilterSearchList";
import { getGroupLabel } from "../../utils/groupUtils";

export default function LibraryFilterSidebar({
  filters,
  availableOptions,
  onSearchChange,
  onToggleMember,
  onToggleGroupCode,
  onToggleTopLevelCategory,
  onToggleSubCategory,
  onToggleBackStatus,
  onToggleOwnershipStatus,
  onClearAll,
}) {
  const sectionStyle = {
    padding: "6px 0",
    borderBottom: "1px solid #ddd",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: 4,
  };

  return (
    <aside className="library-sidebar" style={{ fontSize: "13px" }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Filters</div>

      <div style={sectionStyle}>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notes..."
          style={{ width: "100%", padding: "4px" }}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Member</div>
        <FilterSearchList
          items={availableOptions.members}
          selectedItems={filters.members}
          onToggleItem={onToggleMember}
          searchable={false}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Group</div>
        <FilterSearchList
          items={availableOptions.groupCodes}
          selectedItems={filters.groupCodes}
          onToggleItem={onToggleGroupCode}
          formatItemLabel={getGroupLabel}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Category</div>
        <FilterSearchList
          items={availableOptions.topLevelCategories}
          selectedItems={filters.topLevelCategories}
          onToggleItem={onToggleTopLevelCategory}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Subcategory</div>
        <FilterSearchList
          items={availableOptions.subCategories}
          selectedItems={filters.subCategories}
          onToggleItem={onToggleSubCategory}
          searchable
          searchPlaceholder="Find subcategory..."
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Ownership</div>
        <FilterSearchList
          items={["Owned", "Want", "For Trade"]}
          selectedItems={filters.ownershipStatus || []}
          onToggleItem={onToggleOwnershipStatus}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Back Status</div>
        <FilterSearchList
          items={["has-back", "missing-back"]}
          selectedItems={filters.backStatus}
          onToggleItem={onToggleBackStatus}
          formatItemLabel={(item) =>
            item === "has-back" ? "Has Back" : "Missing Back"
          }
        />
      </div>

      <div style={{ paddingTop: 6 }}>
        <button
          type="button"
          className="clear-filters-button"
          onClick={onClearAll}
          style={{ padding: "4px 8px" }}
        >
          Clear All
        </button>
      </div>
    </aside>
  );
}