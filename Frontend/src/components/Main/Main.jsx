import "./Main.css";
import React, { useMemo, useState } from "react";
import PetCard from "../PetCard/PetCard.jsx";
import FiltersPanel from "../FiltersPanel/FiltersPanel.jsx";

export default function Main(props) {
  const {
    // data/options
    types, animals, pagination, genderOptions, sizeOptions, ageOptions,
    // selected values + handlers
    selectedType, gender, size, age, city, state, q,
    onTypeChange, onGenderChange, onSizeChange, onAgeChange,
    onCityChange, onStateChange, onQueryChange, clearFilters,
    // like/auth
    isPetSaved, toggleLike, onAuthRequired = () => {}, isAuthenticated = false,
    // status + paging
    loading, error, canPrev, canNext, loadPets,
  } = props;

  // (optional) mobile drawer state if your FilterPanel supports it
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Normalize types: support ["Dog"] OR [{ name:"Dog" }]
  const typeNames = useMemo(
    () =>
      Array.from(
        new Set((types ?? []).map(t => (typeof t === "string" ? t : t?.name)).filter(Boolean))
      ),
    [types]
  );

  const handlePrev = () => { if (canPrev) loadPets?.({ direction: "prev" }); };
  const handleNext = () => { if (canNext) loadPets?.({ direction: "next" }); };

  return (
    <main className="main">
      {/* Sidebar */}
      <aside className="main__sidebar">
        <FiltersPanel
          // if your component supports a slide-out on mobile:
          isOpen={isFiltersOpen}
          onClose={(open) => setIsFiltersOpen(!!open && open !== false)}

          // values
          selectedType={selectedType || ""}
          gender={gender || ""}
          size={size || ""}
          age={age || ""}
          q={q || ""}
          city={city || ""}
          state={state || ""}

          // options
          typeNames={typeNames}
          genderOptions={genderOptions || []}
          sizeOptions={sizeOptions || []}
          ageOptions={ageOptions || []}

          // handlers
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
        {loading && <p>Loading pets…</p>}
        {!loading && error && (
          <p role="alert">Error: {String(error?.detail || error)}</p>
        )}
        {!loading && !error && (!animals || animals.length === 0) && (
          <p>No pets found. Try adjusting filters.</p>
        )}

        <ul className="main__pet-grid">
          {(animals || []).map((pet) => (
            <PetCard
              key={pet.id ?? pet._id}
              pet={pet}
              isSaved={isPetSaved?.(pet)}
              canSave={isAuthenticated}
              onToggleSave={() => toggleLike?.(pet)}
              onAuthRequired={onAuthRequired}
            />
          ))}
        </ul>

        <div className="main__pagination">
          <button className="main__pagination-btn" type="button" onClick={handlePrev} disabled={!canPrev || loading}>
            Prev
          </button>
          <span className="main__pagination-status">
            {pagination?.page ?? 1} / {pagination?.totalPages ?? 1}
          </span>
          <button className="main__pagination-btn" type="button" onClick={handleNext} disabled={!canNext || loading}>
            Next
          </button>
        </div>
      </section>
    </main>
  );
}

