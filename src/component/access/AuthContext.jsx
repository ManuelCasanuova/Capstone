import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [utente, setUtente] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUtente = async () => {
      if (!token) {
        setUtente(null);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${apiUrl}/utente/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Errore nel recupero dell'utente");
        const data = await res.json();
        setUtente(data);
      } catch {
        setUtente(null);
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    fetchUtente();
  }, [token, apiUrl]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setLoading(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUtente(null);
  };


  const aggiornaAvatarUtente = (nuovoAvatar) => {
    setUtente((prev) => (prev ? { ...prev, avatar: nuovoAvatar } : prev));
  };

  return (
    <AuthContext.Provider
      value={{ user: utente, token, loading, login, logout, aggiornaAvatarUtente }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);





