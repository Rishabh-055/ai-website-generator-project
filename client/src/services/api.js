import axios from "axios";

// Standard Backend URL configuration
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:7000";

const apiClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
