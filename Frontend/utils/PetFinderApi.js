const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

/**
 * Fetches pet data from the backend (which calls the Petfinder API).
 * You can add query params later (e.g. ?type=dog&location=NY)
 */
export function _handleResponse(res) {
  if (res.ok) {
    return res.json();
  }

  return res.text().then((text) => {
    console.error('Response error text:', text);
    return Promise.reject(`Error ${res.status}: ${text}`);
  });
}

function request(url, options) {
  return fetch(url, options)
    .then(_handleResponse)
    .catch((error) => {
      console.error('API error:', error);
      throw error;
    });
}

function getAuthHeaders() {
  const token = localStorage.getItem('petfinder_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getPets() {
  return request(`${BASE_URL}/api/pets`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });
}

function getPetById(id) {
  return request(`${BASE_URL}/api/pets/${id}`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });
}

function getUserPets() {
  return request(`${BASE_URL}/api/user/pets`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });
}

function registerUser(userData) {
  return request(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
}

function logIn(credentials) {
  return request(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  }).then((data) => {
    if (data.token) {
      localStorage.setItem('petfinder_token', data.token);
    }
    return data;
  });
}

function logOut() {
  localStorage.removeItem('petfinder_token');
  return Promise.resolve();
}

function likePet(petId) {
  return request(`${BASE_URL}/api/pets/${petId}/like`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ petId }),
  });
}
function unlikePet(petId) {
  return request(`${BASE_URL}/api/pets/${petId}/unlike`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ petId }),
  });
}

function removePet(petId) {
  return request(`${BASE_URL}/api/pets/${petId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });
}

export {
  getPets,
  getPetById,
  getUserPets,
  registerUser,
  logIn,
  logOut,
  likePet,
  unlikePet,
  removePet,
};
