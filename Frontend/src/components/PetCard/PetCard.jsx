import React, { useState, useContext, memo } from "react";
import PropTypes from "prop-types";
import CurrentUserContext from "../../contexts/CurrentUserContext.jsx";
import "./PetCard.css";

// put a small icon at: public/img/paw-placeholder.svg
const PLACEHOLDER = "/img/paw-placeholder.svg";

function PetCard({
  pet,
  isSaved = false,
  onToggleSave = () => {},
  showRemove = false,
  onRemove = () => {},
  onAuthRequired = () => {},
}) {
  if (!pet) return null;

  const { id, name = "Unnamed", imageUrl, breeds, age, url } = pet;

  const currentUser = useContext(CurrentUserContext);
  const [src, setSrc] = useState(imageUrl || PLACEHOLDER);

  // consider both prop and context (if you store saved pets there)
  const liked =
    !!isSaved ||
    !!currentUser?.savedPets?.some((p) => String(p.id) === String(id));

  const handleLikeClick = () => {
    // if you require auth to save
    if (!currentUser || (!currentUser.id && !currentUser._id)) {
      onAuthRequired?.();
      return;
    }
    onToggleSave(pet);
  };

  return (
    <li className="pet-card" data-id={id}>
      <a
        className="pet-card__img-wrap"
        href={url || "#"}
        target={url ? "_blank" : undefined}
        rel={url ? "noreferrer" : undefined}
      >
        <img
          className="pet-card__img"
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setSrc(PLACEHOLDER)}
        />
      </a>

      <div className="pet-card__info">
        <h3 className="pet-card__name">{name}</h3>
        <p className="pet-card__line">{breeds || "Unknown breed"}</p>
        <p className="pet-card__line">{age || "Age unknown"}</p>
      </div>

      <div className="pet-card__actions">
        <button
          type="button"
          className={`card__like-button ${
            liked ? "card__like-button_active" : ""
          }`}
          onClick={handleLikeClick}
          aria-pressed={liked}
          aria-label={liked ? "Remove from saved" : "Save pet"}
          title={liked ? "Saved" : "Save"}
        />
        {showRemove && (
          <button
            className="pet-card__remove"
            onClick={onRemove}
            aria-label="Remove from saved"
          >
            Remove
          </button>
        )}
      </div>
    </li>
  );
}

PetCard.propTypes = {
  pet: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    breeds: PropTypes.string,
    age: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
  isSaved: PropTypes.bool,
  onToggleSave: PropTypes.func,
  showRemove: PropTypes.bool,
  onRemove: PropTypes.func,
  onAuthRequired: PropTypes.func,
};

export default memo(PetCard);
