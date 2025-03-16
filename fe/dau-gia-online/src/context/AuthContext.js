import React, { createContext, useContext, useState } from 'react';
import { setToken, getToken, removeToken, setEmail } from '../service/AuthService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(getToken());


  const login = (token) => {
    const decodeToken = jwtDecode(token)
    console.log(decodeToken);
    const { sub } = decodeToken;
    setToken(token);
    setAuthToken(token);
    setEmail(sub)
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem("email");
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
