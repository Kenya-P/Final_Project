import { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CurrentUserContext from '../../contexts/CurrentUserContext.jsx';

import logoUrl from '../../assets/images/logo.svg';
import './Header.css';

export default function Header({
  onOpenLogin,
  onLogout,
  onOpenRegister = () => {},
}) {
  const user = useContext(CurrentUserContext);
  const isLoggedIn = Boolean(user?.id);

  // Optional: guard Saved Pets link when logged out
  const handleSavedClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      onOpenLogin();
    }
  };

  return (
    <header className="header">
      <Link className="header__brand" to="/" aria-label="Perfect Pet Finder home">
        <img className="header__logo" src={logoUrl} width="22" height="22" alt="" aria-hidden="true" />
        <span className="header__name">Perfect Pet Finder</span>
      </Link>

      {/* Primary nav */}
      <nav className="header__nav" aria-label="Primary">
        <NavLink
          to="/"
          className={({ isActive }) => `header__link${isActive ? ' header__link--active' : ''}`}
          end
        >
          Home
        </NavLink>

        <NavLink
          to="/profile"
          onClick={handleSavedClick}
          className={({ isActive }) => `header__link${isActive ? ' header__link--active' : ''}`}
        >
          Saved Pets
        </NavLink>
      </nav>

      {/* Auth controls */}
      <div className="header__auth">
        {isLoggedIn ? (
          <>
          <div className="header__profile">
            <span className="header__avatar" aria-hidden="true">{initial}</span>
            <span className="header__who">{user.name || 'User'}</span>
            <button className="header__btn header__btn--outline" onClick={onLogout}>Sign Out</button>
          </div>
            <span className="header__user">Hi, {user.name || 'User'}</span>
            <button className="header__btn" onClick={onLogout} aria-label="Sign out">
              Sign Out
            </button>
          </>
          
        ) : (
          <>
            <button className="header__btn" onClick={onOpenLogin} aria-label="Sign in">
              Sign In
            </button>
            <button
              className="header__btn header__btn--primary"
              onClick={onOpenRegister}
              aria-label="Create an account"
            >
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}

Header.propTypes = {
  onOpenLogin: PropTypes.func.isRequired,
  onOpenRegister: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};
