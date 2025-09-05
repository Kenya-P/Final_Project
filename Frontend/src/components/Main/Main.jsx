import './Main.css';
import React from 'react';
import PetCard from '../PetCard/PetCard.jsx';

export default function Main(props) {
  const {
    types, animals, savedPets, pagination, genderOptions, sizeOptions, ageOptions,
    selectedType, gender, size, age, city, state, q,
    loading, error, canPrev, canNext,
    loadPets, loadSavedPets, toggleLike, isPetSaved,
    onTypeChange, onGenderChange, onSizeChange, onAgeChange,
    onCityChange, onStateChange, onQueryChange, clearFilters,
    onAuthRequired = () => {}, isAuthenticated = false,
  } = props;

  const handleLike = (pet) => {
    if (!isAuthenticated) return onAuthRequired();
    toggleLike?.(pet);
  };

  const handlePrev = () => { if (canPrev) loadPets?.({ direction:'prev' }); };
  const handleNext = () => { if (canNext) loadPets?.({ direction:'next' }); };

  return (
    <main className="content">
      <section className="filters">
        <div className="filters__row">
          <select value={selectedType || ''} onChange={(e)=>onTypeChange?.(e.target.value)}>
            <option value="">All Types</option>
            {(types||[]).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={gender || ''} onChange={(e)=>onGenderChange?.(e.target.value)}>
            <option value="">Any Gender</option>
            {(genderOptions||[]).map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={size || ''} onChange={(e)=>onSizeChange?.(e.target.value)}>
            <option value="">Any Size</option>
            {(sizeOptions||[]).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={age || ''} onChange={(e)=>onAgeChange?.(e.target.value)}>
            <option value="">Any Age</option>
            {(ageOptions||[]).map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="filters__row">
          <input type="text" placeholder="Search by name or breed" value={q||''} onChange={(e)=>onQueryChange?.(e.target.value)}/>
          <input type="text" placeholder="City" value={city||''} onChange={(e)=>onCityChange?.(e.target.value)}/>
          <input type="text" placeholder="State" value={state||''} onChange={(e)=>onStateChange?.(e.target.value)}/>
          <button type="button" onClick={()=>clearFilters?.()}>Clear</button>
        </div>
      </section>

      <section className="results">
        {loading && <p>Loading pets…</p>}
        {!loading && error && <p role="alert">Error: {String(error)}</p>}
        {!loading && !error && (!animals || animals.length===0) && <p>No pets found. Try adjusting filters.</p>}

        <ul className="pet-grid">
          {(animals||[]).map(pet => (
            <li key={pet.id}>
              <PetCard pet={pet} isSaved={isPetSaved?.(pet)} onToggleSave={()=>handleLike(pet)} />
            </li>
          ))}
        </ul>

        <div className="pagination">
          <button type="button" onClick={handlePrev} disabled={!canPrev || loading}>Prev</button>
          <span className="pagination__status">{pagination?.page ?? 1} / {pagination?.totalPages ?? 1}</span>
          <button type="button" onClick={handleNext} disabled={!canNext || loading}>Next</button>
        </div>
      </section>
    </main>
  );
}
