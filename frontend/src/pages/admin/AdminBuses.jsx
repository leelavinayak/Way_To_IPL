import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import { FiPlus, FiDownload, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const { data } = await adminAPI.getAllBuses();
      setBuses(data);
    } catch (err) {
      toast.error('Failed to load buses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bus? This will cancel all associated bookings.')) return;
    try {
      await adminAPI.deleteBus(id);
      toast.success('Bus deleted');
      fetchBuses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleDownload = (busId, busName) => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    const baseUrl = '/api/admin/buses';
    const url = `${baseUrl}/${busId}/bookings/export`;
    const link = document.createElement('a');
    link.href = `${window.location.origin}${url}`;
    link.setAttribute('download', '');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
      if (this.status === 200) {
        const blob = this.response;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${busName.replace(/\s+/g, '_')}_bookings.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        toast.error('Download failed');
      }
    };
    xhr.send();
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#0A2E5D' }}>Manage Buses</h1>
        <Link
          to="/admin/buses/add"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium text-sm"
          style={{ background: 'linear-gradient(135deg, #0057B8, #0A2E5D)' }}
        >
          <FiPlus size={16} /> Add Bus
        </Link>
      </div>

      {buses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border" style={{ borderColor: '#0057B8' }}>
          <p className="text-lg" style={{ color: '#666666' }}>No buses found</p>
          <Link to="/admin/buses/add" className="inline-block mt-3 text-sm font-medium" style={{ color: '#0057B8' }}>
            Add your first bus
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#0057B8' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#F5F7FA' }}>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Bus Name</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Type</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Route</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Departure</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Arrival</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Fare</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Seats</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Layout</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus) => (
                  <tr key={bus._id} className="border-t hover:bg-gray-50" style={{ borderColor: '#F5F7FA' }}>
                    <td className="py-3 px-4 font-medium" style={{ color: '#000000' }}>{bus.busName}</td>
                    <td className="py-3 px-4" style={{ color: '#000000' }}>{bus.busType}</td>
                    <td className="py-3 px-4" style={{ color: '#000000' }}>
                      {bus.route?.from} → {bus.route?.to}
                    </td>
                    <td className="py-3 px-4" style={{ color: '#000000' }}>{bus.departureTime}</td>
                    <td className="py-3 px-4" style={{ color: '#000000' }}>{bus.arrivalTime}</td>
                    <td className="py-3 px-4" style={{ color: '#000000' }}>₹{bus.fare}</td>
                    <td className="py-3 px-4" style={{ color: '#000000' }}>{bus.totalSeats}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium capitalize" style={{ background: '#F5F7FA', color: '#0057B8' }}>
                        {bus.layout}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(bus._id, bus.busName)}
                          className="p-2 rounded-lg hover:bg-blue-50 transition-all"
                          title="Download Bookings (Excel)"
                          style={{ color: '#0057B8' }}
                        >
                          <FiDownload size={16} />
                        </button>
                        <Link
                          to={`/admin/buses/edit/${bus._id}`}
                          className="p-2 rounded-lg hover:bg-blue-50 transition-all"
                          title="Edit Bus"
                          style={{ color: '#0057B8' }}
                        >
                          <FiEdit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(bus._id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-all"
                          title="Delete Bus"
                          style={{ color: '#dc2626' }}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBuses;
