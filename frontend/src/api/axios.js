import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const raw = localStorage.getItem("fv:auth");
  if (raw) {
    try {
      const user = JSON.parse(raw);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch {
      // ignore
    }
  }
  return config;
});

export default API;
