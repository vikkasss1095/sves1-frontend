import axios from "axios";

const api = axios.create({
  baseURL: "https://sves1-backend.onrender.com/api",
});

// 🔥 REQUEST
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 RESPONSE FIX (IMPORTANT)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // ❌ REMOVE AUTO REDIRECT
    return Promise.reject(error);
  }
);

export default api;