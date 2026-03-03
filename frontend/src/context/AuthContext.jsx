import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadFromToken = async (token) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.data);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      throw new Error("Invalid token");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    loadFromToken(token).finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data.data;

    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
  };

  const signup = async (payload) => {
    const res = await api.post("/auth/register", payload);
    const { token, user } = res.data.data;

    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
  };

  const bootstrapFromToken = async (token) => {
    localStorage.setItem("token", token);
    setLoading(true);
    try {
      await loadFromToken(token);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (nextUser) => setUser(nextUser);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, bootstrapFromToken, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}