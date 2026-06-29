import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import SeatGridBuilder from '../../components/admin/SeatGridBuilder';
import toast from 'react-hot-toast';

const AddBus = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [companies, setCompanies] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    busName: '',
    busType: 'AC Seater',
    company: '',
    route: '',
    departureTime: '',
    arrivalTime: '',
    duration: '',
    fare: '',
    layout: 'seater',
    seatType: 'seater',
    amenities: '',
    busNumber: '',
  });

  const [seatData, setSeatData] = useState({ seatMap: [], totalSeats: 0, leftSeatCount: 0, rightSeatCount: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, routeRes] = await Promise.all([
          adminAPI.getCompanies(),
          adminAPI.getAdminRoutes(),
        ]);
        setCompanies(compRes.data);
        setRoutes(routeRes.data);
        if (isEdit) {
          const { data } = await adminAPI.getBusById(id);
          setForm({
            busName: data.busName || '',
            busType: data.busType || 'AC Seater',
            company: data.company?._id || data.company || '',
            route: data.route?._id || data.route || '',
            departureTime: data.departureTime || '',
            arrivalTime: data.arrivalTime || '',
            duration: data.duration || '',
            fare: data.fare || '',
            layout: data.layout || 'seater',
            seatType: data.seats?.[0]?.isSleeper ? 'sleeper' : 'seater',
            amenities: (data.amenities || []).join(', '),
            busNumber: data.busNumber || '',
          });
          if (data.seats?.length) {
            const leftCount = data.seats.filter(s => s.side === 'left').length;
            const rightCount = data.seats.filter(s => s.side === 'right').length;
            setSeatData({
              seatMap: data.seats.map(s => ({
                seatNumber: s.seatNumber,
                side: s.side || 'none',
                row: s.row || 0,
                col: s.col || 0,
                deck: s.deck || 'none',
              })),
              totalSeats: data.totalSeats,
              leftSeatCount: leftCount,
              rightSeatCount: rightCount,
            });
          }
        }
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSeatChange = (data) => {
    setSeatData(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.busName || !form.company || !form.route || !form.departureTime || !form.arrivalTime || !form.fare) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (seatData.seatMap.length === 0) {
      toast.error('Please configure the seat layout');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        fare: parseFloat(form.fare),
        amenities: form.amenities ? form.amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
        ...seatData,
      };

      if (isEdit) {
        await adminAPI.updateBus(id, payload);
        toast.success('Bus updated successfully');
      } else {
        await adminAPI.createBus(payload);
        toast.success('Bus created successfully');
      }
      navigate('/admin/buses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save bus');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#0057B8', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#0A2E5D' }}>{isEdit ? 'Edit Bus' : 'Add New Bus'}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: '#0057B8' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#0A2E5D' }}>Bus Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Bus Name *</label>
              <input name="busName" value={form.busName} onChange={handleChange} className="input-field" placeholder="e.g. Orange Express" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Bus Type *</label>
              <select name="busType" value={form.busType} onChange={handleChange} className="input-field">
                {['AC Seater', 'AC Sleeper', 'AC Semi-Sleeper', 'Non-AC Seater', 'Non-AC Sleeper', 'Double Decker', 'Volvo AC'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Company *</label>
              <select name="company" value={form.company} onChange={handleChange} className="input-field">
                <option value="">Select Company</option>
                {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Route *</label>
              <select name="route" value={form.route} onChange={handleChange} className="input-field">
                <option value="">Select Route</option>
                {routes.map(r => <option key={r._id} value={r._id}>{r.from} → {r.to}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Departure Time *</label>
              <input name="departureTime" value={form.departureTime} onChange={handleChange} className="input-field" placeholder="e.g. 22:30" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Arrival Time *</label>
              <input name="arrivalTime" value={form.arrivalTime} onChange={handleChange} className="input-field" placeholder="e.g. 06:30" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Duration</label>
              <input name="duration" value={form.duration} onChange={handleChange} className="input-field" placeholder="e.g. 8h 30m" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Fare per Seat (₹) *</label>
              <input name="fare" type="number" value={form.fare} onChange={handleChange} className="input-field" placeholder="e.g. 800" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Layout Type</label>
              <select name="layout" value={form.layout} onChange={handleChange} className="input-field">
                <option value="seater">Seater</option>
                <option value="sleeper">Sleeper</option>
                <option value="semi-sleeper">Semi-Sleeper</option>
                <option value="double-decker">Double Decker</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Seat Type</label>
              <select name="seatType" value={form.seatType} onChange={handleChange} className="input-field">
                <option value="seater">Seater</option>
                <option value="sleeper">Sleeper</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Amenities (comma separated)</label>
              <input name="amenities" value={form.amenities} onChange={handleChange} className="input-field" placeholder="WiFi, Charging Point, Blanket" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: '#0057B8' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#0A2E5D' }}>Seat Layout Builder</h2>
          <p className="text-sm mb-4" style={{ color: '#666666' }}>
            Configure the seat grid below. Click a cell to toggle seat/aisle. For sleeper seats, double-click to toggle lower/upper deck.
          </p>
          <SeatGridBuilder seatType={form.seatType} onChange={handleSeatChange} />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #0057B8, #0A2E5D)' }}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Bus' : 'Create Bus'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/buses')}
            className="px-6 py-3 rounded-xl font-semibold text-sm border"
            style={{ borderColor: '#0057B8', color: '#0057B8' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBus;
