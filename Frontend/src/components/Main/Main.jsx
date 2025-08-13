import PetCard from '../PetCard/PetCard';
import Preloader from '../Preloader/Preloader';
import PropTypes from 'prop-types';
import './Main.css';

export default function Main({
  // data
  types, animals, pagination, genderOptions, sizeOptions, ageOptions,
  // selections
  selectedType, gender, size, age,
  // ui
  loading, error, canPrev, canNext,
  // actions
  loadPets, onTypeChange, onGenderChange, onSizeChange, onAgeChange, clearFilters,
}) {
  return (
    <section className="main">
      <h2 className="main__title">Find your perfect pet</h2>

      {/* Controls */}
      <div className="main__controls">
        <div className="main__control">
          <label className="main__label" htmlFor="type">Type</label>
          <select
            id="type"
            className="main__select"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <option value="">All</option>
            {types.map((t) => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="main__control">
          <label className="main__label" htmlFor="gender">Gender</label>
          <select
            id="gender"
            className="main__select"
            value={gender}
            onChange={(e) => onGenderChange(e.target.value)}
          >
            <option value="">Any</option>
            {genderOptions.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="main__control">
          <label className="main__label" htmlFor="size">Size</label>
          <select
            id="size"
            className="main__select"
            value={size}
            onChange={(e) => onSizeChange(e.target.value)}
          >
            <option value="">Any</option>
            {sizeOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="main__control">
          <label className="main__label" htmlFor="age">Age</label>
          <select
            id="age"
            className="main__select"
            value={age}
            onChange={(e) => onAgeChange(e.target.value)}
          >
            <option value="">Any</option>
            {ageOptions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <button
          className="main__btn main__btn--ghost"
          onClick={clearFilters}
          disabled={loading || (!selectedType && !gender && !size && !age)}
        >
          Clear filters
        </button>
      </div>

      {/* Pagination */}
      <div className="main__pager">
        <button
          className="main__btn"
          disabled={!canPrev || loading}
          onClick={() => loadPets({ page: pagination.current_page - 1 })}
        >
          Prev
        </button>
        <span className="main__page">
          Page {pagination.current_page || 1} / {pagination.total_pages || 1}
        </span>
        <button
          className="main__btn"
          disabled={!canNext || loading}
          onClick={() => loadPets({ page: pagination.current_page + 1 })}
        >
          Next
        </button>
      </div>

      {loading && <Preloader />}

      {error && <p className="main__message main__message--error">{error}</p>}

      {!loading && animals.length === 0 && !error && (
        <p className="main__message">No pets found. Try adjusting your filters.</p>
      )}

      <div className="main__grid">
        {animals.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </section>
  );
}

Main.propTypes = {
  // data
  types: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })).isRequired,
  animals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      breeds: PropTypes.shape({ primary: PropTypes.string }),
      age: PropTypes.string,
      photos: PropTypes.arrayOf(
        PropTypes.shape({
          small: PropTypes.string,
          medium: PropTypes.string,
          large: PropTypes.string,
          full: PropTypes.string,
        })
      ),
      url: PropTypes.string,
    })
  ).isRequired,
  pagination: PropTypes.shape({
    count_per_page: PropTypes.number,
    total_count: PropTypes.number,
    current_page: PropTypes.number,
    total_pages: PropTypes.number,
  }).isRequired,

  // options
  genderOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  sizeOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  ageOptions: PropTypes.arrayOf(PropTypes.string).isRequired,

  // selections
  selectedType: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  age: PropTypes.string.isRequired,

  // ui
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  canPrev: PropTypes.bool.isRequired,
  canNext: PropTypes.bool.isRequired,

  // actions
  loadPets: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  onGenderChange: PropTypes.func.isRequired,
  onSizeChange: PropTypes.func.isRequired,
  onAgeChange: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
};

Main.defaultProps = {
  error: '',
};

