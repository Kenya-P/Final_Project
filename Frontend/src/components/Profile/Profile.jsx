import PropTypes from "prop-types";
import "./Profile.css";

const noop = () => {};

export default function Profile({ savedPets, loadSavedPets, toggleLike }) {

  return (
    <section className="profile">
      <h2>Your Saved Pets</h2>
      {!savedPets?.length ? (
        <p>No saved pets yet.</p>
      ) : (
        <ul className="profile__grid">
          {savedPets.map((p) => (
            <li key={p.id} className="profile__card">
              <img src={p.primary_photo_cropped?.small || p.imageUrl} alt={p.name} />
              <div className="profile__meta">
                <h3>{p.name}</h3>
                <button type="button" onClick={() => toggleLike(p)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

Profile.propTypes = {
  savedPets: PropTypes.arrayOf(PropTypes.object),
  loadSavedPets: PropTypes.func,
  toggleLike: PropTypes.func,
};

Profile.defaultProps = {
  savedPets: [],
  loadSavedPets: noop,
  toggleLike: noop,
};