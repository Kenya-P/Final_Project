import "./Main.css";
import { useMemo, useState, useEffect } from "react";
import PetCard from "../PetCard/PetCard.jsx";
import FiltersPanel from "../FiltersPanel/FiltersPanel.jsx";
import Preloader from "../Preloader/Preloader.jsx";

export default function Main(props) {
  const {
    // data/options
    types,
    animals = [],
    pagination,
    genderOptions,
    sizeOptions,
    ageOptions,

    // selected values + handlers
    selectedType,
    gender,
    size,
    age,
    city,
    state,
    q,
    onTypeChange,
    onGenderChange,
    onSizeChange,
    onAgeChange,
    onCityChange,
    onStateChange,
    onQueryChange,
    clearFilters,

    // like/auth
    isPetSaved,
    toggleLike,
    onAuthRequired = () => {},
    isAuthenticated = false,

    // status + paging
    isLoadingPets,
    petsError,
    canPrev,
    canNext,
    loadPets,
  } = props;

  // (optional) mobile drawer state if your FilterPanel supports it
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // ---- "Show only three" per rubric ----
  const [visibleCount, setVisibleCount] = useState(3);
  useEffect(() => { setVisibleCount(3); }, [animals]);
  const visibleAnimals = useMemo(
    () => animals.slice(0, visibleCount),
    [animals, visibleCount]
  );
  const canShowMore = animals.length > visibleCount;

  // Normalize types: support ["Dog"] OR [{ name:"Dog" }]
  const typeNames = useMemo(
    () =>
      Array.from(
        new Set(
          (types ?? [])
            .map((t) => (typeof t === "string" ? t : t?.name))
            .filter(Boolean)
        )
      ),
    [types]
  );

  const page = pagination?.current_page ?? pagination?.page ?? 1;
  const totalPages = pagination?.total_pages ?? pagination?.totalPages ?? 1;

  const handlePrev = () => {
    if (canPrev) loadPets?.({ direction: "prev" });
  };
  
  const handleNext = () => {
    if (canNext) loadPets?.({ direction: "next" });
  };

  return (
    <main className="main">
      <aside className="main__sidebar">
        <FiltersPanel
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}

          selectedType={selectedType || ""}
          gender={gender || ""}
          size={size || ""}
          age={age || ""}
          q={q || ""}
          city={city || ""}
          state={state || ""}

          typeNames={typeNames}
          genderOptions={genderOptions || []}
          sizeOptions={sizeOptions || []}
          ageOptions={ageOptions || []}

          onTypeChange={onTypeChange}
          onGenderChange={onGenderChange}
          onSizeChange={onSizeChange}
          onAgeChange={onAgeChange}
          onQueryChange={onQueryChange}
          onCityChange={onCityChange}
          onStateChange={onStateChange}
          onClear={clearFilters}
        />
      </aside>

      {/* Main content */}
      <section className="main__content">
        {isLoadingPets && <Preloader />}

        {!isLoadingPets && petsError && (
          <p className="results__error">
            {petsError}
          </p>
        )}

        {!isLoadingPets && !petsError && animals.length === 0 && (
          <p className="results__empty">Nothing found</p>
        )}

        {!isLoadingPets && !petsError && animals.length > 0 && (
          <>
            <ul className="main__pet-grid">
              {visibleAnimals.map((pet) => (
                <li key={pet.id ?? pet._id}>
                  <PetCard
                    pet={pet}
                    isSaved={isPetSaved?.(pet)}
                    canSave={isAuthenticated}
                    onToggleSave={() => toggleLike?.(pet)}
                    onAuthRequired={onAuthRequired}
                  />
                </li>
              ))}
            </ul>

            {canShowMore && (
              <button
                className="show-more"
                type="button"
                onClick={() => setVisibleCount((c) => c + 3)}
              >
                Show more
              </button>
            )}
          </>
        )}

        <div className="main__pagination">
          <button
            className="main__pagination-btn"
            type="button"
            onClick={handlePrev}
            disabled={!canPrev || isLoadingPets}
          >
            Prev
          </button>
          <span className="main__pagination-status">
            {page} / {totalPages}
          </span>
          <button
            className="main__pagination-btn"
            type="button"
            onClick={handleNext}
            disabled={!canNext || isLoadingPets}
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}