import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const USE_MOCK  = env.VITE_USE_MOCK === "true";
  const API_TARGET = env.VITE_API_BASE || "http://localhost:3001";

  return defineConfig({
    plugins: [react()],
    base: mode === "production" ? "/Final_Project/" : "/",
    server: {
      port: 3000,
      // Disable proxy entirely when mocking so nothing ever leaves the browser
      proxy: USE_MOCK ? {} : {
        "/api": { target: API_TARGET, changeOrigin: true },
        "/pf":  { target: API_TARGET, changeOrigin: true },
      },
    },
  });
};

