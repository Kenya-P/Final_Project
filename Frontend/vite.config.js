import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [react({ jsxRuntime: "automatic" })],
  base: isProd ? "/Final_Project/" : "/",   // <- dev at '/', prod at '/Final_Project/'
  server: {
    port: 3000,
    proxy: {
      // dev calls to /api/* go to your local backend
      "/api": { target: "http://localhost:3001", changeOrigin: true },
      // keep if your client uses /pf/*; otherwise you can remove this
      "/pf":  { target: "http://localhost:3001", changeOrigin: true },
    },
  },
});