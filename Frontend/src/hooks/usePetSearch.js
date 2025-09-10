import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { getAnimalTypes, getPets, getUserPets, likePet, unlikePet } from '../../utils/PetFinderApi.js';

// These mirror Petfinder's common values;
const AGE_OPTIONS = ['Baby', 'Young', 'Adult', 'Senior'];
const SIZE_OPTIONS = ['Small', 'Medium', 'Large', 'X-Large'];

export default function usePetSearch(initial = {}) {
  // lists
  const [types, setTypes] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [savedPets, setSavedPets] = useState([]);

  // filters
  const [selectedType, setSelectedType] = useState(initial.type || '');
  const [gender, setGender] = useState(initial.gender || '');
  const [size, setSize] = useState(initial.size || '');
  const [age, setAge] = useState(initial.age || '');
  const [city, setCity] = useState(initial.city || '');
  const [state, setState] = useState(initial.state || '');
  const [q, setQ] = useState(initial.q || '');

  // paging/sort
  const [page, setPage] = useState(initial.page || 1);
  const [limit, setLimit] = useState(initial.limit || 20);
  const [sort, setSort] = useState(initial.sort || 'recent');

  // ui
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    count_per_page: limit, total_count: 0, current_page: 1, total_pages: 1
  });

  // --- types
  useEffect(() => {
    getAnimalTypes()
      .then(({ types }) => setTypes(types || []))
      .catch((e) => setError(e?.message || 'Failed to load types'));
  }, []);

  // options derived from type (Petfinder spec)
  const genderOptions = useMemo(() => {
    const t = types.find((x) => String(x.name).toLowerCase() === String(selectedType).toLowerCase());
    return t?.genders || ['Male', 'Female', 'Unknown'];
  }, [types, selectedType]);

  const sizeOptions = SIZE_OPTIONS;
  const ageOptions = AGE_OPTIONS;

  // --- core loader
  const loadPets = useCallback((overrides = {}) => {
    setLoading(true);
    setError('');

    const params = {
      type: selectedType || undefined,
      gender: gender || undefined,
      size: size || undefined,
      age: age || undefined,
      city: city || undefined,
      state: state || undefined,
      q: q || undefined,
      page,
      limit,
      sort,
      ...overrides,
    };

    return getPets(params)
      .then(({ animals = [], pagination = {} }) => {
        setAnimals(animals);
        setPagination(pagination);

        // sync state if the caller supplied overrides
        if (overrides.page !== undefined) setPage(overrides.page);
        if (overrides.limit !== undefined) setLimit(overrides.limit);
        if (overrides.sort !== undefined) setSort(overrides.sort);
        if (overrides.type !== undefined) setSelectedType(overrides.type);
        if (overrides.gender !== undefined) setGender(overrides.gender);
        if (overrides.size !== undefined) setSize(overrides.size);
        if (overrides.age !== undefined) setAge(overrides.age);
        if (overrides.city !== undefined) setCity(overrides.city);
        if (overrides.state !== undefined) setState(overrides.state);
        if (overrides.q !== undefined) setQ(overrides.q);
      })
      .catch((e) => setError(e?.message || 'Failed to load pets'))
      .finally(() => setLoading(false));
  }, [selectedType, gender, size, age, city, state, q, page, limit, sort]);

  // --- saved pets API
 const loadSavedPets = useCallback(() => {
    return getUserPets()
      .then(({ animals = [] }) => setSavedPets(animals))
      .catch(() => setSavedPets([]));
  }, []);

  const isPetSaved = useCallback(
    (id) => savedPets.some((p) => String(p.id) === String(id)),
    [savedPets]
  );

  const toggleLike = useCallback(async (pet) => {
    const id = pet?.id;
    if (!id) return;
    try {
      if (isPetSaved(id)) {
        await unlikePet(id);
      } else {
        await likePet(id);
      }
      // Refresh saved list
      await loadSavedPets();
    } catch (e) {
      // swallow; UI can show toast if you implement one
    }
  }, [isPetSaved, loadSavedPets]);

  // --- filter handlers
  const onTypeChange = useCallback((typeName) => {
    const nextType = typeName || '';
    const t = types.find((x) => String(x.name).toLowerCase() === String(nextType).toLowerCase());
    const allowed = t?.genders || ['Male', 'Female', 'Unknown'];
    const nextGender = allowed.includes(gender) ? gender : '';
    return loadPets({ type: nextType, gender: nextGender, page: 1 });
  }, [types, gender, loadPets]);

  const onGenderChange = useCallback((g) => loadPets({ gender: g || '', page: 1 }), [loadPets]);
  const onSizeChange   = useCallback((s) => loadPets({ size: s || '', page: 1 }),   [loadPets]);
  const onAgeChange    = useCallback((a) => loadPets({ age: a || '', page: 1 }),    [loadPets]);
  const onCityChange   = useCallback((v) => loadPets({ city: v.trim(), page: 1 }),  [loadPets]);
  const onStateChange  = useCallback((v) => loadPets({ state: v.trim(), page: 1 }), [loadPets]);

  // debounced search
  const searchTimerRef = useRef(null);
  const onQueryChange = useCallback((value) => {
    const v = value.trimStart();
    setQ(v);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      loadPets({ q: v, page: 1 });
    }, 300);
  }, [loadPets]);

  const clearFilters = useCallback(() => {
    return loadPets({ type: '', gender: '', size: '', age: '', city: '', state: '', q: '', page: 1 });
  }, [loadPets]);

  const canPrev = pagination.current_page > 1;
  const canNext = pagination.current_page < pagination.total_pages;

  return {
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
  };
}