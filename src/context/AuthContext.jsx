import React, { useContext, useState } from "react";
import http from "../http-common";

// ── sessionStorage keys ───────────────────────────────────────────────────────
const SS_ROLE = "role";
const SS_ID   = "userId";

// ── helpers ───────────────────────────────────────────────────────────────────
const readRole = () => sessionStorage.getItem(SS_ROLE) || "";
const readId   = () => sessionStorage.getItem(SS_ID)   || "";

const AuthContext = React.createContext({
  logout: () => {},
  id: undefined,
  user: undefined,
  userNotExistInDb: false,
  onLogin: () => {},
  userHandler: (role) => {},
  idHandler: (id) => {},
});

export const AuthContextProvider = ({ children }) => {
  // Initialise from sessionStorage so a page refresh doesn't log the user out
  const [user, setUser] = useState(readRole);
  const [id,   setId]   = useState(readId);
  const [userNotExistInDb, setUserNotExistInDb] = useState(
    () => Boolean(readRole())   // already logged in if role is stored
  );

  const idHandler = (newId) => {
    const value = newId ? String(newId) : "";
    setId(value);
    if (value) {
      sessionStorage.setItem(SS_ID, value);
    } else {
      sessionStorage.removeItem(SS_ID);
    }
  };

  const userHandler = (role) => {
    const value = (role || "").toLowerCase();
    setUser(value);
    if (value) {
      sessionStorage.setItem(SS_ROLE, value);
    } else {
      sessionStorage.removeItem(SS_ROLE);
    }
  };

  const loginHandler = () => {
    setUserNotExistInDb(true);
  };

  /**
   * logoutHandler
   * Calls the backend /logout (sets cache-control headers), then clears all
   * local auth state and sessionStorage so the route guard redirects to login.
   */
  const logoutHandler = async () => {
    try {
      await http.post("/logout");
    } catch (_) {
      // Even if the request fails, clear local state
    } finally {
      setUser("");
      setId("");
      setUserNotExistInDb(false);
      sessionStorage.removeItem(SS_ROLE);
      sessionStorage.removeItem(SS_ID);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userNotExistInDb,
        onLogout: logoutHandler,
        logout:   logoutHandler,
        onLogin:  loginHandler,
        user,
        id,
        idHandler,
        userHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
};

export default AuthContext;
