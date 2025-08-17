import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from '../Main/Main.jsx';
import Profile from '../Profile/Profile.jsx';
import Header from '../Header/Header.jsx';
import LoginModal from '../LoginModal/LoginModal.jsx';
import RegisterModal from '../RegisterModal/RegisterModal.jsx';
import { logIn, registerUser, logOut } from '../../../utils/auth.js';
import usePetSearch from '../../hooks/usePetSearch.js';
import './App.css';

import ProtectedRoute from '../../contexts/ProtectedRoute.jsx';
import CurrentUserContext from '../../contexts/CurrentUserContext.jsx';

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [loginError, setLoginError] = useState('');

  // search state lives here (rubric-friendly)
  const petApi = usePetSearch({ sort: 'recent', limit: 20 });
  const { loadPets, loadSavedPets } = petApi;

  // initial data
  useEffect(() => { loadPets(); }, [loadPets]);

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
    logOut().finally(() => {
      setCurrentUser({});
    });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Router>
        <Header
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenRegister={() => setIsRegisterOpen(true)}
          onLogout={handleLogout}
        />

        <Routes>
          <Route path="/" element={<Main {...petApi} />} />
          <Route
            path="/profile"
            element={
            <ProtectedRoute element={(props) => 
            <Profile {...props} 
            savedPets={petApi.savedPets} 
            loadSavedPets={petApi.loadSavedPets} 
            toggleLike={petApi.toggleLike} />} 
            isLoggedIn={!!currentUser?.id} />
          }
          />
        </Routes>

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

        {loginError && <p className="error">{loginError}</p>}
      </Router>
    </CurrentUserContext.Provider>
  );
}
