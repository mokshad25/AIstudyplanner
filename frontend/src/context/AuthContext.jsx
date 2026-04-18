import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      console.log("Attempting login for:", email);
      const formData = new URLSearchParams();
      formData.append('username', email); // FastAPI OAuth2 expects username
      formData.append('password', password);

      const res = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      const newToken = res.data.access_token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      return true;
    } catch (err) {
      console.error("Login failed in context:", err.response?.data || err);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log("Attempting registration for:", { name, email, password: "***" });
      const res = await api.post('/auth/register', { name, email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("Registration successful", res.data);
      return await login(email, password);
    } catch (err) {
      console.error("Registration failed in context:", err.response?.data || err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    // In a real app we might fetch user details here
    setLoading(false);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, loading }}>
        {!loading && children}
    </AuthContext.Provider>
  );
};
