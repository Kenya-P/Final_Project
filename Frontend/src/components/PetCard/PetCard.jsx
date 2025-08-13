import PropTypes from 'prop-types';
import './PetCard.css';

function PetCard({ pet }) {
  const { name, breeds, age, photos, url } = pet;
  const image = photos?.[0]?.medium || 'https://via.placeholder.com/150';

  return (
    <a
      className="pet-card"
      href={url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${name} on Petfinder`}
    >
      <img className="pet-card__image" src={image} alt={name} />
      <h3 className="pet-card__name">{name}</h3>
      <p className="pet-card__breed">{breeds?.primary}</p>
      <p className="pet-card__age">{age}</p>
    </a>
  );
}

PetCard.propTypes = {
  pet: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    breeds: PropTypes.shape({ primary: PropTypes.string }),
    age: PropTypes.string,
    photos: PropTypes.arrayOf(
      PropTypes.shape({
        small: PropTypes.string,
        medium: PropTypes.string,
        large: PropTypes.string,
        full: PropTypes.string,
      })
    ),
    url: PropTypes.string,
  }).isRequired,
};


export default PetCard;

