import { setupMockApi } from "./fecthMock.js";

if (import.meta.env.VITE_USE_MOCK === "true") {
  setupMockApi();
  window.__pfMockActive = true;
  console.info("[mock] Mock API enabled (sync)");
}
