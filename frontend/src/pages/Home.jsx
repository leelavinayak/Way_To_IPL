import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiArrowRight, HiShieldCheck, HiStar, HiClock, HiEmojiHappy, HiTrash, HiLocationMarker, HiDeviceMobile, HiSupport, HiTicket, HiCash, HiUserGroup, HiBadgeCheck, HiShieldExclamation } from 'react-icons/hi';
import { busAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const companies = [
  { name: 'APSRTC', color: '#ff6b35', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&q=80' },
  { name: 'Orange Travels', color: '#ff8c00', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=300&q=80' },
  { name: 'Kaveri Travels', color: '#1a5276', image: 'https://images.unsplash.com/photo-1592318340236-0b31f6ee2b0c?w=300&q=80' },
  { name: 'VRL Travels', color: '#e74c3c', image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=300&q=80' },
  { name: 'SRS Travels', color: '#2ecc71', image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=300&q=80' },
  { name: 'Morning Star', color: '#f39c12', image: 'https://images.unsplash.com/photo-1570125909519-53cb202c3784?w=300&q=80' },
  { name: 'IntrCity', color: '#9b59b6', image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=300&q=80' },
];

const stats = [
  { icon: HiStar, value: '4.8', label: 'Rating' },
  { icon: HiShieldCheck, value: '10K+', label: 'Safe Trips' },
  { icon: HiEmojiHappy, value: '50K+', label: 'Happy Customers' },
  { icon: HiClock, value: '5+ Years', label: 'Service' },
];

const steps = [
  { icon: HiSearch, title: 'Search Routes', desc: 'Enter your departure and destination cities with your travel date to find available buses.' },
  { icon: HiTicket, title: 'Select & Compare', desc: 'Browse through buses, compare prices, amenities, and pick the best option for your journey.' },
  { icon: HiUserGroup, title: 'Add Passengers', desc: 'Enter passenger details and choose your preferred seats from the available layout.' },
  { icon: HiCash, title: 'Pay & Travel', desc: 'Complete secure payment via UPI, card, or wallet and get instant confirmation.' },
];

const features = [
  { icon: HiShieldCheck, title: 'Safe & Hygienic', desc: 'Regularly sanitized buses with mandatory hygiene protocols for your safety.' },
  { icon: HiSupport, title: '24/7 Customer Support', desc: 'Round-the-clock assistance for bookings, cancellations, and travel queries.' },
  { icon: HiBadgeCheck, title: 'Verified Operators', desc: 'All bus operators are thoroughly verified for quality and reliability.' },
  { icon: HiDeviceMobile, title: 'Easy Booking', desc: 'Book your tickets in minutes with our simple and intuitive platform.' },
  { icon: HiArrowRight, title: 'Free Cancellation', desc: 'Flexible cancellation policy with free cancellation up to 24 hours before departure.' },
  { icon: HiLocationMarker, title: 'GPS Tracking', desc: 'Real-time bus tracking so you know exactly when to arrive at the boarding point.' },
];

const destinations = [
  { from: 'Hyderabad', to: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&q=80' },
  { from: 'Hyderabad', to: 'Chennai', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80' },
  { from: 'Bangalore', to: 'Mumbai', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&q=80' },
  { from: 'Delhi', to: 'Jaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80' },
  { from: 'Chennai', to: 'Hyderabad', image: 'https://images.unsplash.com/photo-1617509374426-8a09aa510339?w=400&q=80' },
  { from: 'Mumbai', to: 'Pune', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80' },
];

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-50px' }, transition: { duration: 0.6 } };
const staggerItem = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4 } };
const staggerContainer = { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { staggerChildren: 0.1 } };

const Home = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('ipl_reviews') || '[]');
    setReviews(stored);
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) { toast.error('Please write a review'); return; }
    setSubmitting(true);
    const newReview = {
      id: Date.now(),
      name: user.name,
      email: user.email,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
      likes: 0,
    };
    const updated = [newReview, ...reviews];
    localStorage.setItem('ipl_reviews', JSON.stringify(updated));
    setReviews(updated);
    setComment('');
    setRating(5);
    setSubmitting(false);
    toast.success('Review submitted!');
  };

  const handleDelete = (id) => {
    const updated = reviews.filter(r => r.id !== id);
    localStorage.setItem('ipl_reviews', JSON.stringify(updated));
    setReviews(updated);
    toast.success('Review deleted');
  };

  const topReviews = [...reviews].sort((a, b) => b.rating - a.rating).slice(0, 10);

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

  const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-lightGray">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/rcd_winning.jpg"
            alt="RCB IPL Champions Celebration"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-lightGray/70 via-white/60 to-lightGray/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-lightGray/85 via-transparent to-white/20" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-gold/30 via-transparent to-royalBlue/20" />

        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-drift" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gold/10 rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-gold/10 rounded-full blur-3xl animate-bounce-gentle" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-gold/60 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-gold/50 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-3 leading-tight text-shadow">
              <span className="text-darkText">Congratulations to the<br />IPL Champions!</span>
            </h1>
            <div className="w-12 h-0.5 bg-gradient-to-r from-gold/50 via-gold to-gold/50 rounded-full mb-5 mx-auto" />
            <p className="text-base sm:text-lg text-darkText/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              IPL Travels proudly celebrates the spirit of victory and excellence. 
              Book your journey with us and experience premium travel.
            </p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
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
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-lightGray to-transparent z-10" />
      </section>

      {/* Search Results */}
      {searched && (
        <section className="py-16 px-4 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <div className="max-w-7xl mx-auto">
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
                    <motion.div key={bus._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-darkText text-xs font-bold" style={{ background: companies.find(c => bus.company?.name?.includes(c.name))?.color || '#D4A373' }}>
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
              <motion.div {...fadeUp} className="text-center py-16">
                <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-4">
                  <HiSearch size={32} className="text-darkText/30" />
                </div>
                <h3 className="text-xl font-bold text-darkText mb-2">No buses found for this route</h3>
                <p className="text-darkText/50">Try searching with different cities or dates.</p>
              </motion.div>
            )}
          </div>
        </section>
      )}

      <div className="relative h-16 overflow-hidden">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Top Destinations */}
      <section className="py-16 px-4 bg-lightGray">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-gold/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-darkText/80 text-xs font-semibold tracking-wide uppercase">Popular Routes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-darkText mb-4">Top Destinations</h2>
            <p className="text-darkText/60 max-w-2xl mx-auto">Explore India's most traveled routes with premium bus services</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: '/Bangalore_to_Chennai.png', from: 'Bangalore', to: 'Chennai' },
              { src: '/Chennai_to_Bangalore.png', from: 'Chennai', to: 'Bangalore' },
              { src: '/Hyderabad_to_Chennai.png', from: 'Hyderabad', to: 'Chennai' },
              { src: '/Chennai_to_Hyderabad.png', from: 'Chennai', to: 'Hyderabad' },
              { src: '/Bangalore_to_Tirupati.png', from: 'Bangalore', to: 'Tirupati' },
              { src: '/Chennai_to_Tirupati.png', from: 'Chennai', to: 'Tirupati' },
              { src: '/Tirupati_to_Bangalore.png', from: 'Tirupati', to: 'Bangalore' },
              { src: '/Tirupati_to_Chennai.png', from: 'Tirupati', to: 'Chennai' },
            ].map((route, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden group cursor-pointer hover:shadow-md hover:border-gold/30 transition-all duration-300"
              >
                <div className="relative h-48">
                  <img src={route.src} alt={`${route.from} to ${route.to}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-darkText/70 via-darkText/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-lg font-bold">{route.from}</span>
                      <HiArrowRight size="16" className="text-gold" />
                      <span className="text-lg font-bold">{route.to}</span>
                    </div>
                    <p className="text-white/70 text-xs mt-1">Coming soon</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative h-16 overflow-hidden">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Bus Companies */}
      <section className="py-16 px-4 bg-lightGray overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-gold/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-darkText/80 text-xs font-semibold tracking-wide uppercase">Our Network</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-darkText mb-4">Trusted Bus Partners</h2>
            <p className="text-darkText/60">Travel with reliable and trusted bus operators across India</p>
          </motion.div>
          <div className="glass-dark rounded-2xl border border-gold/10 p-12 text-center">
            <p className="text-darkText/40 text-sm font-medium">Coming Soon</p>
            <p className="text-darkText/60 text-lg font-semibold mt-1">Partner companies will be listed here</p>
          </div>

          {/* <div className="relative">
            <motion.div
              className="flex gap-6"
              animate={{ x: [0, -((companies.length * 320))] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {[...companies, ...companies].map((company, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 group shrink-0"
                  style={{ width: 280 }}
                >
                  <div className="relative h-40 rounded-t-2xl overflow-hidden">
                    <img src={company.image} alt={company.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-white font-bold text-lg">{company.name}</span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: company.color + '20' }}>
                      <span className="text-sm font-bold" style={{ color: company.color }}>{getInitials(company.name)}</span>
                    </div>
                    <p className="text-darkText/60 text-xs">Trusted partner</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div> */}
        </div>
      </section>

      <div className="relative h-16 overflow-hidden">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* CTA */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gold/10 rounded-full blur-3xl animate-drift" style={{ animationDelay: '2s' }} />
        <motion.div {...fadeUp} className="relative max-w-4xl mx-auto glass-dark rounded-3xl p-8 sm:p-12 text-center border border-gold/20 shadow-2xl shadow-gold/10">
          <div className="w-16 h-16 rounded-full brand-gradient flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🏆</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-darkText mb-4">Ready to Book Your Journey?</h2>
          <p className="text-darkText/60 mb-8 max-w-2xl mx-auto">Experience premium bus travel with Way To IPL. Safe, comfortable, and affordable journeys await you.</p>
          <Link to="/booking" className="inline-flex items-center gap-2 brand-button px-8 py-3 rounded-xl text-base font-bold">
            Book Now <HiArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      <div className="relative h-16 overflow-hidden">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Reviews */}
      <section className="py-16 px-4 bg-lightGray">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-gold/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-darkText/80 text-xs font-semibold tracking-wide uppercase">Reviews</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-darkText mb-4">What Our Customers Say</h2>
            <p className="text-darkText/60">Real reviews from real travellers</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <motion.div {...fadeUp}>
              {user ? (
                <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm sticky top-28">
                  <h3 className="text-lg font-bold text-darkText mb-4">Share Your Experience</h3>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-darkText/50">Rating:</span>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} type="button" onClick={() => setRating(s)}
                          onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
                          className={`text-xl transition-all duration-150 ${(hover || rating) >= s ? 'text-gold scale-110' : 'text-darkText/20 hover:text-gold/50'}`}
                        ><HiStar /></button>
                      ))}
                    </div>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tell us about your journey..." className="input-field mb-4 resize-none" rows={4} />
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={submitting} className="brand-button w-full py-2.5 rounded-xl font-semibold">
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </motion.button>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center shadow-sm sticky top-28">
                  <div className="w-14 h-14 rounded-full brand-gradient flex items-center justify-center mx-auto mb-4">
                    <HiStar size="24" className="text-white" />
                  </div>
                  <p className="text-darkText font-semibold mb-2">Love our service?</p>
                  <p className="text-darkText/50 text-sm mb-4">Sign in to share your travel experience</p>
                  <Link to="/login" className="brand-button px-6 py-2.5 rounded-xl font-semibold inline-block">Sign In to Review</Link>
                  <p className="text-darkText/30 text-xs mt-4">Don't have an account? <Link to="/register" className="text-royalBlue underline">Register here</Link></p>
                </div>
              )}
            </motion.div>

            <motion.div {...fadeUp}>
              {topReviews.length === 0 ? (
                <p className="text-center text-darkText/50 py-8">No reviews yet. Be the first one!</p>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {topReviews.map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full brand-gradient flex items-center justify-center shrink-0">
                            <span className="text-white font-bold text-sm">{r.name?.[0]?.toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-darkText">{r.name}</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map(s => (
                                <HiStar key={s} size={14} className={s <= r.rating ? 'text-gold' : 'text-darkText/20'} />
                              ))}
                              <span className="text-[10px] text-darkText/30 ml-1">{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                            </div>
                          </div>
                        </div>
                        {user && user.email === r.email && (
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-500 transition-all p-1">
                            <HiTrash size={16} />
                          </motion.button>
                        )}
                      </div>
                      <p className="text-sm text-darkText/70 leading-relaxed">{r.comment}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
