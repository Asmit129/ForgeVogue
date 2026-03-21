import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("fv:auth");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (user) {
      API.get("/auth/watchlist")
        .then(res => setWatchlist(res.data.map(item => item._id || item)))
        .catch(err => console.error("Failed to load watchlist", err));
    } else {
      setWatchlist([]);
    }
  }, [user]);

  const toggleWatchlist = async (productId) => {
    if (!user) return false;
    try {
      const { data } = await API.post(`/auth/watchlist/${productId}`);
      setWatchlist(data.map(item => item._id || item));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      setUser(data);
      localStorage.setItem("fv:auth", JSON.stringify(data));
      API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", {
        name,
        email,
        password,
      });
      setUser(data);
      localStorage.setItem("fv:auth", JSON.stringify(data));
      API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("fv:auth");
  };

  const updateUser = (updatedData) => {
    setUser(updatedData);
    localStorage.setItem("fv:auth", JSON.stringify(updatedData));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, updateUser, watchlist, toggleWatchlist }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
