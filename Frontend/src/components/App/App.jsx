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

  const [selectedType, setSelectedType] = useState("");
  const [gender, setGender] = useState("");
  const [size, setSize] = useState("");
  const [age, setAge] = useState("");
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [usState, setUsState] = useState("");
  
  const [types, setTypes] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [savedPets, setSavedPets] = useState([]);
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [petsError, setPetsError] = useState("");

  const [page, setPage] = useState(1);

  // ---------- Modal open/close (single source of truth) ----------
  const openLogin = () => { setIsRegisterOpen(false); setIsLoginOpen(true); };
  const openRegister = () => { setIsLoginOpen(false); setIsRegisterOpen(true); };
  const closeModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setLoginError("");
    setRegisterError("");
  };

  // ---------- Fetch animals ----------
  const fetchAnimals = useCallback(async (pageToLoad) => {
    setPetsError("");
    setIsLoadingPets(true);
    try {
      const data = await getPets({ 
        type: selectedType,
        gender,
        size,
        age,
        q,
        city,
        state: usState,
        page: pageToLoad,
        limit: 12,
      });

      const animalsArray = data?.animals ?? [];
      const p = data?.pagination ?? {};

      setAnimals(animalsArray);
      setPagination({
        page: p.current_page ?? p.page ?? pageToLoad ?? 1,
        totalPages: p.total_pages ?? p.totalPages ?? 1,
      });
    setPage(p.current_page ?? p.page ?? pageToLoad ?? 1);
    } catch (e) {
      setPetsError("Sorry, something went wrong during the request. There may be a connection issue or the server may be down. Please try again later.");
    } finally {
      setIsLoadingPets(false);
    }
  }, [selectedType, gender, size, age, q, city, usState]);

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

  const isPetSaved = useCallback(
    (pet) => savedPets.some((p) => String(p.id) === String(pet?.id)),
    [savedPets]
  );

  const onAuthRequired = useCallback(() => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  }, []);

  // pagination helpers
  const canPrev = (pagination?.page ?? page) > 1;
  const canNext = (pagination?.page ?? page) < (pagination?.totalPages ?? 1);

  const loadPets = useCallback(({ direction } = {}) => {
    const curr = pagination?.page ?? page;
    const next =
      direction === "next" ? curr + 1 :
      direction === "prev" ? Math.max(1, curr - 1) :
      curr;
    setPage(next);
    fetchAnimals(next);
  }, [pagination?.page, page, fetchAnimals]);


  // helper: merge guest saved pets into a user’s list (dedup by id)
  const mergeGuestInto = useCallback((userId) => {
    if (!userId) return;
    try {
      const guest = loadSaved("guest") || [];
      const existing = loadSaved(userId) || [];
      const byId = new Map();
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

  /*useEffect(() => {
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
  }, []);*/

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const t = await getAnimalTypes();
        // Normalize to [{ name: "Cat" }, ...] no matter what backend/mock returns
        const normalized = Array.from(
          new Set((t?.types ?? [])
            .map(x => (typeof x === "string" ? x : x?.name))
            .filter(Boolean))
        ).map(name => ({ name }));
        if (!ignore) setTypes(normalized);
      } catch (e) {
        console.warn("[App] getAnimalTypes failed:", e);
      }
    })();
    return () => { ignore = true; };
  }, []);



  useEffect(()=> {
    setPage(1);
    fetchAnimals(1);
  }, [selectedType, gender, size, age, q, city, usState, fetchAnimals]);


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
        /* data/options */
        types={types}
        animals={animals}
        pagination={pagination}
        genderOptions={["Male", "Female"]}
        sizeOptions={["Small", "Medium", "Large"]}
        ageOptions={["Baby", "Young", "Adult", "Senior"]}

        /* selected values */
        selectedType={selectedType}
        gender={gender}
        size={size}
        age={age}
        q={q}
        city={city}
        state={usState}

        /* handlers */
        onTypeChange={setSelectedType}
        onGenderChange={setGender}
        onSizeChange={setSize}
        onAgeChange={setAge}
        onQueryChange={setQ}
        onCityChange={setCity}
        onStateChange={setUsState}
        clearFilters={() => {
          setSelectedType(""); setGender(""); setSize("");
          setAge(""); setQ(""); setCity(""); setUsState("");
        }}

        /* like/auth */
        isPetSaved={isPetSaved}
        toggleLike={toggleLike}
        onAuthRequired={onAuthRequired}
        isAuthenticated={!!currentUser}

        /* status + paging */
        isLoadingPets={isLoadingPets}
        petsError={petsError}
        canPrev={canPrev}
        canNext={canNext}
        loadPets={loadPets}
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
