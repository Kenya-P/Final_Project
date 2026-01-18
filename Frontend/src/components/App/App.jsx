import { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from '../Header/Header.jsx';
import Main from '../Main/Main.jsx';
import Profile from '../Profile/Profile.jsx';
import Footer from '../Footer/Footer.jsx';

import LoginModal from '../LoginModal/LoginModal.jsx';
import RegisterModal from '../RegisterModal/RegisterModal.jsx';

import { logIn, registerUser, logOut } from '../../../utils/auth.js';
import {
  getSavedPets,
  savePet as persistSavedPet,
  removePet as persistRemovePet,
  clearSavedPets,
} from '../../../utils/savedPets.js';

import CurrentUserContext from '../../contexts/CurrentUserContext.jsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');

  const [savedPets, setSavedPets] = useState([]);

  // Load saved pets from localStorage on app start
  useEffect(() => {
    try {
      const list = getSavedPets();
      setSavedPets(Array.isArray(list) ? list : []);
    } catch {
      setSavedPets([]);
    }
  }, []);

  const savedCount = useMemo(() => savedPets.length, [savedPets.length]);

  // ---------- Modal open/close ----------
  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };
  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };
  const closeModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setLoginError('');
    setRegisterError('');
  };

  // ---------- Saved pets handlers ----------
  const handleAddPet = (pet) => {
    try {
      persistSavedPet(pet);
      setSavedPets(getSavedPets());
    } catch {
      // ignore
    }
  };

  const handleRemovePet = (url) => {
    try {
      persistRemovePet(url);
      setSavedPets(getSavedPets());
    } catch {
      // ignore
    }
  };

  const handleClearAll = () => {
    try {
      clearSavedPets();
      setSavedPets([]);
    } catch {
      // ignore
    }
  };

  // ---------- Auth handlers ----------
  const handleLogin = async ({ email, password }) => {
    setIsBusy(true);
    setLoginError('');
    try {
      const user = await logIn({ email, password });
      setCurrentUser(user);
      closeModals();
    } catch (e) {
      setLoginError(e?.problem?.detail || e.message || 'Login failed');
    } finally {
      setIsBusy(false);
    }
  };

  const handleRegister = async ({ name, avatar, email, password }) => {
    setIsBusy(true);
    setRegisterError('');
    try {
      await registerUser({ name, avatar, email, password });
      const user = await logIn({ email, password });
      setCurrentUser(user);
      closeModals();
    } catch (e) {
      setRegisterError(e?.problem?.detail || e.message || 'Registration failed');
    } finally {
      setIsBusy(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch {
      // ignore
    }
    setCurrentUser(null);
    closeModals();
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          currentUser={currentUser}
          savedCount={savedCount}
          onLogin={openLogin}
          onRegister={openRegister}
          onLogout={handleLogout}
        />

        <Routes>
          <Route path="/" element={<Main savedPets={savedPets} />} />
          <Route
            path="/saved"
            element={
              <Profile
                savedPets={savedPets}
                onAddPet={handleAddPet}
                onRemovePet={handleRemovePet}
                onClearAll={handleClearAll}
              />
            }
          />
          {/* Backward-compatible route (in case older links exist) */}
          <Route
            path="/profile"
            element={
              <Profile
                savedPets={savedPets}
                onAddPet={handleAddPet}
                onRemovePet={handleRemovePet}
                onClearAll={handleClearAll}
              />
            }
          />
        </Routes>

        <Footer />

        {/* Modals */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={closeModals}
          onLogin={handleLogin}
          isLoading={isBusy}
          onClickRegister={openRegister}
          errorText={loginError}
        />

        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={closeModals}
          onRegister={handleRegister}
          isLoading={isBusy}
          onClickLogin={openLogin}
          errorText={registerError}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}