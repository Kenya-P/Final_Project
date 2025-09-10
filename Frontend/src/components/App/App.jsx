import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "../Header/Header.jsx";
import Main from "../Main/Main.jsx";
import Profile from "../Profile/Profile.jsx";

import LoginModal from "../LoginModal/LoginModal.jsx";
import RegisterModal from "../RegisterModal/RegisterModal.jsx";
import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";

import { logIn, registerUser, logOut } from "../../../utils/auth.js";
import { getPets, getAnimalTypes } from "../../../utils/PetFinderApi.js";
import { loadSaved, saveSaved } from "../../../utils/savedPets.js";

import CurrentUserContext from "../../contexts/CurrentUserContext.jsx";
import ProtectedRoute from "../../contexts/ProtectedRoute.jsx";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [isBusy, setIsBusy] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const [types, setTypes] = useState([]);
  const [animals, setAnimals] = useState([]);

  const [savedPets, setSavedPets] = useState([]);

  // ---------- Modal open/close ----------
  const openLogin = () => setIsLoginOpen(true);
  const openRegister = () => setIsRegisterOpen(true);
  const closeModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setLoginError("");
    setRegisterError("");
  };

  // ---------- Auth handlers ----------
  const handleLogin = async ({ email, password }) => {
    setIsBusy(true);
    setLoginError("");
    try {
      const user = await logIn({ email, password }); // should return user object + token storage inside auth.js
      setCurrentUser(user);
      // load saved pets for this user
      setSavedPets(loadSavedPets(user?._id));
      closeModals();
    } catch (e) {
      setLoginError(e?.problem?.detail || e.message || "Login failed");
    } finally {
      setIsBusy(false);
    }
  };

  const handleRegister = async ({ name, avatar, email, password }) => {
    setIsBusy(true);
    setRegisterError("");
    try {
      await registerUser({ name, avatar, email, password });
      // After register, go straight to login modal
      setIsRegisterOpen(false);
      setIsLoginOpen(true);
    } catch (e) {
      setRegisterError(e?.problem?.detail || e.message || "Registration failed");
    } finally {
      setIsBusy(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } finally {
      setCurrentUser(null);
      setSavedPets([]);
    }
  };

  // ---------- Saved pets ----------
  const loadSavedPets = useCallback(
    (uid = currentUser?._id || "guest") => {
      const items = loadSaved(uid);
      setSavedPets(items);
      return items;
    },
    [currentUser?._id]
  );


  const toggleLike = useCallback(
    (pet) => {
      const uid = currentUser?._id || "guest";
      setSavedPets(prev => {
        const exists = prev.some(p => p.id === pet.id);
        const next = exists ? prev.filter(p => p.id !== pet.id) : [{ id: pet.id, ...pet }, ...prev];
        saveSaved(uid, next);
        return next;
      });
    },
    [currentUser?._id]
  );


  // ---------- Data bootstrap ----------
  useEffect(() => {
    (async () => {
      try {
        const [t, a] = await Promise.all([getAnimalTypes(), getPets({ page: 1 })]);
        setTypes(t?.types || []);
        setAnimals(a?.animals || []);
      } catch (_) {
        // ignore for now; surface on UI if you want
      }
    })();
  }, []);

  // when user changes, (re)load their saved pets
  useEffect(() => {
    if (currentUser?._id) loadSavedPets(currentUser._id);
  }, [currentUser?._id, loadSavedPets]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
        <Header
          currentUser={currentUser}
          onLogin={openLogin}
          onRegister={openRegister}
          onLogout={handleLogout}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Main
                animals={animals}
                types={types}
                savedPets={savedPets}
                onToggleLike={toggleLike}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={!!currentUser}>
                <Profile
                  savedPets={savedPets}
                  loadSavedPets={loadSavedPets}
                  toggleLike={toggleLike}
                />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Modals */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={closeModals}
          onLogin={handleLogin}
          isLoading={isBusy}
          onClickRegister={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }}
          errorText={loginError}
        />

        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={closeModals}
          onRegister={handleRegister}
          isLoading={isBusy}
          onClickLogin={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }}
          errorText={registerError}
        />

        {/* example shared modal if you’re using ModalWithForm elsewhere */}
        <ModalWithForm
          isOpen={false}
          onClose={() => {}}
          title=""
        />
    </CurrentUserContext.Provider>
  );
}
