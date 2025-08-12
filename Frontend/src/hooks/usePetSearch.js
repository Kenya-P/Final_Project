// src/hooks/usePetSearch.js
import { useEffect, useMemo, useState, useCallback } from 'react';
import { getAnimalTypes, getPets } from '../../utils/PetFinderApi';

// Static options that mirror Petfinder common values
const AGE_OPTIONS = ['Baby', 'Young', 'Adult', 'Senior'];
const SIZE_OPTIONS = ['Small', 'Medium', 'Large', 'X-Large'];

export default function usePetSearch(initial = {}) {
  const [types, setTypes] = useState([]);
  const [animals, setAnimals] = useState([]);

  const [selectedType, setSelectedType] = useState(initial.type || '');
  const [gender, setGender] = useState(initial.gender || '');
  const [size, setSize] = useState(initial.size || '');
  const [age, setAge] = useState(initial.age || '');

  const [page, setPage] = useState(initial.page || 1);
  const [limit, setLimit] = useState(initial.limit || 20);
  const [sort, setSort] = useState(initial.sort || 'recent');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    count_per_page: limit, total_count: 0, current_page: 1, total_pages: 1
  });

  // Load valid animal types once
  useEffect(() => {
    getAnimalTypes()
      .then(({ types }) => setTypes(types || []))
      .catch((e) => setError(e?.message || 'Failed to load types'));
  }, []);

  // Gender options come from the currently selected type (Petfinder spec)
  const genderOptions = useMemo(() => {
    const t = types.find((x) => String(x.name).toLowerCase() === String(selectedType).toLowerCase());
    return t?.genders || ['Male', 'Female', 'Unknown'];
  }, [types, selectedType]);

  const sizeOptions = SIZE_OPTIONS;
  const ageOptions = AGE_OPTIONS;

  const loadPets = useCallback((overrides = {}) => {
    setLoading(true);
    setError('');

    const params = {
      type: selectedType || undefined,
      gender: gender || undefined,
      size: size || undefined,
      age: age || undefined,
      page,
      limit,
      sort,
      ...overrides,
    };

    return getPets(params)
      .then(({ animals = [], pagination = {} }) => {
        setAnimals(animals);
        setPagination(pagination);

        // sync any state that changed via overrides
        if (overrides.page !== undefined) setPage(overrides.page);
        if (overrides.limit !== undefined) setLimit(overrides.limit);
        if (overrides.sort !== undefined) setSort(overrides.sort);
        if (overrides.type !== undefined) setSelectedType(overrides.type);
        if (overrides.gender !== undefined) setGender(overrides.gender);
        if (overrides.size !== undefined) setSize(overrides.size);
        if (overrides.age !== undefined) setAge(overrides.age);
      })
      .catch((e) => setError(e?.message || 'Failed to load pets'))
      .finally(() => setLoading(false));
  }, [selectedType, gender, size, age, page, limit, sort]);

  // Handlers for filters
  const onTypeChange = useCallback((typeName) => {
    // Reset gender if it no longer exists for the new type
    const nextType = typeName || '';
    const nextGenderOptions = (() => {
      const t = types.find((x) => String(x.name).toLowerCase() === String(nextType).toLowerCase());
      return t?.genders || ['Male', 'Female', 'Unknown'];
    })();

    const nextGender = nextGenderOptions.includes(gender) ? gender : '';
    return loadPets({ type: nextType, gender: nextGender, page: 1 });
  }, [types, gender, loadPets]);

  const onGenderChange = useCallback((g) => loadPets({ gender: g || '', page: 1 }), [loadPets]);
  const onSizeChange = useCallback((s) => loadPets({ size: s || '', page: 1 }), [loadPets]);
  const onAgeChange = useCallback((a) => loadPets({ age: a || '', page: 1 }), [loadPets]);

  const clearFilters = useCallback(() => {
    return loadPets({ type: '', gender: '', size: '', age: '', page: 1 });
  }, [loadPets]);

  const canPrev = pagination.current_page > 1;
  const canNext = pagination.current_page < pagination.total_pages;

  return {
    // data
    types, animals, pagination, genderOptions, sizeOptions, ageOptions,
    // selections
    selectedType, gender, size, age,
    // ui
    loading, error, canPrev, canNext,
    // actions
    loadPets, onTypeChange, onGenderChange, onSizeChange, onAgeChange,
    clearFilters,
  };
}

