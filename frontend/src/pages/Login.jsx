import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      await login(identifier, password);
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-lightGray flex items-center justify-center px-4">
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="relative z-10 w-full max-w-md">
        <div className="glass-dark p-8 rounded-2xl border border-gold/20 relative overflow-hidden">
          <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full" />
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="w-14 h-14 rounded-full brand-gradient flex items-center justify-center mx-auto mb-4 shadow-lg shadow-royalBlue/20">
              <span className="text-white font-bold text-xl">IPL</span>
            </motion.div>
            <h2 className="text-2xl font-bold font-display text-navyBlue">Welcome Back</h2>
            <p className="text-darkText/50 text-sm mt-1">Sign in to your IPL Travels account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="input-label">Email or Mobile</label>
              <input type="text" placeholder="Enter email or mobile number" value={identifier} onChange={e => setIdentifier(e.target.value)} className="input-field" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="input-label">Password</label>
              <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-end">
              <Link to="/forgot-password" className="text-royalBlue hover:text-navyBlue text-sm transition-colors">Forgot Password?</Link>
            </motion.div>
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full brand-button py-3 rounded-xl font-bold">
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-darkText/50 text-sm text-center mt-6">
            Don't have an account? <Link to="/register" className="text-royalBlue hover:text-navyBlue font-medium">Register</Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
