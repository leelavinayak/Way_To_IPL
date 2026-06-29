import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.password) { toast.error('Please fill all required fields'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, mobile: form.mobile, password: form.password });
      navigate('/');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
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
            <h2 className="text-2xl font-bold font-display text-navyBlue">Create Account</h2>
            <p className="text-darkText/50 text-sm mt-1">Join IPL Travels today</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}><label className="input-label">Full Name</label><input type="text" placeholder="Enter your name" value={form.name} onChange={e => update('name', e.target.value)} className="input-field" /></motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}><label className="input-label">Email <span className="text-darkText/30 text-xs">(optional)</span></label><input type="email" placeholder="Enter your email" value={form.email} onChange={e => update('email', e.target.value)} className="input-field" /></motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}><label className="input-label">Mobile Number</label><input type="tel" placeholder="Enter mobile number" value={form.mobile} onChange={e => update('mobile', e.target.value)} className="input-field" /></motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}><label className="input-label">Password</label><input type="password" placeholder="Create a password" value={form.password} onChange={e => update('password', e.target.value)} className="input-field" /></motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}><label className="input-label">Confirm Password</label><input type="password" placeholder="Confirm password" value={form.confirm} onChange={e => update('confirm', e.target.value)} className="input-field" /></motion.div>
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full brand-button py-3 rounded-xl font-bold">
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-darkText/50 text-sm text-center mt-6">
            Already have an account? <Link to="/login" className="text-royalBlue hover:text-navyBlue font-medium">Sign In</Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
