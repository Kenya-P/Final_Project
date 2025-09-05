import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from '../Main/Main.jsx';
import Profile from '../Profile/Profile.jsx';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
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
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');

  const search = usePetSearch();

  const openLogin = () => setIsLoginOpen(true);
  const openRegister = () => setIsRegisterOpen(true);
  const closeModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setLoginError('');
    setRegisterError('');
  };

  const onAuthRequired = () => {
    setIsLoginOpen(true);
  };

  async function handleLoginSubmit({ email, password }) {
    setLoginError('');
    try {
      const res = await logIn({ email, password });
      const user = res?.user ?? res;
      setCurrentUser(user);
      closeModals();
      if (typeof search.loadSavedPets === 'function') search.loadSavedPets();
    } catch (e) {
      setLoginError(e?.message || 'Login failed');
    }
  }

  async function handleRegisterSubmit(formValues) {
    setRegisterError('');
    try {
      const res = await registerUser(formValues);
      const user = res?.user ?? res;
      setCurrentUser(user);
      closeModals();
    } catch (e) {
      setRegisterError(e?.message || 'Registration failed');
    }
  }

  async function handleLogout() {
    try { await logOut?.(); } finally { setCurrentUser(null); }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Router>
        <Header
          onLoginClick={openLogin}
          onRegisterClick={openRegister}
          onLogoutClick={handleLogout}
          currentUser={currentUser}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Main
                types={search.types}
                animals={search.animals}
                savedPets={search.savedPets}
                pagination={search.pagination}
                genderOptions={search.genderOptions}
                sizeOptions={search.sizeOptions}
                ageOptions={search.ageOptions}
                selectedType={search.selectedType}
                gender={search.gender}
                size={search.size}
                age={search.age}
                city={search.city}
                state={search.state}
                q={search.q}
                loading={search.loading}
                error={search.error}
                canPrev={search.canPrev}
                canNext={search.canNext}
                loadPets={search.loadPets}
                loadSavedPets={search.loadSavedPets}
                toggleLike={search.toggleLike}
                isPetSaved={search.isPetSaved}
                onTypeChange={search.onTypeChange}
                onGenderChange={search.onGenderChange}
                onSizeChange={search.onSizeChange}
                onAgeChange={search.onAgeChange}
                onCityChange={search.onCityChange}
                onStateChange={search.onStateChange}
                onQueryChange={search.onQueryChange}
                clearFilters={search.clearFilters}
                onAuthRequired={onAuthRequired}
                isAuthenticated={Boolean(currentUser?._id)}
              />
            }
          />
          <Route
            path="/profile"
            element={<ProtectedRoute currentUser={currentUser}><Profile /></ProtectedRoute>}
          />
        </Routes>

        <Footer />

        <LoginModal isOpen={isLoginOpen} onClose={closeModals} onSubmit={handleLoginSubmit} error={loginError} />
        <RegisterModal isOpen={isRegisterOpen} onClose={closeModals} onSubmit={handleRegisterSubmit} error={registerError} />
      </Router>
    </CurrentUserContext.Provider>
  );
}
