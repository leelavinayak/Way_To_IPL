import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers({ page: pagination.page, limit: 20 });
      setUsers(data.users);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#0A2E5D' }}>Users</h1>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#0057B8' }}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#0057B8', borderTopColor: 'transparent' }} />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: '#666666' }}>No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#F5F7FA' }}>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Name</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Email</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Mobile</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Role</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Verified</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-t hover:bg-gray-50" style={{ borderColor: '#F5F7FA' }}>
                      <td className="py-3 px-4 font-medium" style={{ color: '#000000' }}>{u.name}</td>
                      <td className="py-3 px-4" style={{ color: '#000000' }}>{u.email || '—'}</td>
                      <td className="py-3 px-4" style={{ color: '#000000' }}>{u.mobile}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {u.isVerified ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs" style={{ color: '#666666' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#F5F7FA' }}>
                <span className="text-sm" style={{ color: '#666666' }}>Page {pagination.page} of {pagination.pages} ({pagination.total} total)</span>
                <div className="flex gap-2">
                  <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1} className="p-2 rounded-lg disabled:opacity-30" style={{ color: '#0057B8' }}>
                    <FiChevronLeft size={18} />
                  </button>
                  <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.pages} className="p-2 rounded-lg disabled:opacity-30" style={{ color: '#0057B8' }}>
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

export default AdminUsers;
