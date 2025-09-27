import ANIMALS_FIXTURE from '../mocks/animal.json';

function json(obj, init = {}) {
  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  return new Response(JSON.stringify(obj), { status: init.status || 200, headers });
}

function filterAnimals(animals, params) {
  const q      = (params.get('q') || '').toLowerCase();
  const type   = (params.get('type') || '').toLowerCase();
  const age    = (params.get('age') || '').toLowerCase();
  const gender = (params.get('gender') || '').toLowerCase();
  const size   = (params.get('size') || '').toLowerCase();

  return animals.filter(a => {
    if (q && !(`${a.name || ''} ${(a.breeds?.primary || '')} ${(a.type || '')}`.toLowerCase().includes(q))) return false;
    if (type && (a.type || '').toLowerCase() !== type) return false;
    if (age && (a.age || '').toLowerCase() !== age) return false;
    if (gender && (a.gender || '').toLowerCase() !== gender) return false;
    if (size && (a.size || '').toLowerCase() !== size) return false;
    return true;
  });
}

export function setupMockApi() {
  const realFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    try {
      const url = new URL(typeof input === 'string' ? input : input.url, window.location.origin);
      const method = (init.method || (typeof input !== 'string' ? input.method : '') || 'GET').toUpperCase();

      if (!url.pathname.startsWith('/api/pf')) {
        return realFetch(input, init);
      }

      console.info('[mock] intercept', method, url.pathname, url.search);

      await new Promise(r => setTimeout(r, 60));

      if (method === 'GET' && url.pathname === '/api/pf/types') {
        const types = ANIMALS_FIXTURE.types
          || Array.from(new Set((ANIMALS_FIXTURE.animals || []).map(a => a.type)));
        return json({ types });
      }

      if (method === 'GET' && url.pathname === '/api/pf/animals') {
        const all = ANIMALS_FIXTURE.animals || [];
        const filtered = filterAnimals(all, url.searchParams);

        const page  = Math.max(parseInt(url.searchParams.get('page')  || '1', 10), 1);
        const limit = Math.max(parseInt(url.searchParams.get('limit') || '12', 10), 1);
        const start = (page - 1) * limit;
        const paged = filtered.slice(start, start + limit);

        const pagination = {
          count_per_page: limit,
          total_count: filtered.length,
          current_page: page,
          total_pages: Math.max(1, Math.ceil(filtered.length / limit)),
        };

        return json({ animals: paged, pagination });
      }

      return json({ error: 'Not Found', path: url.pathname }, { status: 404 });

    } catch (e) {
      console.error('[mock] fetch error', e);
      return json({ error: 'Mock error', message: String(e?.message || e) }, { status: 500 });
    }
  };
}