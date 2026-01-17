import PropTypes from 'prop-types';
import './Profile.css';

export default function Profile({
  savedPets = [],
  toggleLike = () => {},
  title = 'Your Saved Pets',

}) {
  const has = Array.isArray(savedPets) && savedPets.length > 0;

  return (
    <main className="profile">
      <h2 className="profile__title">{title}</h2>

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
