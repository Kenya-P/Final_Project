import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './SavedPets.css';

function normalizeUrl(input) {
  const raw = String(input || '').trim();
  if (!raw) return '';
  try {
    // Ensure a valid absolute URL (users sometimes paste without protocol)
    const withProto = raw.startsWith('http://') || raw.startsWith('https://')
      ? raw
      : `https://${raw}`;
    return new URL(withProto).toString();
  } catch {
    return '';
  }
}

export default function SavedPets({
  savedPets = [],
  onSave = () => {},
  onRemove = () => {},
  onClearAll = () => {},
}) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const sorted = useMemo(() => {
    const list = Array.isArray(savedPets) ? [...savedPets] : [];
    return list.sort((a, b) => {
      const at = a?.addedAt ? Date.parse(a.addedAt) : 0;
      const bt = b?.addedAt ? Date.parse(b.addedAt) : 0;
      return bt - at;
    });
  }, [savedPets]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError('Please paste a valid Petfinder link.');
      return;
    }

    onSave({
      url: normalized,
      name,
      notes,
      addedAt: new Date().toISOString(),
    });

    setUrl('');
    setName('');
    setNotes('');
  };

  return (
    <main className="saved">
      <div className="saved__header">
        <div>
          <h2 className="saved__title">Saved Pets</h2>
          <p className="saved__subtitle">
            Found a pet you love in the Petfinder widget? Copy the Petfinder URL and save it here.
          </p>
        </div>

        {sorted.length > 0 && (
          <button
            type="button"
            className="saved__clear"
            onClick={onClearAll}
            aria-label="Clear all saved pets"
          >
            Clear all
          </button>
        )}
      </div>

      <section className="saved__card">
        <h3 className="saved__sectionTitle">Add a pet</h3>
        <form className="saved__form" onSubmit={handleSubmit}>
          <label className="saved__label">
            Petfinder URL
            <input
              className="saved__input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.petfinder.com/..."
              inputMode="url"
              autoComplete="off"
              required
            />
          </label>

          <div className="saved__row">
            <label className="saved__label">
              Name (optional)
              <input
                className="saved__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Luna"
              />
            </label>

            <label className="saved__label">
              Notes (optional)
              <input
                className="saved__input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Great with kids"
              />
            </label>
          </div>

          {error && <p className="saved__error">{error}</p>}

          <button type="submit" className="saved__submit">
            Save
          </button>
        </form>
      </section>

      <section className="saved__list">
        {sorted.length === 0 ? (
          <div className="saved__empty">
            <p className="saved__emptyTitle">No saved pets yet</p>
            <p className="saved__emptyText">
              Browse adoptable pets on the home page, open a listing on Petfinder, then paste the link here.
            </p>
          </div>
        ) : (
          sorted.map((pet) => (
            <article key={pet.url} className="saved__item">
              <div className="saved__itemMain">
                <a
                  className="saved__itemLink"
                  href={pet.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {pet.name || 'View on Petfinder'}
                </a>
                {pet.notes && <p className="saved__itemNotes">{pet.notes}</p>}
                {pet.addedAt && (
                  <p className="saved__itemMeta">
                    Saved {new Date(pet.addedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <button
                type="button"
                className="saved__remove"
                onClick={() => onRemove(pet.url)}
                aria-label="Remove saved pet"
              >
                Remove
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

SavedPets.propTypes = {
  savedPets: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      name: PropTypes.string,
      notes: PropTypes.string,
      addedAt: PropTypes.string,
    })
  ),
  onSave: PropTypes.func,
  onRemove: PropTypes.func,
  onClearAll: PropTypes.func,
};
