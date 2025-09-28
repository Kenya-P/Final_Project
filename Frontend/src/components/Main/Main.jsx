import './Main.css';
import { useMemo, useState, useEffect } from 'react';
import PetCard from '../PetCard/PetCard.jsx';
import FiltersPanel from '../FiltersPanel/FiltersPanel.jsx';
import Preloader from '../Preloader/Preloader.jsx';
import PropTypes from 'prop-types';

export default function Main(props) {
  const {
    // data/options
    types = [],
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

  const activeCount = useMemo(
    () =>
      [selectedType, gender, size, age, q, city, state]
        .map((v) => (typeof v === 'string' ? v.trim() : v))
        .filter(Boolean).length,
    [selectedType, gender, size, age, q, city, state]
  );

  // ---- "Show only three" per rubric ----
  const [visibleCount, setVisibleCount] = useState(3);
  useEffect(() => {
    setVisibleCount(3);
  }, [animals]);
  const visibleAnimals = useMemo(
    () => animals.slice(0, visibleCount),
    [animals, visibleCount]
  );
  const canShowMore = animals.length > visibleCount;

  // Normalize types: support ["Dog"] OR [{ name:"Dog" }]
  const typeNames = Array.isArray(types)
    ? types.map((t) => (typeof t === 'string' ? t : t?.name)).filter(Boolean)
    : [];

  const page = pagination?.current_page ?? pagination?.page ?? 1;
  const totalPages = pagination?.total_pages ?? pagination?.totalPages ?? 1;

  const handlePrev = () => {
    if (canPrev) loadPets?.({ direction: 'prev' });
  };

  const handleNext = () => {
    if (canNext) loadPets?.({ direction: 'next' });
  };

  const errorText =
    typeof petsError === 'string'
      ? petsError
      : petsError?.message || petsError?.detail || 'Something went wrong';

  return (
    <main className="main">
      <div className="main__filtersbar">
        <button
          type="button"
          className="main__filtersbar-btn"
          aria-haspopup="dialog"
          aria-expanded={isFiltersOpen}
          onClick={() => setIsFiltersOpen(true)}
        >
          Filters{activeCount ? ` (${activeCount})` : ''}
        </button>
      </div>

      {isFiltersOpen && (
        <>
          <div
            className="filters__popover-overlay"
            onClick={() => setIsFiltersOpen(false)}
          />
          <div
            className="filters__popover"
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
          >
            <div className="filters__popover-header">
              <strong>Filters</strong>
              <button
                className="filters__popover-close"
                type="button"
                onClick={() => setIsFiltersOpen(false)}
              >
                ×
              </button>
            </div>

            <FiltersPanel
              selectedType={selectedType || ''}
              gender={gender || ''}
              size={size || ''}
              age={age || ''}
              q={q || ''}
              city={city || ''}
              state={state || ''}
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
              clearFilters={clearFilters}
              onClose={() => setIsFiltersOpen(false)}
              loading={isLoadingPets}
            />
          </div>
        </>
      )}

      {/* Main content */}
      <section className="main__content">
        {isLoadingPets && <Preloader />}

        {!isLoadingPets && petsError && (
          <p className="results__error">{errorText}</p>
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

Main.propTypes = {
  // data/options
  types: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ name: PropTypes.string.isRequired }),
    ])
  ),
  animals: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        name: PropTypes.string,
        photos: PropTypes.array,
      }),
      PropTypes.shape({
        _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        name: PropTypes.string,
        photos: PropTypes.array,
      }),
    ])
  ),
  pagination: PropTypes.shape({
    current_page: PropTypes.number,
    total_pages: PropTypes.number,
    page: PropTypes.number,
    totalPages: PropTypes.number,
    has_next: PropTypes.bool,
    has_prev: PropTypes.bool,
  }),
  genderOptions: PropTypes.arrayOf(PropTypes.string),
  sizeOptions: PropTypes.arrayOf(PropTypes.string),
  ageOptions: PropTypes.arrayOf(PropTypes.string),

  // selected values + handlers
  selectedType: PropTypes.string,
  gender: PropTypes.string,
  size: PropTypes.string,
  age: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  q: PropTypes.string,

  onTypeChange: PropTypes.func,
  onGenderChange: PropTypes.func,
  onSizeChange: PropTypes.func,
  onAgeChange: PropTypes.func,
  onCityChange: PropTypes.func,
  onStateChange: PropTypes.func,
  onQueryChange: PropTypes.func,
  clearFilters: PropTypes.func,

  // like/auth
  isPetSaved: PropTypes.func,
  toggleLike: PropTypes.func,
  onAuthRequired: PropTypes.func,
  isAuthenticated: PropTypes.bool,

  // status + paging
  isLoadingPets: PropTypes.bool,
  petsError: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  canPrev: PropTypes.bool,
  canNext: PropTypes.bool,
  loadPets: PropTypes.func,
};
