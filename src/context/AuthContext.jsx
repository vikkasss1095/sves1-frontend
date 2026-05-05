import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ LOAD USER ON REFRESH
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      // 🔥 IF NO TOKEN → STOP
      if (!token) {
        setLoading(false);
        return;
      }

      // 🔥 FAST LOAD (avoid flicker)
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      try {
        // 🔥 VERIFY FROM BACKEND
        const res = await api.get("/auth/me");

        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user)); // ✅ SAVE
      } catch (err) {
        console.error("Auth verification failed");

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ✅ LOGIN
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData)); // 🔥 IMPORTANT
    setUser(userData);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);