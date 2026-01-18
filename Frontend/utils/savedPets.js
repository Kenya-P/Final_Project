const STORAGE_KEY = "savedPets";

export function getSavedPets() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function savePet(pet) {
  const pets = getSavedPets();
  if (!pets.some(p => p.url === pet.url)) {
    pets.push(pet);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
  }
}

export function removePet(url) {
  const pets = getSavedPets().filter(p => p.url !== url);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
}

export function clearSavedPets() {
  localStorage.removeItem(STORAGE_KEY);
}
