/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

// DB role -> route segment. renter maps to /student per product naming.
export const ROLE_ROUTES = {
  admin: "/admin",
  landlord: "/landlord",
  renter: "/renter",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("rentstreet_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("rentstreet_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (identifier, password) => {
    const res = await api.post("/auth/login", { identifier, password });
    localStorage.setItem("rentstreet_token", res.data.access_token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("rentstreet_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
