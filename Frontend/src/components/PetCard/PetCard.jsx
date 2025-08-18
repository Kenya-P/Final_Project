import { useContext } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext.jsx';
import PropTypes from 'prop-types';
import './PetCard.css';

export default function PetCard({
  pet,
  isSaved = false,
  onToggleSave = () => {},
  variant = 'default',
  showRemove = false,
  onRemove = () => {},
  onAuthRequired = () => {},
}) {
  const { name, breeds, age, photos, url } = pet;
  const img = photos?.[0]?.medium || photos?.[0]?.small || 'https://via.placeholder.com/300x200?text=Pet';
  const breed = breeds?.primary || 'Unknown breed';
  const currentUser = useContext(CurrentUserContext);

  const isLiked = isSaved || (currentUser && currentUser.savedPets?.some((p) => p.id === pet.id));


  const handleLikeClick = () => {
    if (!currentUser || !currentUser.id) {
      return;
    }
    onToggleSave(pet);
  };

  return (
    <article className={`pet-card pet-card--${variant}`}>
      <a className="pet-card__image-link" href={url || '#'} target="_blank" rel="noopener noreferrer">
        <img className="pet-card__image" src={img} alt={name} />
      </a>

      <div className="pet-card__meta">
        <h3 className="pet-card__name">{name}</h3>
        <p className="pet-card__line">{breed}</p>
        <p className="pet-card__line">{age || 'Age unknown'}</p>
      </div>

      <div className="pet-card__actions">
        {currentUser && currentUser._id && (
          <button
            type="button"
            className={`card__like-button ${isLiked ? 'card__like-button_active' : ''}`}
            onClick={handleLikeClick}
          ></button>
        )}

        {showRemove && (
          <button className="pet-card__remove" onClick={onRemove} aria-label="Remove from saved">
            Remove
          </button>
        )}
      </div>
    </article>
  );
}

PetCard.propTypes = {
  pet: PropTypes.object.isRequired,
  isSaved: PropTypes.bool,
  onToggleSave: PropTypes.func,
  onAuthRequired: PropTypes.func,
};

