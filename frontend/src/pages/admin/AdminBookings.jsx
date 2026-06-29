import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({ bus: '', status: '', startDate: '', endDate: '' });

  useEffect(() => {
    fetchBuses();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [pagination.page]);

  const fetchBuses = async () => {
    try {
      const { data } = await adminAPI.getAllBuses();
      setBuses(data);
    } catch { /* ignore */ }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: 20 };
      if (filters.bus) params.bus = filters.bus;
      if (filters.status) params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const { data } = await adminAPI.getBookings(params);
      setBookings(data.bookings);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchBookings();
  };

  const handleDownloadAll = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    let url = '/api/admin/bookings/export';
    const params = new URLSearchParams();
    if (filters.bus) params.set('bus', filters.bus);
    if (filters.status) params.set('status', filters.status);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    const qs = params.toString();
    if (qs) url += `?${qs}`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (this.status === 200) {
        const blob = this.response;
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = `bookings_export.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        toast.error('Export failed');
      }
    };
    xhr.send();
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminAPI.updateBookingStatus(id, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#0A2E5D' }}>Bookings</h1>
        <button
          onClick={handleDownloadAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium text-sm"
          style={{ background: 'linear-gradient(135deg, #0057B8, #0A2E5D)' }}
        >
          <FiDownload size={16} /> Export All
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border mb-4" style={{ borderColor: '#0057B8' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            value={filters.bus}
            onChange={(e) => setFilters({ ...filters, bus: e.target.value })}
            className="input-field"
          >
            <option value="">All Buses</option>
            {buses.map(b => <option key={b._id} value={b._id}>{b.busName} ({b.route?.from}→{b.route?.to})</option>)}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-field"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} className="input-field" />
          <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} className="input-field" />
          <button onClick={handleFilter} className="px-4 py-2 rounded-xl text-white font-medium text-sm" style={{ background: 'linear-gradient(135deg, #0057B8, #0A2E5D)' }}>
            Apply Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#0057B8' }}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#0057B8', borderTopColor: 'transparent' }} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: '#666666' }}>No bookings found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#F5F7FA' }}>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Booking ID</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Bus</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Passenger</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Seats</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Amount</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Journey</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Status</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-t hover:bg-gray-50" style={{ borderColor: '#F5F7FA' }}>
                      <td className="py-3 px-4 font-mono text-xs" style={{ color: '#000000' }}>{b.bookingId}</td>
                      <td className="py-3 px-4" style={{ color: '#000000' }}>{b.bus?.busName || 'N/A'}</td>
                      <td className="py-3 px-4" style={{ color: '#000000' }}>{b.user?.name || b.contactMobile}</td>
                      <td className="py-3 px-4" style={{ color: '#000000' }}>{b.seats?.join(', ')}</td>
                      <td className="py-3 px-4" style={{ color: '#000000' }}>₹{b.totalFare}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: '#666666' }}>{new Date(b.journeyDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusUpdate(b._id, e.target.value)}
                          className="text-xs border rounded-lg px-2 py-1"
                          style={{ borderColor: '#0057B8', color: '#000000' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirm</option>
                          <option value="cancelled">Cancel</option>
                          <option value="completed">Complete</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#F5F7FA' }}>
                <span className="text-sm" style={{ color: '#666666' }}>
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                    disabled={pagination.page <= 1}
                    className="p-2 rounded-lg disabled:opacity-30"
                    style={{ color: '#0057B8' }}
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                    disabled={pagination.page >= pagination.pages}
                    className="p-2 rounded-lg disabled:opacity-30"
                    style={{ color: '#0057B8' }}
                  >
                    <FiChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
