import React, { useEffect } from 'react';
import usePetSearch from '../../hooks/usePetSearch';
import PetCard from '../PetCard/PetCard';
import Preloader from '../Preloader/Preloader';
import './Main.css';

function Main() {
  const {
    // data
    types, animals, pagination, genderOptions, sizeOptions, ageOptions,
    // selections
    selectedType, gender, size, age,
    // ui
    loading, error, canPrev, canNext,
    // actions
    loadPets, onTypeChange, onGenderChange, onSizeChange, onAgeChange, clearFilters,
  } = usePetSearch({ sort: 'recent', limit: 20 });

  // initial load
  useEffect(() => { loadPets(); }, [loadPets]);

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

export default Main;
