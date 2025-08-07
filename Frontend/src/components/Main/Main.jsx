import React, { useEffect, useState } from 'react';
import { getPets } from '../utils/PetFinderApi';
import PetCard from '../PetCard/PetCard';
import Preloader from '../Preloader/Preloader';
import './Main.css';

function Main() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPets()
      .then((data) => {
        setPets(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch pets.');
        setLoading(false);
        console.error(err);
      });
  }, []);

  return (
    <section className="main">
      <h2 className="main__title">Find your perfect pet</h2>

      {loading && <Preloader />}

      {error && <p className="main__message main__message--error">{error}</p>}

      {!loading && pets.length === 0 && (
        <p className="main__message">No pets found. Try adjusting your filters.</p>
      )}

      <div className="main__grid">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </section>
  );
}

export default Main;
