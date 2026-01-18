import { useState } from 'react';
import PropTypes from 'prop-types';
import './Profile.css';

export default function Profile({
  savedPets = [],
  title = 'Your Saved Pets',
  onAddPet = () => {},
  onRemovePet = () => {},
  onClearAll = () => {},
}) {
  const has = Array.isArray(savedPets) && savedPets.length > 0;
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please paste a Petfinder URL.');
      return;
    }
    // lightweight validation: accept only petfinder.com links
    if (!/petfinder\.com\//i.test(trimmedUrl)) {
      setError('Please use a valid Petfinder link (petfinder.com).');
      return;
    }

    onAddPet({
      url: trimmedUrl,
      name: name.trim(),
      note: note.trim(),
      savedAt: new Date().toISOString(),
    });

    setUrl('');
    setName('');
    setNote('');
  };

  return (
    <main className="profile">
      <h2 className="profile__title">{title}</h2>

      <section className="profile__add">
        <h3 className="profile__subtitle">Add a pet</h3>
        <form className="profile__form" onSubmit={handleSubmit}>
          <label className="profile__label">
            Petfinder URL
            <input
              className="profile__input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.petfinder.com/..."
            />
          </label>
          <div className="profile__row">
            <label className="profile__label">
              Name (optional)
              <input
                className="profile__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Luna"
              />
            </label>
            <label className="profile__label">
              Note (optional)
              <input
                className="profile__input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Good with kids"
              />
            </label>
          </div>

          {error ? <p className="profile__error">{error}</p> : null}

          <div className="profile__actions">
            <button type="submit" className="profile__btn">
              Save
            </button>
            {has ? (
              <button
                type="button"
                className="profile__btn profile__btn--outline"
                onClick={onClearAll}
              >
                Clear all
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="profile__list">
        <h3 className="profile__subtitle">Saved</h3>
        {!has ? (
          <p className="profile__empty">No saved pets yet.</p>
        ) : (
          <ul className="profile__items">
            {savedPets.map((pet) => (
              <li key={pet.url} className="profile__item">
                <a
                  className="profile__link"
                  href={pet.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {pet.name || pet.url}
                </a>
                {pet.note ? <p className="profile__note">{pet.note}</p> : null}
                <div className="profile__item-actions">
                  <button
                    type="button"
                    className="profile__btn profile__btn--small"
                    onClick={() => onRemovePet(pet.url)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

    </main>
  );
}

Profile.propTypes = {
  savedPets: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  onAddPet: PropTypes.func,
  onRemovePet: PropTypes.func,
  onClearAll: PropTypes.func,
};
