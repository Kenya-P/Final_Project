import { useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from '../Main/Main.jsx';
import Profile from '../Profile/Profile.jsx';
import Header from '../Header/Header.jsx';
import LoginModal from '../LoginModal/LoginModal.jsx';
import RegisterModal from '../RegisterModal/RegisterModal.jsx';
import { logIn, registerUser } from '../../../utils/PetFinderApi.js';
import usePetSearch from '../../hooks/usePetSearch.js';
import './App.css';

import ProtectedRoute from '../../contexts/ProtectedRoute';
import CurrentUserContext from '../../contexts/CurrentUserContext';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [loginError, setLoginError] = useState('');

  // Search state
  const petApi = usePetSearch({ sort: 'recent', limit: 20 });
  const { loadPets } = petApi;

  // initial load once
  useEffect(() => {
    loadPets();
  }, [loadPets]);

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
        } else {
          console.error('Registration failed:', res.message || 'Unknown error');
        }
      })
      .catch((err) => {
        console.error('Registration error:', err);
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Main {...petApi} />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute element={Profile} isLoggedIn={!!currentUser} />
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

export default App;
