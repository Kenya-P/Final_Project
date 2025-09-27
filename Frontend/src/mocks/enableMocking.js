if (import.meta.env.VITE_USE_MOCK === 'true') {
  (async () => {
    const m = await import('./fecthMock.js');
    m.setupMockApi();
    console.info('[mock] Mock API enabled');
  })();
}
