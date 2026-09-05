import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.BASE_PATH ?? (repositoryName ? `/${repositoryName}/` : "/");

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    target: "es2020"
  },
  server: {
    host: "127.0.0.1",
    port: 5173
  }
});
