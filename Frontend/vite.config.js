import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  // Loads .env, .env.development, etc. into "env"
  const env = loadEnv(mode, process.cwd(), "");
  //const API_TARGET = env.VITE_API_BASE || "http://localhost:3001";

  return defineConfig({
    plugins: [react({ jsxRuntime: "automatic" })],
    base: mode === "production" ? "/Final_Project/" : "/",
    server: {
      port: 3000,
      /* proxy: {
        // Proxy any front-end request under /api to your backend
        "/api": { target: API_TARGET, changeOrigin: true },
        // keep if you still hit /pf/* in your code
        "/pf": { target: API_TARGET, changeOrigin: true },
      }, */
    },
  });
};
