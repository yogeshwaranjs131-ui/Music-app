import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Token-ஐ API Headers-ல் சேர்க்கிறோம்
        api.defaults.headers.common['x-auth-token'] = token;
        try {
          const res = await api.get('/api/auth/user');
          setUser(res.data);
        } catch (err) {
          console.error("Auth check failed", err);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['x-auth-token'];
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        // Login ஆனவுடன் Token-ஐ Headers-ல் இணைக்கிறோம்
        api.defaults.headers.common['x-auth-token'] = res.data.token;
        // Backend இப்போது பயனர் தகவலையும் அனுப்புவதால், அதை நேரடியாகப் பயன்படுத்துகிறோம்
        setUser(res.data.user);
        console.log(res.data.message || "Login successful");
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['x-auth-token'];
    setUser(null);
  };

  // Register-க்குப் பிறகு டோக்கன் மற்றும் பயனரைப் பெற இந்த செயல்பாடு உதவும்
  const setAuthData = (token, userData) => {
    localStorage.setItem('token', token);
    api.defaults.headers.common['x-auth-token'] = token;
    setUser(userData);
    console.log("Auth data set directly.");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};