import PropTypes from 'prop-types';
import PetCard from '../PetCard/PetCard';
import Preloader from '../Preloader/Preloader';
import { Link } from 'react-router-dom';
import './Main.css';

export default function Main({
  // data (provide safe fallbacks)
  types = [],
  animals = [],
  savedPets = [],
  pagination = { count_per_page: 20, total_count: 0, current_page: 1, total_pages: 1 },
  genderOptions = ['Male', 'Female', 'Unknown'],
  sizeOptions = ['Small', 'Medium', 'Large', 'X-Large'],
  ageOptions = ['Baby', 'Young', 'Adult', 'Senior'],

  // selections
  selectedType = '',
  gender = '',
  size = '',
  age = '',
  city = '',
  state = '',
  q = '',

  // ui
  loading = false,
  error = '',
  canPrev = false,
  canNext = false,

  // actions (no-ops by default)
  loadPets = () => {},
  loadSavedPets = () => {},
  toggleLike = () => {},
  isPetSaved = () => false,
  onTypeChange = () => {},
  onGenderChange = () => {},
  onSizeChange = () => {},
  onAgeChange = () => {},
  onCityChange = () => {},
  onStateChange = () => {},
  onQueryChange = () => {},
  clearFilters = () => {},
  onAuthRequired = () => {},
}) {
  const savedIds = new Set(savedPets.map((p) => String(p.id)));

  return (
    <section className="main">
      <h2 className="main__title">Find your perfect pet companion.</h2>

      {/* Filters */}
      <div className="main__controls">
        <div className="main__control">
          <label className="main__label" htmlFor="q">Search</label>
          <input
            id="q"
            className="main__select"
            type="search"
            value={q}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Name, breed, type…"
          />
        </div>

        <div className="main__control">
          <label className="main__label" htmlFor="type">Type</label>
          <select id="type" className="main__select"
                  value={selectedType} onChange={(e) => onTypeChange(e.target.value)}>
            <option value="">All</option>
            {types.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
        </div>

        <div className="main__control">
          <label className="main__label" htmlFor="gender">Gender</label>
          <select id="gender" className="main__select"
                  value={gender} onChange={(e) => onGenderChange(e.target.value)}>
            <option value="">Any</option>
            {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div className="main__control">
          <label className="main__label" htmlFor="size">Size</label>
          <select id="size" className="main__select"
                  value={size} onChange={(e) => onSizeChange(e.target.value)}>
            <option value="">Any</option>
            {sizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="main__control">
          <label className="main__label" htmlFor="age">Age</label>
          <select id="age" className="main__select"
                  value={age} onChange={(e) => onAgeChange(e.target.value)}>
            <option value="">Any</option>
            {ageOptions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="main__control">
          <label className="main__label" htmlFor="city">City</label>
          <input id="city" className="main__select" type="text"
                 value={city} onChange={(e) => onCityChange(e.target.value)}
                 placeholder="e.g., Jersey City" />
        </div>

        <div className="main__control">
          <label className="main__label" htmlFor="state">State</label>
          <input id="state" className="main__select" type="text"
                 value={state} onChange={(e) => onStateChange(e.target.value)}
                 placeholder="e.g., NJ" />
        </div>

        <button
          className="main__btn main__btn--ghost"
          onClick={clearFilters}
          disabled={loading || (!selectedType && !gender && !size && !age && !city && !state && !q)}
        >
          Clear filters
        </button>
      </div>

      {/* Pagination */}
      <div className="main__pager">
        <button className="main__btn" disabled={!canPrev || loading}
                onClick={() => loadPets({ page: pagination.current_page - 1 })}>
          Prev
        </button>
        <span className="main__page">Page {pagination.current_page || 1} / {pagination.total_pages || 1}</span>
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
            isSaved={savedIds.has(String(pet.id))}
            onToggleSave={() => toggleLike(pet)}
          />
        ))}
      </div>

      {/* Short list of saved pets */}
      <div className="main__saved">
        <div className="main__saved-head">
          <h3 className="main__subtitle">Saved Pets</h3>
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
                onToggleSave={() => toggleLike(pet)}
                variant="compact"
              />
            ))}
          </div>
        )}
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
};

