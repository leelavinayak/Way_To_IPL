import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      toast.success('OTP sent to your email');
      setStep(1);
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.verifyOTP({ email, otp });
      toast.success('OTP verified');
      setStep(2);
    } catch (err) { toast.error('Invalid OTP'); }
    finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be 6+ characters'); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword({ email, otp, password });
      toast.success('Password reset successful!');
      setStep(3);
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
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
            <h2 className="text-2xl font-bold font-display text-navyBlue">Reset Password</h2>
            <p className="text-darkText/50 text-sm mt-1">
              {step === 0 && 'Enter your email to receive OTP'}
              {step === 1 && 'Enter the OTP sent to your email'}
              {step === 2 && 'Enter your new password'}
              {step === 3 && 'Password reset successful!'}
            </p>
          </div>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.form key="step0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSendOTP} className="space-y-4">
                <div><label className="input-label">Email</label><input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" /></div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full brand-button py-3 rounded-xl font-bold">{loading ? 'Sending...' : 'Send OTP'}</motion.button>
              </motion.form>
            )}
            {step === 1 && (
              <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleVerify} className="space-y-4">
                <div><label className="input-label">OTP</label><input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} className="input-field" maxLength={6} /></div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full brand-button py-3 rounded-xl font-bold">{loading ? 'Verifying...' : 'Verify OTP'}</motion.button>
              </motion.form>
            )}
            {step === 2 && (
              <motion.form key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleReset} className="space-y-4">
                <div><label className="input-label">New Password</label><input type="password" placeholder="Enter new password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" /></div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full brand-button py-3 rounded-xl font-bold">{loading ? 'Resetting...' : 'Reset Password'}</motion.button>
              </motion.form>
            )}
          </AnimatePresence>
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <Link to="/login" className="brand-button px-8 py-3 rounded-xl font-bold inline-block">Go to Login</Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
