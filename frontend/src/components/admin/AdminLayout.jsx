import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { FiMenu, FiX } from 'react-icons/fi';
import { adminAPI } from '../../utils/api';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    const verify = async () => {
      try {
        const { data } = await adminAPI.getProfile();
        if (data.role !== 'admin') {
          throw new Error('Not admin');
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, [navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F7FA' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#0057B8', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#F5F7FA' }}>
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-50" onClick={(e) => e.stopPropagation()}>
            <AdminSidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm" style={{ borderColor: '#0057B8' }}>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <FiMenu size={24} style={{ color: '#0A2E5D' }} />
          </button>
          <h1 className="text-lg font-bold" style={{ color: '#0A2E5D' }}>IPL Admin</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
