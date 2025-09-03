import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { getPets } from '../../../utils/PetFinderApi';
import PetCard from '../PetCard/PetCard.jsx';
import Preloader from '../Preloader/Preloader';
import FiltersPanel from '../FiltersPanel/FiltersPanel.jsx';
import './Main.css';

export default function Main(props) {
  const {
    // data
    types, animals, savedPets, pagination, genderOptions, sizeOptions, ageOptions,
    // selections
    selectedType, gender, size, age, city, state, q,
    // ui
    error, canPrev, canNext,
    // actions
    loadPets, loadSavedPets, toggleLike, isPetSaved,
    onTypeChange, onGenderChange, onSizeChange, onAgeChange,
    onCityChange, onStateChange, onQueryChange, clearFilters,
    onAuthRequired = () => {},
  } = props;

  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount = useMemo(
    () => [selectedType, gender, size, age, city, state, q].filter(Boolean).length,
    [selectedType, gender, size, age, city, state, q]
  );

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    setLoading(true);
    setErr('');
    getPets({
      type: selectedType || undefined,
    }).then((data) => {
      setPets(data.animals);
      setLoading(false);
    }).catch((e) => {
      setErr(e.message || 'An error occurred while fetching pets.');
      setLoading(false);
    });
  }, [selectedType]);

  const handleToggle = (pet) =>
    toggleLike(pet).catch((e) => {
      if (e?.status === 401) onAuthRequired();
    });

  return (
    <section className="main">
      <h1 className="main__title">Find your perfect pet companion.</h1>

      <div className="main__layout">
        {/* Desktop sidebar */}
        <aside className="main__sidebar">
          <FiltersPanel
            types={types}
            genderOptions={genderOptions}
            sizeOptions={sizeOptions}
            ageOptions={ageOptions}
            selectedType={selectedType}
            gender={gender}
            size={size}
            age={age}
            city={city}
            state={state}
            q={q}
            loading={loading}
            onTypeChange={onTypeChange}
            onGenderChange={onGenderChange}
            onSizeChange={onSizeChange}
            onAgeChange={onAgeChange}
            onCityChange={onCityChange}
            onStateChange={onStateChange}
            onQueryChange={onQueryChange}
            clearFilters={clearFilters}
          />
        </aside>

        {/* Content area */}
        <div className="main__content">
          {/* Mobile dropdown trigger */}
          <div className="main__filters-mobile">
            <details
              className="filters-drop"
              open={mobileOpen}
              onToggle={(e) => setMobileOpen(e.currentTarget.open)}
            >
              <summary className="filters-drop__summary">
                Filters{activeCount ? ` (${activeCount})` : ''}
              </summary>

              <div className="filters-drop__content">
                <FiltersPanel
                  types={types}
                  genderOptions={genderOptions}
                  sizeOptions={sizeOptions}
                  ageOptions={ageOptions}
                  selectedType={selectedType}
                  gender={gender}
                  size={size}
                  age={age}
                  city={city}
                  state={state}
                  q={q}
                  loading={loading}
                  onTypeChange={onTypeChange}
                  onGenderChange={onGenderChange}
                  onSizeChange={onSizeChange}
                  onAgeChange={onAgeChange}
                  onCityChange={onCityChange}
                  onStateChange={onStateChange}
                  onQueryChange={onQueryChange}
                  clearFilters={clearFilters}
                  onClose={() => setMobileOpen(false)}
                />
              </div>
            </details>
          </div>

          {/* Pager */}
          <div className="main__pager">
            <button className="main__btn" disabled={!canPrev || loading}
                    onClick={() => loadPets({ page: pagination.current_page - 1 })}>
              Prev
            </button>
            <span className="main__page">
              Page {pagination.current_page || 1} / {pagination.total_pages || 1}
            </span>
            <button className="main__btn" disabled={!canNext || loading}
                    onClick={() => loadPets({ page: pagination.current_page + 1 })}>
              Next
            </button>
          </div>

          {loading && <Preloader />}
          {error && <p className="main__message main__message--error">{error}</p>}
          {!loading && animals.length === 0 && !error && (
            <p className="main__message">No pets found. Try adjusting your filters.</p>
          )}

          {/* Available pets */}
          <div className="main__grid">
            {animals.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                isSaved={isPetSaved(pet.id)}
                onToggleSave={() => handleToggle(pet)}
              />
            ))}
          </div>

          {/* Saved summary (top 3) */}
          <div className="main__saved">
            <div className="main__saved-head">
              <h2 className="main__subtitle">Saved Pets</h2>
              <div className="main__saved-actions">
                <button className="main__btn" onClick={loadSavedPets}>Refresh</button>
                <Link to="/profile" className="main__btn">View all</Link>
              </div>
            </div>

            {savedPets.length === 0 ? (
              <p className="main__message">You haven’t saved any pets yet.</p>
            ) : (
              <div className="main__grid main__grid--saved">
                {savedPets.slice(0, 3).map((pet) => (
                  <PetCard
                    key={`saved-${pet.id}`}
                    pet={pet}
                    isSaved
                    onToggleSave={() => handleToggle(pet)}
                    variant="compact"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

Main.propTypes = {
  types: PropTypes.array.isRequired,
  animals: PropTypes.array.isRequired,
  savedPets: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  genderOptions: PropTypes.array.isRequired,
  sizeOptions: PropTypes.array.isRequired,
  ageOptions: PropTypes.array.isRequired,
  selectedType: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  age: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  q: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  canPrev: PropTypes.bool.isRequired,
  canNext: PropTypes.bool.isRequired,
  loadPets: PropTypes.func.isRequired,
  loadSavedPets: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  isPetSaved: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  onGenderChange: PropTypes.func.isRequired,
  onSizeChange: PropTypes.func.isRequired,
  onAgeChange: PropTypes.func.isRequired,
  onCityChange: PropTypes.func.isRequired,
  onStateChange: PropTypes.func.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  onAuthRequired: PropTypes.func,
};
