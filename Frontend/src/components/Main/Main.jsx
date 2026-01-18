import PetScrollerWidget from '../PetScrollerWidget/PetScrollerWidget.jsx';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './Main.css';

export default function Main({ savedPets = [] }) {
  const preview = Array.isArray(savedPets) ? savedPets.slice(0, 3) : [];

  return (
    <main className="main">
      <section className="main__widget">
        <PetScrollerWidget />
      </section>

      <section className="main__saved">
        <div className="main__saved-header">
          <h2 className="main__saved-title">Saved Pets</h2>
          <Link className="main__saved-link" to="/saved">
            View all
          </Link>
        </div>

        {preview.length === 0 ? (
          <p className="main__saved-empty">
            You haven’t saved any pets yet. Browse the list above and save a pet
            using the Saved Pets page.
          </p>
        ) : (
          <ul className="main__saved-list">
            {preview.map((pet) => (
              <li key={pet.url} className="main__saved-item">
                <a
                  href={pet.url}
                  target="_blank"
                  rel="noreferrer"
                  className="main__saved-anchor"
                >
                  {pet.name || pet.url}
                </a>
                {pet.note ? (
                  <p className="main__saved-note">{pet.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

Main.propTypes = {
  savedPets: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      name: PropTypes.string,
      note: PropTypes.string,
    })
  ),
};