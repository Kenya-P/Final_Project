import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from '../Main/Main.jsx';
import Profile from '../Profile/Profile.jsx';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import ModalWithForm from '../ModalWithForm/ModalWithForm.jsx';
import LoginModal from '../LoginModal/LoginModal.jsx';
import RegisterModal from '../RegisterModal/RegisterModal.jsx';
import { logIn, registerUser, logOut } from '../../../utils/auth.js';
import usePetSearch from '../../hooks/usePetSearch.js';
import './App.css';

import ProtectedRoute from '../../contexts/ProtectedRoute.jsx';
import CurrentUserContext from '../../contexts/CurrentUserContext.jsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    // data
    types, animals, savedPets, pagination, genderOptions, sizeOptions, ageOptions,
    // selections
    selectedType, gender, size, age, city, state, q,
    // ui
    loading, error, canPrev, canNext,
    // actions
    loadPets, loadSavedPets, toggleLike, isPetSaved,
    onTypeChange, onGenderChange, onSizeChange, onAgeChange,
    onCityChange, onStateChange, onQueryChange, clearFilters,
  } = usePetSearch();

  // load first page on mount / when filters change (if your hook doesn't already do it)
  useEffect(() => { loadPets(); }, [selectedType, gender, size, age, city, state, q, loadPets]);

  // refresh saved list after login/logout
  useEffect(() => {
    if (currentUser?.id) loadSavedPets();
  }, [currentUser, loadSavedPets]);

  function handleLogin(credentials) {
    logIn(credentials)
      .then((data) => {
        setCurrentUser(data.user);
        setIsLoginOpen(false);
        setLoginError('');
      })
      .catch((err) => {
        console.error('Login error:', err);
        setLoginError('Login failed. Please try again.');
      });
  }

  function handleRegister(userData) {
    registerUser(userData)
      .then((res) => {
        if (res.user) {
          setIsRegisterOpen(false);
          setCurrentUser(res.user);
        }
      })
      .catch((err) => console.error('Registration error:', err));
  }

  function handleLogout() {
    logOut()
      .catch((e) => console.error("Logout error:", e))
      .finally(() => setCurrentUser(null));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Router>
        <Header
          onLogin={() => setIsLoginOpen(true)}
          onRegister={() => setIsRegisterOpen(true)}
          onLogout={handleLogout}
        />

          <Routes>
            <Route
              path="/"
              element={
                <Main
                  // data
                  types={types}
                  animals={animals}
                  savedPets={savedPets}
                  pagination={pagination}
                  genderOptions={genderOptions}
                  sizeOptions={sizeOptions}
                  ageOptions={ageOptions}
                  // selections
                  selectedType={selectedType}
                  gender={gender}
                  size={size}
                  age={age}
                  city={city}
                  state={state}
                  q={q}
                  // ui
                  loading={loading}
                  error={error}
                  canPrev={canPrev}
                  canNext={canNext}
                  // actions
                  loadPets={loadPets}
                  loadSavedPets={loadSavedPets}
                  toggleLike={toggleLike}
                  isPetSaved={isPetSaved}
                  onTypeChange={onTypeChange}
                  onGenderChange={onGenderChange}
                  onSizeChange={onSizeChange}
                  onAgeChange={onAgeChange}
                  onCityChange={onCityChange}
                  onStateChange={onStateChange}
                  onQueryChange={onQueryChange}
                  clearFilters={clearFilters}
                  onAuthRequired={() => setIsLoginOpen(true)}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  isLoggedIn={!!currentUser}
                  element={Profile}
                  savedPets={savedPets}
                  loadSavedPets={loadSavedPets}
                  toggleLike={toggleLike}
                  onAuthRequired={() => setIsLoginOpen(true)}
                />
              }
            />
          </Routes>

          <Footer />

          <div>
            <LoginModal
              isOpen={isLoginOpen}
              onClose={() => setIsLoginOpen(false)}
              onLogin={handleLogin}
            />

            <RegisterModal
              isOpen={isRegisterOpen}
              onClose={() => setIsRegisterOpen(false)}
              onRegister={handleRegister}
            />
          </div>
        {loginError && <p className="error">{loginError}</p>}
      </Router>
    </CurrentUserContext.Provider>
  );
}
