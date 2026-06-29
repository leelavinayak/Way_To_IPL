import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUser, HiTicket, HiClock, HiDownload, HiPencil, HiCheck, HiX, HiLockClosed } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, sendMobileOTP, resetPasswordWithOTP } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'profile');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '', address: '' });
  const [passwordForm, setPasswordForm] = useState({ mobile: '', newPass: '', confirm: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', mobile: user.mobile || '', address: user.address || '' });
  }, [user]);

  useEffect(() => {
    if (tab === 'history') fetchBookings();
    setSearchParams(tab === 'profile' ? {} : { tab });
  }, [tab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await bookingAPI.getAll();
      setBookings(data);
    } catch { toast.error('Error loading bookings'); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      setEditing(false);
      toast.success('Profile updated');
    } catch { toast.error('Error updating profile'); }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.cancel(bookingId, { reason: 'Cancelled by user' });
      toast.success('Booking cancelled');
      fetchBookings();
    } catch { toast.error('Error cancelling booking'); }
  };

  const downloadTicket = async (bookingId) => {
    try {
      const res = await bookingAPI.downloadTicket(bookingId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = `ticket-${bookingId}.pdf`; a.click();
      window.URL.revokeObjectURL(url);
    } catch { toast.error('Error downloading ticket'); }
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-500/15 text-green-600 border-green-500/30',
      pending: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30',
      cancelled: 'bg-red-500/15 text-red-500 border-red-500/30',
      completed: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>{status}</span>;
  };

  const handleSendOtp = async () => {
    if (!passwordForm.mobile) { toast.error('Please enter your mobile number'); return; }
    setSendingOtp(true);
    try {
      await sendMobileOTP(passwordForm.mobile);
      setOtpSent(true);
    } catch (err) { toast.error(err.response?.data?.message || 'Error sending OTP'); }
    finally { setSendingOtp(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!otp) { toast.error('Please enter OTP'); return; }
    if (!passwordForm.newPass || !passwordForm.confirm) { toast.error('Please fill all fields'); return; }
    if (passwordForm.newPass !== passwordForm.confirm) { toast.error('New passwords do not match'); return; }
    if (passwordForm.newPass.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setChangingPassword(true);
    try {
      await resetPasswordWithOTP(passwordForm.mobile, otp, passwordForm.newPass);
      setPasswordForm({ mobile: '', newPass: '', confirm: '' });
      setOtp('');
      setOtpSent(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Error changing password'); }
    finally { setChangingPassword(false); }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: HiUser },
    { id: 'history', label: 'Booking History', icon: HiTicket },
    { id: 'security', label: 'Change Password', icon: HiLockClosed },
  ];

  if (!user) return null;

  return (
    <div className="bg-lightGray py-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 rounded-full brand-gradient flex items-center justify-center mx-auto mb-4 shadow-lg shadow-royalBlue/20">
            <HiUser size="28" className="text-white" />
          </div>
          <h1 className="text-3xl font-bold font-display text-navyBlue">My Account</h1>
          <p className="text-darkText/50 text-sm mt-1">Manage your profile and bookings</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 justify-start sm:justify-center scrollbar-hide">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? 'brand-button text-white shadow-lg shadow-royalBlue/20' : 'glass text-darkText/60 hover:text-darkText'}`}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="glass-dark rounded-2xl border border-gold/20 overflow-hidden">
              <div className="bg-gradient-to-r from-royalBlue/10 to-navyBlue/10 p-6 sm:p-8 border-b border-gold/10">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="w-20 h-20 rounded-full brand-gradient flex items-center justify-center shadow-lg shadow-royalBlue/30">
                    <span className="text-3xl font-bold text-white">{user.name?.[0]?.toUpperCase()}</span>
                  </motion.div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold font-display text-navyBlue">{user.name}</h2>
                    <p className="text-darkText/50 text-sm">{user.email}</p>
                    <p className="text-darkText/30 text-xs mt-1">Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {editing ? (
                  <form onSubmit={handleUpdate} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="input-label">Full Name</label>
                        <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" />
                      </div>
                      <div>
                        <label className="input-label">Mobile Number</label>
                        <input type="tel" value={form.mobile} onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))} className="input-field" />
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Address</label>
                      <textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="input-field" rows={3} />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button type="submit" className="brand-button px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2">
                        <HiCheck size={16} /> Save Changes
                      </button>
                      <button type="button" onClick={() => setEditing(false)} className="glass px-6 py-2.5 rounded-xl font-medium text-darkText flex items-center justify-center gap-2">
                        <HiX size={16} /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="glass p-4 rounded-xl">
                        <p className="text-darkText/40 text-xs uppercase tracking-wider mb-1">Mobile</p>
                        <p className="text-darkText font-medium">{user.mobile}</p>
                      </div>
                      <div className="glass p-4 rounded-xl">
                        <p className="text-darkText/40 text-xs uppercase tracking-wider mb-1">Email</p>
                        <p className="text-darkText font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="glass p-4 rounded-xl">
                      <p className="text-darkText/40 text-xs uppercase tracking-wider mb-1">Address</p>
                      <p className="text-darkText font-medium">{user.address || 'Not set'}</p>
                    </div>
                    <button onClick={() => setEditing(true)} className="brand-button px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center sm:justify-start gap-2 mt-2 w-full sm:w-auto">
                      <HiPencil size={16} /> Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'security' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="glass-dark rounded-2xl border border-gold/20 overflow-hidden">
              <div className="bg-gradient-to-r from-royalBlue/10 to-navyBlue/10 p-6 sm:p-8 border-b border-gold/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-royalBlue/20 flex items-center justify-center">
                    <HiLockClosed size={24} className="text-royalBlue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display text-navyBlue">Change Password</h2>
                    <p className="text-darkText/50 text-sm">Update your account password</p>
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <form onSubmit={handleChangePassword} className="max-w-xl space-y-5">
                  <div className="sm:flex sm:gap-4 sm:items-end">
                    <div className="flex-1">
                      <label className="input-label">Mobile Number</label>
                      <input type="tel" placeholder="Enter your mobile number" value={passwordForm.mobile} onChange={e => setPasswordForm(p => ({ ...p, mobile: e.target.value }))} className="input-field w-full" disabled={otpSent} />
                    </div>
                    <div className="mt-3 sm:mt-0">
                      {!otpSent ? (
                        <button type="button" onClick={handleSendOtp} disabled={sendingOtp} className="brand-button px-6 py-2.5 rounded-xl text-sm font-semibold w-full sm:w-auto">
                          {sendingOtp ? 'Sending...' : 'Send OTP'}
                        </button>
                      ) : (
                        <button type="button" onClick={() => { setOtpSent(false); setOtp(''); }} className="glass px-6 py-2.5 rounded-xl text-sm font-medium w-full sm:w-auto text-darkText">
                          Change
                        </button>
                      )}
                    </div>
                  </div>
                  {otpSent && (
                    <>
                      <div>
                        <label className="input-label">Enter OTP</label>
                        <input type="text" placeholder="Enter OTP sent to your mobile" value={otp} onChange={e => setOtp(e.target.value)} className="input-field max-w-[200px]" maxLength={6} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="input-label">New Password</label>
                          <input type="password" placeholder="Enter new password" value={passwordForm.newPass} onChange={e => setPasswordForm(p => ({ ...p, newPass: e.target.value }))} className="input-field w-full" />
                        </div>
                        <div>
                          <label className="input-label">Confirm New Password</label>
                          <input type="password" placeholder="Confirm new password" value={passwordForm.confirm} onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))} className="input-field w-full" />
                        </div>
                      </div>
                      <button type="submit" disabled={changingPassword} className="brand-button px-8 py-2.5 rounded-xl font-semibold w-full sm:w-auto">
                        {changingPassword ? 'Updating...' : 'Change Password'}
                      </button>
                    </>
                  )}
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'history' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-display text-navyBlue">Booking History</h2>
              <button onClick={fetchBookings} className="glass px-4 py-2 rounded-xl text-sm text-darkText hover:text-darkText transition-all">Refresh</button>
            </div>
            {loading ? (
              <div className="text-center py-16">
                <div className="w-10 h-10 rounded-full border-2 border-gold/30 border-t-gold animate-spin mx-auto mb-4" />
                <p className="text-darkText/50 text-sm">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="glass-dark p-16 text-center rounded-2xl border border-gold/10">
                <HiTicket size={56} className="text-darkText/20 mx-auto mb-4" />
                <p className="text-darkText/50 mb-1">No bookings yet</p>
                <p className="text-darkText/30 text-sm">Your booking history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b, i) => (
                  <motion.div key={b._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="glass-card p-5 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-darkText font-mono text-xs bg-royalBlue/10 px-2 py-0.5 rounded">{b.bookingId}</span>
                          {getStatusBadge(b.status)}
                        </div>
                        <p className="text-darkText font-semibold text-base">{b.bus?.busName || 'Bus'}</p>
                        <p className="text-darkText/50 text-sm">{b.from} → {b.to}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-navyBlue">₹{b.totalFare}</p>
                        <p className="text-xs text-darkText/30">{new Date(b.journeyDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm border-t border-royalBlue/8 pt-3">
                      <span className="text-darkText/50 flex items-center gap-1"><HiClock size={14} /> {b.bus?.departureTime || 'N/A'}</span>
                      <span className="text-darkText/50">Seats: {b.seats?.join(', ')}</span>
                      {b.status === 'confirmed' && (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto sm:ml-auto mt-2 sm:mt-0">
                          <button onClick={() => downloadTicket(b.bookingId)} className="text-royalBlue hover:text-navyBlue flex items-center justify-center gap-1 text-xs font-medium transition-all border border-royalBlue/20 rounded-lg px-3 py-2">
                            <HiDownload size={14} /> Download Ticket
                          </button>
                          <button onClick={() => cancelBooking(b.bookingId)} className="text-red-400 hover:text-red-500 text-xs font-medium transition-all border border-red-300/30 rounded-lg px-3 py-2 text-center">
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;
