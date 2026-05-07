import axios from "axios";

const api = axios.create({
  baseURL: "https://sves1-backend.onrender.com/api",
  timeout: 10000, // 10 sec timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log("API Error:", error.response.data);
    } else if (error.request) {
      console.log("Server not responding");
    } else {
      console.log("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;