import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { FiTrash2, FiChevronLeft, FiChevronRight, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, [pagination.page]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getContacts({ page: pagination.page, limit: 20 });
      setContacts(data.contacts);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await adminAPI.deleteContact(id);
      toast.success('Message deleted');
      if (selected?._id === id) setSelected(null);
      fetchContacts();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#0A2E5D' }}>Contact Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#0057B8' }}>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#0057B8', borderTopColor: 'transparent' }} />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-16">
              <p style={{ color: '#666666' }}>No messages yet</p>
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
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Date</th>
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c) => (
                      <tr
                        key={c._id}
                        className={`border-t hover:bg-gray-50 cursor-pointer ${selected?._id === c._id ? 'bg-blue-50' : ''}`}
                        style={{ borderColor: '#F5F7FA' }}
                        onClick={() => setSelected(c)}
                      >
                        <td className="py-3 px-4 font-medium" style={{ color: '#000000' }}>{c.name}</td>
                        <td className="py-3 px-4" style={{ color: '#000000' }}>{c.email}</td>
                        <td className="py-3 px-4" style={{ color: '#000000' }}>{c.mobile}</td>
                        <td className="py-3 px-4 text-xs" style={{ color: '#666666' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(c._id); }} className="p-2 rounded-lg hover:bg-red-50" style={{ color: '#dc2626' }}>
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.pages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#F5F7FA' }}>
                  <span className="text-sm" style={{ color: '#666666' }}>Page {pagination.page} of {pagination.pages}</span>
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

        <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: '#0057B8' }}>
          {selected ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg" style={{ background: '#F5F7FA', color: '#0057B8' }}>
                  <FiMail size={20} />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: '#000000' }}>{selected.name}</h3>
                  <p className="text-xs" style={{ color: '#666666' }}>{selected.email} · {selected.mobile}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#000000' }}>{selected.message}</p>
              <p className="text-xs mt-4" style={{ color: '#666666' }}>
                Received: {new Date(selected.createdAt).toLocaleString()}
              </p>
              <button
                onClick={() => handleDelete(selected._id)}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border"
                style={{ borderColor: '#dc2626', color: '#dc2626' }}
              >
                <FiTrash2 size={14} /> Delete
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <FiMail size={32} className="mx-auto mb-2" style={{ color: '#ccc' }} />
              <p style={{ color: '#666666' }}>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;
