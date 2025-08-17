import PropTypes from 'prop-types';
import likeBtnUrl from '../../assets/images/card-like.svg';
import './PetCard.css';

export default function PetCard({
  pet,
  isSaved = false,
  onToggleSave = () => {},
  variant = 'default',
  showRemove = false,
  onRemove = () => {},
}) {
  const { name, breeds, age, photos, url } = pet;
  const img = photos?.[0]?.medium || photos?.[0]?.small || 'https://via.placeholder.com/300x200?text=Pet';
  const breed = breeds?.primary || 'Unknown breed';

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
        <button
          className={`pet-card__save ${isSaved ? 'pet-card__save--on' : ''}`}
          onClick={onToggleSave}
          aria-pressed={isSaved}
          aria-label={isSaved ? 'Unsave pet' : 'Save pet'}
          title={isSaved ? 'Unsave' : 'Save'}
        >
          <img src={ likeBtnUrl } alt="like-btn" className="pet-card_like" />
        </button>

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
  pet: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
    age: PropTypes.string,
    breeds: PropTypes.shape({ primary: PropTypes.string }),
    photos: PropTypes.arrayOf(PropTypes.shape({
      small: PropTypes.string, medium: PropTypes.string, large: PropTypes.string, full: PropTypes.string
    })),
  }).isRequired,
  isSaved: PropTypes.bool,
  onToggleSave: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'compact']),
  showRemove: PropTypes.bool,
  onRemove: PropTypes.func,
};
