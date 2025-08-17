import PropTypes from 'prop-types';
import { useEffect } from 'react';
import PetCard from '../PetCard/PetCard';
import { removePet } from '../../../utils/PetFinderApi';
import './Profile.css';

export default function Profile({
  savedPets = [],
  loadSavedPets = () => {},
  toggleLike = () => {},
  onAuthRequired = () => {},
}) {
  useEffect(() => { loadSavedPets(); }, [loadSavedPets]);

  const onRemove = async (pet) => {
    try {
      await removePet(pet.id);
      await loadSavedPets();
    } catch (e) { /* no-op; optionally show toast */ }
  };

  return (
    <section className="profile">
      <h1 className="profile__title">Your Saved Pets</h1>

      {savedPets.length === 0 ? (
        <p className="profile__message">You haven’t saved any pets yet.</p>
      ) : (
        <div className="profile__grid">
          {savedPets.map((pet) => (
            <PetCard
              key={`profile-${pet.id}`}
              pet={pet}
              isSaved
              onToggleSave={() => toggleLike(pet)}
              showRemove
              onRemove={() => onRemove(pet)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

Profile.propTypes = {
  savedPets: PropTypes.array.isRequired,
  loadSavedPets: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  onAuthRequired: PropTypes.func.isRequired,
};
