import ANIMALS_FIXTURE from '../mocks/animal.json';

function jsonResponse(obj, init = {}) {
  const body = JSON.stringify(obj);
  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  return new Response(body, { status: init.status || 200, headers });
}

function filterAnimals(animals, params) {
  const q = (params.get('q') || '').toLowerCase();
  const type = (params.get('type') || '').toLowerCase();
  const age = (params.get('age') || '').toLowerCase();
  const gender = (params.get('gender') || '').toLowerCase();
  const size = (params.get('size') || '').toLowerCase();

  return animals.filter(a => {
    const name = (a.name || '').toLowerCase();
    const matchQ = !q || name.includes(q);
    const matchType = !type || (a.type || '').toLowerCase() === type;
    const matchAge = !age || (a.age || '').toLowerCase() === age;
    const matchGender = !gender || (a.gender || '').toLowerCase() === gender;
    const matchSize = !size || (a.size || '').toLowerCase() === size;
    return matchQ && matchType && matchAge && matchGender && matchSize;
  });
}

export function setupMockApi() {
  const realFetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = async (input, init = {}) => {
    try {
      const url = new URL(input instanceof Request ? input.url : String(input), location.origin);
      const method = (init.method || (input instanceof Request ? input.method : 'GET') || 'GET').toUpperCase();

      // Only handle our API
      if (!url.pathname.startsWith('/api/pf')) {
        return realFetch(input, init);
      }

      // Simulate a tiny bit of latency
      await new Promise(r => setTimeout(r, 120));

      // GET /api/pf/types
      if (method === 'GET' && url.pathname === '/api/pf/types') {
        const types = ANIMALS_FIXTURE.types
          || Array.from(new Set((ANIMALS_FIXTURE.animals || []).map(a => a.type)));
        return jsonResponse({ types });
      }

      // GET /api/pf/animals
      if (method === 'GET' && url.pathname === '/api/pf/animals') {
        const all = ANIMALS_FIXTURE.animals || [];
        const filtered = filterAnimals(all, url.searchParams);

        const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1);
        const limit = Math.max(parseInt(url.searchParams.get('limit') || '12', 10), 1);
        const start = (page - 1) * limit;
        const paged = filtered.slice(start, start + limit);

        const pagination = {
          count_per_page: limit,
          total_count: filtered.length,
          current_page: page,
          total_pages: Math.max(1, Math.ceil(filtered.length / limit)),
        };

        return jsonResponse({ animals: paged, pagination });
      }

      // Unhandled routes -> 404 so you’ll see them in the console
      return jsonResponse({ error: 'Not Found', path: url.pathname }, { status: 404 });
    } catch (e) {
      console.error('[mock] fetch error', e);
      return new Response('Mock error', { status: 500 });
    }
  };
}
