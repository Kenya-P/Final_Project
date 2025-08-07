import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <h1 className="header__logo"><Link to="/">🐾 Perfect Pet Finder</Link></h1>
      <nav className="header__nav">
        <Link className="header__link" to="/">Home</Link>
        <Link className="header__link" to="/profile">Saved Pets</Link>
        <button className="header__button">Sign In</button>
      </nav>
    </header>
  );
}

export default Header;
