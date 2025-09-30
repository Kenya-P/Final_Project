import PropTypes from 'prop-types';
import React, { useId, useEffect, useState } from 'react';
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
  onClose,
}) {
  const uid = useId();
  const makeId = (name) => `${uid}-${name}`;

  // local state for the search input
  const [qLocal, setQLocal] = React.useState(q);

  // unique ids per control
  const qId = makeId('q');
  const typeId = makeId('type');
  const genderId = makeId('gender');
  const sizeId = makeId('size');
  const ageId = makeId('age');
  const cityId = makeId('city');
  const stateId = makeId('state');

  const disableClear =
    loading ||
    [selectedType, gender, size, age, city, state, q]
      .map((v) => (typeof v === 'string' ? v.trim() : v))
      .every((v) => !v);

  // when the "q" prop changes, update the local state
  useEffect(() => {
    setQLocal(q);
  }, [q]);

  // when the local state changes, notify the parent after a delay
  useEffect(() => {
    const timeout = setTimeout(() => onQueryChange(qLocal), 500);
    return () => clearTimeout(timeout);
  }, [qLocal, onQueryChange]);

  return (
    <form
      className="filters"
      onSubmit={(e) => e.preventDefault()}
      aria-busy={loading}
    >
      <div className="filters__group">
        <label className="filters__label" htmlFor={qId}>
          Search
        </label>
        <input
          id={qId}
          className="filters__input"
          type="search"
          value={qLocal}
          onChange={(e) => setQLocal(e.target.value)}
          placeholder="Name, breed, type..."
          disabled={loading}
          autoComplete="off"
          autoFocus
        />
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor={typeId}>
          Type
        </label>
        <select
          id={typeId}
          className="filters__input"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          //disabled={loading}
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
        <label className="filters__label" htmlFor={genderId}>
          Gender
        </label>
        <select
          id={genderId}
          className="filters__input"
          value={gender}
          onChange={(e) => onGenderChange(e.target.value)}
          //disabled={loading}
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
        <label className="filters__label" htmlFor={sizeId}>
          Size
        </label>
        <select
          id={sizeId}
          className="filters__input"
          value={size}
          onChange={(e) => onSizeChange(e.target.value)}
          //disabled={loading}
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
        <label className="filters__label" htmlFor={ageId}>
          Age
        </label>
        <select
          id={ageId}
          className="filters__input"
          value={age}
          onChange={(e) => onAgeChange(e.target.value)}
          //disabled={loading}
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
        <label className="filters__label" htmlFor={cityId}>
          City
        </label>
        <input
          id={cityId}
          className="filters__input"
          type="text"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          placeholder="e.g., Jersey City"
          //disabled={loading}
        />
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor={stateId}>
          State
        </label>
        <input
          id={stateId}
          className="filters__input"
          type="text"
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
          placeholder="e.g., NJ"
          //disabled={loading}
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
