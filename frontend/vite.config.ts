import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react()],
  envDir: "./",
  server: {
    host: "0.0.0.0", // This makes it listen on all network interfaces
    port: 5100,
  },
  resolve: {
    dedupe: ["react", "react-dom"], // Force single instance of React and React DOM
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
