import { NavLink } from 'react-router-dom';
import { FiGrid, FiTruck, FiBookOpen, FiUsers, FiStar, FiMail, FiLogOut } from 'react-icons/fi';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/admin/buses', label: 'Manage Buses', icon: FiTruck },
  { to: '/admin/buses/add', label: 'Add Bus', icon: FiTruck },
  { to: '/admin/bookings', label: 'Bookings', icon: FiBookOpen },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/reviews', label: 'Reviews', icon: FiStar },
  { to: '/admin/contacts', label: 'Contacts', icon: FiMail },
];

const AdminSidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: '#0A2E5D' }}>
      <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <h2 className="text-white text-xl font-bold">IPL Admin</h2>
        <p className="text-sm mt-1" style={{ color: '#F4B400' }}>Bus Booking Portal</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`
            }
            style={({ isActive }) => isActive ? { background: '#0057B8' } : {}}
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 w-full transition-all"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
