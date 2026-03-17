import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import LibraryFilterSidebar from "../components/library/LibraryFilterSidebar";
import LibraryControls from "../components/library/LibraryControls";
import LibraryPagination from "../components/library/LibraryPagination";
import LibraryGrid from "../components/library/LibraryGrid";
import CardDetailModal from "../components/library/CardDetailModal";
import { getCards } from "../services/libraryApi";
import { buildDisplayItems } from "../utils/libraryTransforms";
import { filterCards } from "../utils/filterUtils";
import { sortCards } from "../utils/sortUtils";
import { useLibraryPagination } from "../hooks/useLibraryPagination";
import { sortMembersForGroup } from "../utils/groupUtils";

const emptyFilters = {
  search: "",
  members: [],
  groupCodes: [],
  topLevelCategories: [],
  subCategories: [],
  backStatus: [],
};

export default function LibraryPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  const [viewMode, setViewMode] = useState("fronts");
  const [sizeMode, setSizeMode] = useState("M");
  const [sortMode, setSortMode] = useState("id-asc");
  const [captionsEnabled, setCaptionsEnabled] = useState(false);

  const [filters, setFilters] = useState(emptyFilters);

  useEffect(() => {
    async function loadCards() {
      try {
        setLoading(true);
        setError("");
        const data = await getCards();
        setCards(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load library.");
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, []);

const availableOptions = useMemo(() => {
  const uniqueMembers = [...new Set(cards.map((c) => c.member).filter(Boolean))];
  const uniqueGroupCodes = [...new Set(cards.map((c) => c.group_code).filter(Boolean))].sort();
  const uniqueTopLevelCategories = [
    ...new Set(cards.map((c) => c.top_level_category).filter(Boolean)),
  ].sort();
  const uniqueSubCategories = [...new Set(cards.map((c) => c.sub_category).filter(Boolean))].sort();

  const orderedMembers = sortMembersForGroup(uniqueMembers, "skz");

  return {
    members: orderedMembers,
    groupCodes: uniqueGroupCodes,
    topLevelCategories: uniqueTopLevelCategories,
    subCategories: uniqueSubCategories,
  };
}, [cards]);

  const filteredCards = useMemo(() => {
    return filterCards(cards, filters);
  }, [cards, filters]);

  const sortedCards = useMemo(() => {
    return sortCards(filteredCards, sortMode);
  }, [filteredCards, sortMode]);

  const displayItems = useMemo(() => {
    return buildDisplayItems(sortedCards, viewMode);
  }, [sortedCards, viewMode]);

  const {
    currentPage,
    totalPages,
    pageItems,
    canPrev,
    canNext,
    goPrev,
    goNext,
    resetToFirstPage,
  } = useLibraryPagination(displayItems, 30);

  useEffect(() => {
    resetToFirstPage();
  }, [filters, sortMode, viewMode, resetToFirstPage]);

  function toggleInArray(key, value) {
    setFilters((prev) => {
      const arr = prev[key];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }

  function clearAllFilters() {
    setFilters(emptyFilters);
  }

  function handleSelectItem(item) {
    setSelectedCard(item.card);
  }

  function handleCloseModal() {
    setSelectedCard(null);
  }

  function handleSavedCard(updatedCard) {
    const stampedCard = {
      ...updatedCard,
      _imageVersion: Date.now(),
    };

    setCards((prev) =>
      prev.map((existing) => (existing.id === updatedCard.id ? stampedCard : existing))
    );
  }
  
  function handleDeletedCard(deletedId) {
  setCards((prev) => prev.filter((existing) => existing.id !== deletedId));
  }

  return (
    <PageContainer className="library-page">
      <div className="library-layout">
        <LibraryFilterSidebar
          filters={filters}
          availableOptions={availableOptions}
          onSearchChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
          onToggleMember={(value) => toggleInArray("members", value)}
          onToggleGroupCode={(value) => toggleInArray("groupCodes", value)}
          onToggleTopLevelCategory={(value) => toggleInArray("topLevelCategories", value)}
          onToggleSubCategory={(value) => toggleInArray("subCategories", value)}
          onToggleBackStatus={(value) => toggleInArray("backStatus", value)}
          onClearAll={clearAllFilters}
        />

        <div className="library-content">
          <LibraryControls
            viewMode={viewMode}
            sizeMode={sizeMode}
            sortMode={sortMode}
            captionsEnabled={captionsEnabled}
            onViewModeChange={setViewMode}
            onSizeModeChange={setSizeMode}
            onSortModeChange={setSortMode}
            onCaptionsToggle={setCaptionsEnabled}
          />

          <LibraryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCards={displayItems.length}
            canPrev={canPrev}
            canNext={canNext}
            onPrev={goPrev}
            onNext={goNext}
          />

          {loading ? <div className="state-message">Loading library...</div> : null}
          {error ? <div className="state-message error">{error}</div> : null}

			{pageItems.length === 0 ? (
			  <div className="state-message">No cards match your filters.</div>
			) : (
			  <LibraryGrid
				items={pageItems}
				sizeMode={sizeMode}
				captionsEnabled={captionsEnabled}
				onSelectItem={handleSelectItem}
			  />
			)}
        </div>
      </div>

      <CardDetailModal
        card={selectedCard}
        isOpen={Boolean(selectedCard)}
        onClose={handleCloseModal}
        onSaved={handleSavedCard}
        onDeleted={handleDeletedCard}
      />
    </PageContainer>
  );
}