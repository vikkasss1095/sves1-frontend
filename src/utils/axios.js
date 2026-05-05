import axios from "axios";

const api = axios.create({
  baseURL: "https://sves1-backend.onrender.com/api",
});

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 🔥 CACHE FIX (IMPORTANT)
  config.headers["Cache-Control"] = "no-cache";
  config.headers["Pragma"] = "no-cache";
  config.headers["Expires"] = "0";

  return config;
});

// ✅ RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // 🔥 TOKEN EXPIRE HANDLE
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;