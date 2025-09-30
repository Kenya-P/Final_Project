import PropTypes from 'prop-types';
import { useId, useEffect, useState } from 'react';
import './FiltersPanel.css';
import {
  GENDER_OPTIONS,
  SIZE_OPTIONS,
  AGE_OPTIONS,
} from '../../config/constants.js';

export default function FiltersPanel({
  // data
  typeNames = [],
  genderOptions = GENDER_OPTIONS,
  sizeOptions = SIZE_OPTIONS,
  ageOptions = AGE_OPTIONS,
  // selections from parent
  selectedType = '',
  gender = '',
  size = '',
  age = '',
  city = '',
  state = '',
  q = '',
  // ui
  loading = false,
  // actions (parent updaters)
  onTypeChange = () => {},
  onGenderChange = () => {},
  onSizeChange = () => {},
  onAgeChange = () => {},
  onCityChange = () => {},
  onStateChange = () => {},
  onQueryChange = () => {},
  clearFilters = () => {},
  onClose,
}) {
  const uid = useId();
  const makeId = (name) => `${uid}-${name}`;

  // Local draft so typing never triggers parent fetch
  const [draft, setDraft] = useState(() => ({
    q,
    selectedType,
    gender,
    size,
    age,
    city,
    state,
  }));

  // Sync draft whenever parent props change (e.g., after Clear from outside)
  useEffect(() => {
    setDraft({ q, selectedType, gender, size, age, city, state });
  }, [q, selectedType, gender, size, age, city, state]);

  const applyAndClose = () => {
    onQueryChange(draft.q);
    onTypeChange(draft.selectedType);
    onGenderChange(draft.gender);
    onSizeChange(draft.size);
    onAgeChange(draft.age);
    onCityChange(draft.city);
    onStateChange(draft.state);
    onClose?.();
  };

  const handleClear = () => {
    clearFilters?.();
    setDraft({
      q: '',
      selectedType: '',
      gender: '',
      size: '',
      age: '',
      city: '',
      state: '',
    });
  };

  const ids = {
    q: makeId('q'),
    type: makeId('type'),
    gender: makeId('gender'),
    size: makeId('size'),
    age: makeId('age'),
    city: makeId('city'),
    state: makeId('state'),
  };

  const disableClear = Object.values(draft).every((v) =>
    typeof v === 'string' ? v.trim() === '' : !v
  );

  return (
    <form
      className="filters"
      onSubmit={(e) => {
        e.preventDefault();
        applyAndClose();
      }}
      aria-busy={loading}
    >
      <div className="filters__group">
        <label className="filters__label" htmlFor={ids.q}>
          Search
        </label>
        <input
          id={ids.q}
          className="filters__input"
          type="search"
          value={draft.q}
          onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
          placeholder="Name, breed, type..."
          autoFocus
          /* keep enabled during loading to preserve focus */
        />
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor={ids.type}>
          Type
        </label>
        <select
          id={ids.type}
          className="filters__input"
          value={draft.selectedType}
          onChange={(e) =>
            setDraft((d) => ({ ...d, selectedType: e.target.value }))
          }
        >
          <option value="">All</option>
          {typeNames.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor={ids.gender}>
          Gender
        </label>
        <select
          id={ids.gender}
          className="filters__input"
          value={draft.gender}
          onChange={(e) => setDraft((d) => ({ ...d, gender: e.target.value }))}
        >
          <option value="">Any</option>
          {genderOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor={ids.size}>
          Size
        </label>
        <select
          id={ids.size}
          className="filters__input"
          value={draft.size}
          onChange={(e) => setDraft((d) => ({ ...d, size: e.target.value }))}
        >
          <option value="">Any</option>
          {sizeOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor={ids.age}>
          Age
        </label>
        <select
          id={ids.age}
          className="filters__input"
          value={draft.age}
          onChange={(e) => setDraft((d) => ({ ...d, age: e.target.value }))}
        >
          <option value="">Any</option>
          {ageOptions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor={ids.city}>
          City
        </label>
        <input
          id={ids.city}
          className="filters__input"
          type="text"
          value={draft.city}
          onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
          placeholder="e.g., Jersey City"
        />
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor={ids.state}>
          State
        </label>
        <input
          id={ids.state}
          className="filters__input"
          type="text"
          value={draft.state}
          onChange={(e) => setDraft((d) => ({ ...d, state: e.target.value }))}
          placeholder="e.g., NJ"
        />
      </div>

      <div className="filters__actions">
        <button
          type="button"
          className="filters__btn filters__btn--ghost"
          onClick={handleClear}
          disabled={disableClear}
        >
          Clear filters
        </button>
        <button type="submit" className="filters__btn">
          Done
        </button>
      </div>
    </form>
  );
}

FiltersPanel.propTypes = {
  typeNames: PropTypes.arrayOf(PropTypes.string),
  genderOptions: PropTypes.arrayOf(PropTypes.string),
  sizeOptions: PropTypes.arrayOf(PropTypes.string),
  ageOptions: PropTypes.arrayOf(PropTypes.string),
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
