import React, { createContext, useState, useContext, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Correct import syntax

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [userType, setUserType] = useState(localStorage.getItem("userType") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));

  useEffect(() => {
    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken);
        // Depending on your token structure:
        // Use 'sub' claim or 'UserId' if you customized token claims
        const id = decodedToken.sub || decodedToken.UserId || null;
        const role = decodedToken.UserType || decodedToken.role || null;

        setUserId(id);
        setUserType(role);

        localStorage.setItem("userId", id);
        localStorage.setItem("userType", role);
      } catch (error) {
        console.error("Invalid token: Unable to decode", error);
        logout();
      }
    } else {
      setUserId(null);
      setUserType(null);
    }
    setIsLoggedIn(!!authToken);
  }, [authToken]);

  const login = (token, role) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token);

    try {
      const decodedToken = jwtDecode(token);
      const id = decodedToken.sub || decodedToken.UserId || null;
      const userRole = decodedToken.UserType || decodedToken.role || role || null;

      setUserId(id);
      setUserType(userRole);

      localStorage.setItem("userId", id);
      localStorage.setItem("userType", userRole);
    } catch (error) {
      console.error("Invalid token: Unable to decode", error);
      logout();
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUserId(null);
    setUserType(null);
    setIsLoggedIn(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
  };

  return (
    <AuthContext.Provider
      value={{ authToken, userId, userType, isLoggedIn, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
