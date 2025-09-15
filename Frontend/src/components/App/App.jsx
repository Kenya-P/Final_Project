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

  // ---------- Modal open/close (single source of truth) ----------
  const openLogin = () => { setIsRegisterOpen(false); setIsLoginOpen(true); };
  const openRegister = () => { setIsLoginOpen(false); setIsRegisterOpen(true); };
  const closeModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setLoginError("");
    setRegisterError("");
  };

  // ---------- Saved Pets helpers ----------
  const loadSavedPets = useCallback((userId) => {
    try {
      const list = loadSaved(userId || "guest");
      setSavedPets(Array.isArray(list) ? list : []);
    } catch {
      setSavedPets([]);
    }
  }, []);

  const toggleLike = useCallback((pet) => {
    setSavedPets((prev) => {
      const exists = prev.some((p) => String(p.id) === String(pet.id));
      const minimal = {
        id: pet.id,
        name: pet.name,
        age: pet.age,
        url: pet.url,
        photos: pet.photos,
        breeds: pet.breeds,
        imageUrl: pet.imageUrl,
        contact: pet.contact,
      };
      const next = exists ? prev.filter((p) => String(p.id) !== String(pet.id)) : [minimal, ...prev];
      try { saveSaved(currentUser?._id || "guest", next); } catch {}
      return next;
    });
  }, [currentUser?._id]);

  // helper: merge guest saved pets into a user’s list (dedup by id)
  const mergeGuestInto = useCallback((userId) => {
    if (!userId) return;
    try {
      const guest = loadSaved("guest") || [];
      const existing = loadSaved(userId) || [];
      const byId = newMap();
      [...existing, ...guest].forEach((p) => byId.set(String(p.id), p));
      const merged = Array.from(byId.values());
      saveSaved(userId, merged);
      saveSaved("guest", []);
      setSavedPets(merged);
    } catch (error) {
      console.error("mergeGuestInto failed:", error);
    }
  }, []);


  // ---------- Auth handlers ----------
  const handleLogin = async ({ email, password }) => {
    setIsBusy(true);
    setLoginError("");
    try {
      const user = await logIn({ email, password });
      setCurrentUser(user);
      mergeGuestInto(user._id);
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
      const user = await logIn({ email, password });
      setCurrentUser(user);
      mergeGuestInto(user._id);      
      setIsRegisterOpen(false);
      setIsLoginOpen(true);
      closeModals();
    } catch (e) {
      setRegisterError(e?.problem?.detail || e.message || "Registration failed");
    } finally {
      setIsBusy(false);
    }
  };

  const handleLogout = async () => {
    try { await logOut(); } catch {}
    setCurrentUser(null);
    setSavedPets([]);
    closeModals();
  };

  useEffect(() => {
    (async () => {
      try {
        const t = await getAnimalTypes();
        // normalize to string names regardless of API shape
        const names = Array.from(new Set((t?.types || []).map((x) => (typeof x === "string" ? x : x?.name)).filter(Boolean)));
        setTypes(names);
      } catch (e) {
        console.error("[App] getAnimalTypes failed:", e);
      }
      try {
        const page1 = await getPets({ page: 1 });
        setAnimals(page1?.animals || []);
      } catch (e) {
        console.error("[App] getPets failed:", e);
      }
    })();
  }, []);

  // when user changes, reload their saved pets once
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

      <ModalWithForm
        isOpen={false}
        onClose={() => {}}
        title=""
      />
    </CurrentUserContext.Provider>
  );
}
