import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import { FiUsers, FiStar, FiMail, FiBookOpen, FiArrowRight } from 'react-icons/fi';

const DashboardCard = ({ title, value, icon: Icon, color, link }) => (
  <Link
    to={link}
    className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all group"
    style={{ borderColor: '#0057B8' }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium" style={{ color: '#666666' }}>{title}</p>
        <p className="text-3xl font-bold mt-1" style={{ color: '#000000' }}>{value}</p>
      </div>
      <div className="p-3 rounded-xl" style={{ background: color }}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    <div className="flex items-center gap-1 mt-4 text-sm font-medium" style={{ color: '#0057B8' }}>
      View details <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await adminAPI.getDashboardStats();
      setStats(data.stats);
      setRecentBookings(data.recentBookings || []);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#0057B8', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#0A2E5D' }}>Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={FiUsers}
          color="#0057B8"
          link="/admin/users"
        />
        <DashboardCard
          title="Total Reviews"
          value={stats?.totalReviews || 0}
          icon={FiStar}
          color="#F4B400"
          link="/admin/reviews"
        />
        <DashboardCard
          title="Contact Messages"
          value={stats?.totalContacts || 0}
          icon={FiMail}
          color="#0A2E5D"
          link="/admin/contacts"
        />
        <DashboardCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon={FiBookOpen}
          color="#0057B8"
          link="/admin/bookings"
        />
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: '#0057B8' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: '#0A2E5D' }}>Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-sm font-medium" style={{ color: '#0057B8' }}>
            View All
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="text-center py-8" style={{ color: '#666666' }}>No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: '#0057B8' }}>
                  <th className="text-left py-3 px-2 font-semibold" style={{ color: '#000000' }}>Booking ID</th>
                  <th className="text-left py-3 px-2 font-semibold" style={{ color: '#000000' }}>Bus</th>
                  <th className="text-left py-3 px-2 font-semibold" style={{ color: '#000000' }}>Passenger</th>
                  <th className="text-left py-3 px-2 font-semibold" style={{ color: '#000000' }}>Amount</th>
                  <th className="text-left py-3 px-2 font-semibold" style={{ color: '#000000' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b._id} className="border-b" style={{ borderColor: '#F5F7FA' }}>
                    <td className="py-3 px-2" style={{ color: '#000000' }}>{b.bookingId}</td>
                    <td className="py-3 px-2" style={{ color: '#000000' }}>{b.bus?.busName || 'N/A'}</td>
                    <td className="py-3 px-2" style={{ color: '#000000' }}>{b.user?.name || b.contactMobile}</td>
                    <td className="py-3 px-2" style={{ color: '#000000' }}>₹{b.totalFare}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        b.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
