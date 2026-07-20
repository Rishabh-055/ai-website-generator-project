import axios from "axios";

// Dynamic Backend URL resolution:
// 1. Use VITE_BACKEND_URL if explicitly set in environment
// 2. In production (non-localhost hostname), use relative path ("") for unified single-host deployment
// 3. Fallback to local dev server (http://localhost:7000)
const isProduction = typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (isProduction ? "" : "http://localhost:7000");

const apiClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
