// Attach the mock synchronously so there's no race at startup.
// Force-enable when hosted on *.github.io (your Pages site).
import { setupMockApi } from "./fecthMock.js"; // filename is "fecthMock.js"

const FORCE_GHPAGES =
  typeof location !== "undefined" && /github\.io$/.test(location.hostname);
const USE_MOCK =
  FORCE_GHPAGES || import.meta.env.VITE_USE_MOCK === "true";

if (USE_MOCK) {
  setupMockApi();
  // sanity probe you can check in DevTools
  window.__pfMockActive = true;
  console.info("[mock] Mock API enabled (sync)", { FORCE_GHPAGES, USE_MOCK });
}
