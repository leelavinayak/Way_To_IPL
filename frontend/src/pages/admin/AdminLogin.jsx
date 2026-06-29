import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await adminAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('adminToken', data.token);
      toast.success('Welcome Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A2E5D 0%, #0057B8 100%)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#0A2E5D' }}>Admin Portal</h1>
          <p className="mt-2" style={{ color: '#000000' }}>Sign in to manage your bus operations</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Email / Mobile</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-black focus:outline-none focus:ring-2"
              style={{ borderColor: '#0057B8', background: '#F5F7FA', color: '#000000' }}
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-black focus:outline-none focus:ring-2"
              style={{ borderColor: '#0057B8', background: '#F5F7FA', color: '#000000' }}
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-lg transition-all hover:shadow-lg disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #0057B8, #0A2E5D)' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center mt-6 text-sm" style={{ color: '#666666' }}>
          Only authorized administrators can access this portal.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
