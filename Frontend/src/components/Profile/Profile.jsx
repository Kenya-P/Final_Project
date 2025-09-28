import PropTypes from 'prop-types';
import PetCard from '../PetCard/PetCard.jsx';
import './Profile.css';

export default function Profile({
  savedPets = [],
  toggleLike = () => {},
  title = 'Your Saved Pets',
  isAuthenticated = true,
  onAuthRequired = () => {},
}) {
  const has = Array.isArray(savedPets) && savedPets.length > 0;

  return (
    <main className="profile">
      <h2 className="profile__title">{title}</h2>

      {!has && <p>No saved pets yet.</p>}

      {has && (
        <ul className="profile__grid">
          {savedPets.map((pet) => (
            <PetCard
              key={pet.id ?? pet._id}
              pet={pet}
              isSaved={true}
              canSave={isAuthenticated}
              onToggleSave={() => toggleLike(pet)}
              onRemove={() => toggleLike(pet)}
              onAuthRequired={onAuthRequired}
            />
          ))}
        </ul>
      )}
    </main>
  );
}

Profile.propTypes = {
  savedPets: PropTypes.arrayOf(PropTypes.object),
  toggleLike: PropTypes.func,
  title: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  onAuthRequired: PropTypes.func,
};
