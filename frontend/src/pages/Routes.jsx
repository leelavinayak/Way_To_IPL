import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiClock, HiLocationMarker, HiArrowRight } from 'react-icons/hi';
import { busAPI } from '../utils/api';
import toast from 'react-hot-toast';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-50px' }, transition: { duration: 0.6 } };

const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const Routes = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const companies = [
    { name: 'APSRTC', color: '#ff6b35' },
    { name: 'Orange Travels', color: '#ff8c00' },
    { name: 'Kaveri Travels', color: '#1a5276' },
    { name: 'VRL Travels', color: '#e74c3c' },
    { name: 'SRS Travels', color: '#2ecc71' },
    { name: 'Morning Star', color: '#f39c12' },
    { name: 'IntrCity', color: '#9b59b6' },
  ];

  const images = [
    { src: '/Bangalore_to_Chennai.png', alt: 'Bangalore to Chennai' },
    { src: '/Chennai_to_Bangalore.png', alt: 'Chennai to Bangalore' },
    { src: '/Hyderabad_to_Chennai.png', alt: 'Hyderabad to Chennai' },
    { src: '/Chennai_to_Hyderabad.png', alt: 'Chennai to Hyderabad' },
    { src: '/Bangalore_to_Tirupati.png', alt: 'Bangalore to Tirupati' },
    { src: '/Chennai_to_Tirupati.png', alt: 'Chennai to Tirupati' },
    { src: '/Tirupati_to_Bangalore.png', alt: 'Tirupati to Bangalore' },
    { src: '/Tirupati_to_Chennai.png', alt: 'Tirupati to Chennai' },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!from || !to) { toast.error('Please enter both locations'); return; }
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await busAPI.search({ from, to, date });
      setBuses(data.buses || []);
    } catch { toast.error('Error searching buses'); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-lightGray min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-gold/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-darkText/80 text-xs font-semibold tracking-wide uppercase">Routes</span>
          </div> */}
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-darkText mb-4">All Routes</h2>
          <p className="text-darkText/60 max-w-2xl mx-auto">Browse all available routes</p>
        </motion.div>

        {/* Search Form */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-royalBlue/20 shadow-2xl shadow-royalBlue/15">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[120px]">
                <label className="input-label">From</label>
                <input type="text" placeholder="Enter departure city" value={from} onChange={(e) => setFrom(e.target.value)} className="input-field" list="cities" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="input-label">To</label>
                <input type="text" placeholder="Enter destination city" value={to} onChange={(e) => setTo(e.target.value)} className="input-field" list="cities" />
              </div>
              <div className="w-full sm:w-48">
                <label className="input-label">Journey Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <datalist id="cities">
              {['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Pune', 'Vijayawada', 'Jaipur', 'Agra', 'Kolkata'].map(c => <option key={c} value={c} />)}
            </datalist>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="mt-4 w-full brand-button py-3 rounded-xl text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-royalBlue/30">
              <HiSearch size={20} /> Search Buses
            </motion.button>
          </form>
        </motion.div>

        {/* Search Results */}
        {searched && (
          <section className="mb-16">
            {loading ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-full border-2 border-darkText/30 border-t-royalBlue animate-spin mx-auto mb-4" />
                <p className="text-darkText/60">Searching buses...</p>
              </div>
            ) : buses.length > 0 ? (
              <>
                <motion.div {...fadeUp} className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-darkText">
                    Available Buses <span className="text-darkText/60 text-lg font-normal">({buses.length} found)</span>
                  </h2>
                </motion.div>
                <div className="grid gap-4">
                  {buses.map((bus, i) => (
                    <motion.div key={bus._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: companies.find(c => bus.company?.name?.includes(c.name))?.color || '#D4A373' }}>
                            {getInitials(bus.busName)}
                          </div>
                          <div>
                            <h3 className="text-darkText font-semibold">{bus.busName}</h3>
                            <p className="text-darkText/50 text-sm">{bus.busType} • {bus.company?.name}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 sm:gap-8 text-sm">
                          <div><p className="text-darkText/40">Departure</p><p className="text-darkText font-semibold">{bus.departureTime}</p></div>
                          <div><p className="text-darkText/40">Arrival</p><p className="text-darkText font-semibold">{bus.arrivalTime}</p></div>
                          <div><p className="text-darkText/40">Duration</p><p className="text-darkText font-semibold">{bus.duration}</p></div>
                          <div><p className="text-darkText/40">Seats</p><p className="text-darkText font-semibold">{bus.availableSeats} left</p></div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                        <p className="text-2xl font-bold text-darkText">₹{bus.fare}</p>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(`/booking?bus=${bus._id}&from=${from}&to=${to}&date=${date}`)} className="brand-button px-6 py-2 rounded-xl text-sm font-semibold w-full sm:w-auto">
                          View Seats
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <motion.div {...fadeUp} className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-gold/20 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span className="text-darkText/80 text-xs font-semibold tracking-wide uppercase">Coming Soon</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-darkText">This route is coming soon</h3>
                <p className="text-darkText/50 mt-2">We are working on adding buses for this route.</p>
              </motion.div>
            )}
          </section>
        )}

        {/* Route Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <img src={img.src} alt={img.alt} className="w-full h-auto object-cover" />
              <div className="p-4 text-center border-t border-gray-100">
                <span className="text-sm font-semibold text-darkText/50 uppercase tracking-wider">Coming Soon</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Routes;
