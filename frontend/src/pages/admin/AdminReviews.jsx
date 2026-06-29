import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { FiTrash2, FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  useEffect(() => {
    fetchReviews();
  }, [pagination.page]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getReviews({ page: pagination.page, limit: 20 });
      setReviews(data.reviews);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await adminAPI.deleteReview(id);
      toast.success('Review deleted');
      fetchReviews();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar key={i} size={14} fill={i < rating ? '#F4B400' : 'none'} stroke={i < rating ? '#F4B400' : '#ccc'} />
    ));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#0A2E5D' }}>Reviews</h1>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#0057B8' }}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#0057B8', borderTopColor: 'transparent' }} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: '#666666' }}>No reviews yet</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#F5F7FA' }}>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>User</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Bus</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Rating</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Comment</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Date</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#000000' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => (
                    <tr key={r._id} className="border-t hover:bg-gray-50" style={{ borderColor: '#F5F7FA' }}>
                      <td className="py-3 px-4" style={{ color: '#000000' }}>{r.user?.name || 'Anonymous'}</td>
                      <td className="py-3 px-4" style={{ color: '#000000' }}>{r.bus?.busName || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-0.5">{renderStars(r.rating)}</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate" style={{ color: '#000000' }}>{r.comment}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: '#666666' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleDelete(r._id)} className="p-2 rounded-lg hover:bg-red-50" style={{ color: '#dc2626' }}>
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
    </div>
  );
};

export default AdminReviews;
