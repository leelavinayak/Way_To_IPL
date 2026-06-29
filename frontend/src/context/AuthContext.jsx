import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchProfile = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await authAPI.getProfile();
      setUser(data);
    } catch { setUser(null); localStorage.removeItem('token'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    toast.success('Welcome back!');
    return data;
  };

  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    toast.success('Account created successfully!');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData) => {
    const { data } = await authAPI.updateProfile(userData);
    setUser(data);
    toast.success('Profile updated!');
    return data;
  };

  const sendMobileOTP = async (mobile) => {
    const { data } = await authAPI.sendMobileOTP({ mobile });
    toast.success('OTP sent to your mobile');
    return data;
  };

  const resetPasswordWithOTP = async (mobile, otp, newPassword) => {
    const { data } = await authAPI.resetPasswordWithOTP({ mobile, otp, newPassword });
    toast.success('Password changed successfully!');
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, register, logout, updateProfile, sendMobileOTP, resetPasswordWithOTP }}>
      {children}
    </AuthContext.Provider>
  );
};
