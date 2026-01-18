import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import './Header.css';

const noop = () => {};

export default function Header({
  currentUser = null,
  savedCount = 0,
  onLogin = noop,
  onRegister = noop,
  onLogout = noop,
}) {
  return (
    <header className="header">
      <img src={logo} alt="Paw Print Logo" className="header__logo" />
      <h1 to="/" className="header__brand">
        Perfect Pet Finder
      </h1>
      <nav className="header__nav">
        <NavLink to="/" className="header__link">
          Home
        </NavLink>
        <NavLink to="/saved" className="header__link">
          Saved Pets
          <span
            className="header__badge"
            aria-label={`Saved pets: ${savedCount}`}
          >
            {savedCount}
          </span>
        </NavLink>
        {!currentUser ? (
          <>
            <button type="button" className="header__btn" onClick={onLogin}>
              Log In
            </button>
            <button type="button" className="header__btn" onClick={onRegister}>
              Register
            </button>
          </>
        ) : (
          <>
            <span className="header__user">{currentUser.name}</span>
            <button type="button" className="header__btn" onClick={onLogout}>
              Log Out
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

Header.propTypes = {
  currentUser: PropTypes.object,
  savedCount: PropTypes.number,
  onLogin: PropTypes.func,
  onRegister: PropTypes.func,
  onLogout: PropTypes.func,
};