import React from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

const noop = () => {};

export default function Header({ currentUser, onLogin, onRegister, onLogout }) {
  return (
    <header className="header">
      <Link to="/" className="header__brand">Perfect Pet Finder</Link>

      <nav className="header__nav">
        <NavLink to="/" className="header__link">Home</NavLink>
        <NavLink to="/profile" className="header__link">Saved Pets</NavLink>

        {!currentUser ? (
          <>
            <button type="button" className="header__btn" onClick={onLogin}>Log In</button>
            <button type="button" className="header__btn" onClick={onRegister}>Register</button>
          </>
        ) : (
          <>
            <span className="header__user">{currentUser.name}</span>
            <button type="button" className="header__btn" onClick={onLogout}>Log Out</button>
          </>
        )}
      </nav>
    </header>
  );
}

Header.propTypes = {
  currentUser: PropTypes.object,
  onLogin: PropTypes.func,
  onRegister: PropTypes.func,
  onLogout: PropTypes.func,
};

Header.defaultProps = {
  currentUser: null,
  onLogin: noop,
  onRegister: noop,
  onLogout: noop,
};

