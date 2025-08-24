import PropTypes from 'prop-types';
import './FiltersPanel.css';

export default function FiltersPanel({
  // data
  types = [],
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
  // actions
  onTypeChange = () => {},
  onGenderChange = () => {},
  onSizeChange = () => {},
  onAgeChange = () => {},
  onCityChange = () => {},
  onStateChange = () => {},
  onQueryChange = () => {},
  clearFilters = () => {},
  onClose, // optional (used in mobile dropdown to close)
}) {
  const disableClear =
    loading || (!selectedType && !gender && !size && !age && !city && !state && !q);

  return (
    <form className="filters">
      <div className="filters__group">
        <label className="filters__label" htmlFor="f-q">Search</label>
        <input
          id="f-q"
          className="filters__input"
          type="search"
          value={q}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Name, breed, type..."
        />
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="f-type">Type</label>
        <select
          id="f-type"
          className="filters__input"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="">All</option>
          {types.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
        </select>
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="f-gender">Gender</label>
        <select
          id="f-gender"
          className="filters__input"
          value={gender}
          onChange={(e) => onGenderChange(e.target.value)}
        >
          <option value="">Any</option>
          {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="f-size">Size</label>
        <select
          id="f-size"
          className="filters__input"
          value={size}
          onChange={(e) => onSizeChange(e.target.value)}
        >
          <option value="">Any</option>
          {sizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="f-age">Age</label>
        <select
          id="f-age"
          className="filters__input"
          value={age}
          onChange={(e) => onAgeChange(e.target.value)}
        >
          <option value="">Any</option>
          {ageOptions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="f-city">City</label>
        <input
          id="f-city"
          className="filters__input"
          type="text"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          placeholder="e.g., Jersey City"
        />
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="f-state">State</label>
        <input
          id="f-state"
          className="filters__input"
          type="text"
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
          placeholder="e.g., NJ"
        />
      </div>

      <div className="filters__actions">
        <button
          type="button"
          className="filters__btn filters__btn--ghost"
          onClick={clearFilters}
          disabled={disableClear}
        >
          Clear filters
        </button>

        {onClose && (
          <button type="button" className="filters__btn" onClick={onClose}>
            Done
          </button>
        )}
      </div>
    </form>
  );
}

FiltersPanel.propTypes = {
  types: PropTypes.array,
  genderOptions: PropTypes.array,
  sizeOptions: PropTypes.array,
  ageOptions: PropTypes.array,
  selectedType: PropTypes.string,
  gender: PropTypes.string,
  size: PropTypes.string,
  age: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  q: PropTypes.string,
  loading: PropTypes.bool,
  onTypeChange: PropTypes.func,
  onGenderChange: PropTypes.func,
  onSizeChange: PropTypes.func,
  onAgeChange: PropTypes.func,
  onCityChange: PropTypes.func,
  onStateChange: PropTypes.func,
  onQueryChange: PropTypes.func,
  clearFilters: PropTypes.func,
  onClose: PropTypes.func,
};
