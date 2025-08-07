import React from 'react';
import './PetCard.css';

function PetCard({ pet }) {
  const { name, breeds, age, photos } = pet;

  // fallback image if no photos
  const image = photos[0]?.medium || 'https://via.placeholder.com/150';

  return (
    <div className="pet-card">
      <img className="pet-card__image" src={image} alt={name} />
      <h3 className="pet-card__name">{name}</h3>
      <p className="pet-card__breed">{breeds?.primary}</p>
      <p className="pet-card__age">{age}</p>
    </div>
  );
}

export default PetCard;
