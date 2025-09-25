if (import.meta.env.VITE_USE_MOCK === 'true') {
  await import('./fecthMock.js').then(m => m.setupMockApi());
  console.info('[mock] Mock API enabled');
}
