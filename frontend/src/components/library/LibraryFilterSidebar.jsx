import FilterSection from "./FilterSection";
import FilterSearchList from "./FilterSearchList";

export default function LibraryFilterSidebar({
  filters,
  availableOptions,
  onSearchChange,
  onToggleMember,
  onToggleGroupCode,
  onToggleTopLevelCategory,
  onToggleSubCategory,
  onToggleBackStatus,
  onClearAll,
}) {
  return (
    <aside className="library-sidebar">
      <div className="library-sidebar-title">Filters</div>

      <FilterSection title="Search">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notes..."
        />
      </FilterSection>

      <FilterSection title="Member">
        <FilterSearchList
          items={availableOptions.members}
          selectedItems={filters.members}
          onToggleItem={onToggleMember}
          searchable
          searchPlaceholder="Find member..."
        />
      </FilterSection>

      <FilterSection title="Group">
        <FilterSearchList
          items={availableOptions.groupCodes}
          selectedItems={filters.groupCodes}
          onToggleItem={onToggleGroupCode}
        />
      </FilterSection>

      <FilterSection title="Category">
        <FilterSearchList
          items={availableOptions.topLevelCategories}
          selectedItems={filters.topLevelCategories}
          onToggleItem={onToggleTopLevelCategory}
        />
      </FilterSection>

      <FilterSection title="Subcategory">
        <FilterSearchList
          items={availableOptions.subCategories}
          selectedItems={filters.subCategories}
          onToggleItem={onToggleSubCategory}
          searchable
          searchPlaceholder="Find subcategory..."
        />
      </FilterSection>

      <FilterSection title="Back Status">
        <FilterSearchList
          items={["has-back", "missing-back"]}
          selectedItems={filters.backStatus}
          onToggleItem={onToggleBackStatus}
          formatItemLabel={(item) => (item === "has-back" ? "Has Back" : "Missing Back")}
        />
      </FilterSection>

      <button type="button" className="clear-filters-button" onClick={onClearAll}>
        Clear All
      </button>
    </aside>
  );
}