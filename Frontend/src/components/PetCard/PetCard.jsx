// PetCard.jsx
import React, { useState, memo } from "react";
import PropTypes from "prop-types";
import PLACEHOLDER from "../../assets/images/placeholder.svg";
import "./PetCard.css";

function PetCard({
  pet,
  isSaved = false,
  canSave = false,
  onToggleSave = () => {},
  showRemove = false,
  onRemove = () => {},
  onAuthRequired = () => {},
}) {
  if (!pet) return null;

  const { id, name = "Unnamed", age, url } = pet;

  // Prefer Petfinder photos; fallback to legacy imageUrl; then placeholder
  const initialPhoto =
    pet.photos?.[0]?.medium || pet.imageUrl || PLACEHOLDER;

  const breed =
    pet.breeds?.primary ??
    (typeof pet.breeds === "string" ? pet.breeds : "Unknown breed");

  const [src, setSrc] = useState(initialPhoto);

  const liked = !!isSaved;

  const handleLikeClick = () => {
    if (!canSave) {
      onAuthRequired?.();
      return;
    }
    onToggleSave(pet);
  };

  return (
    <article className="pet__card" data-id={id}>
      <a
        className="pet__card-img-wrap"
        href={url || "#"}
        target={url ? "_blank" : undefined}
        rel={url ? "noreferrer" : undefined}
      >
        <img
          className="pet__card-img"
          src={src}
          alt={name}
          onError={() => setSrc(PLACEHOLDER)}
        />
      </a>

      <div className="pet__card-info">
        <h3 className="pet__card-name">{name}</h3>
        <p className="pet__card-line">{breed}</p>
        <p className="pet__card-line">{age || "Age unknown"}</p>
      </div>

      <div className="pet__card-actions">
        <button
          type="button"
          className={`card__like-button ${liked ? "card__like-button_active" : ""}`}
          onClick={handleLikeClick}
          aria-pressed={liked}
          aria-label={liked ? "Remove from saved" : "Save pet"}
          title={liked ? "Saved" : "Save"}
        />
      </div>
    </article>
  );
}

PetCard.propTypes = {
  pet: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    breeds: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    age: PropTypes.string,
    url: PropTypes.string,
    photos: PropTypes.array,
    contact: PropTypes.object,
  }).isRequired,
  isSaved: PropTypes.bool,
  canSave: PropTypes.bool,
  onToggleSave: PropTypes.func,
  showRemove: PropTypes.bool,
  onRemove: PropTypes.func,
  onAuthRequired: PropTypes.func,
};

export default memo(PetCard);