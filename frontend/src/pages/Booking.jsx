import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiArrowRight, HiClock, HiLocationMarker, HiStar, HiUsers, HiCheck, HiShieldCheck, HiCreditCard } from 'react-icons/hi';
import { tripAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-50px' }, transition: { duration: 0.6 } };

const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const formatDuration = (mins) => {
  if (!mins && mins !== 0) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m > 0 ? m + 'm' : ''}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const busTypeLabel = (type) => {
  const map = {
    'ac_seater': 'AC Seater',
    'ac_sleeper': 'AC Sleeper',
    'non_ac_seater': 'Non-AC Seater',
    'non_ac_sleeper': 'Non-AC Sleeper',
    'ac_semi_sleeper': 'AC Semi-Sleeper',
    'double_decker': 'Double Decker',
    'AC Seater': 'AC Seater',
    'AC Sleeper': 'AC Sleeper',
    'AC Semi-Sleeper': 'AC Semi-Sleeper',
    'Non-AC Seater': 'Non-AC Seater',
    'Non-AC Sleeper': 'Non-AC Sleeper',
    'Double Decker': 'Double Decker',
    'Volvo AC': 'Volvo AC',
  };
  return map[type] || type || 'AC Seater';
};

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const tripId = searchParams.get('trip');

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);
  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searched, setSearched] = useState(false);

  const [seatLayout, setSeatLayout] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingStep, setBookingStep] = useState('details');
  const [passengers, setPassengers] = useState([]);
  const [contactMobile, setContactMobile] = useState(user?.mobile || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [processing, setProcessing] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    if (tripId) {
      fetchTripDetails(tripId);
    } else {
      fetchAllTrips();
    }
  }, [tripId]);

  useEffect(() => {
    if (selectedTrip) {
      fetchSeatLayout();
    }
  }, [selectedTrip]);

  const fetchAllTrips = async () => {
    setLoading(true);
    try {
      const { data } = await tripAPI.getAll();
      const list = Array.isArray(data) ? data : [];
      setAllTrips(list);
    } catch {
      toast.error('Failed to load trips');
      setAllTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTripDetails = async (id) => {
    setLoading(true);
    try {
      const { data } = await tripAPI.getById(id);
      setSelectedTrip(data);
    } catch {
      toast.error('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const fetchSeatLayout = async () => {
    if (!selectedTrip?._id) return;
    setLoadingSeats(true);
    try {
      const { data } = await tripAPI.getSeats(selectedTrip._id);
      setSeatLayout(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load seat layout';
      toast.error(msg);
      console.error('Seat layout error:', err.response?.status, err.response?.data || err);
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!origin || !destination) { toast.error('Please enter both locations'); return; }
    setSearched(true);
    const filtered = allTrips.filter(trip => {
      const o = (trip.origin || '').toLowerCase();
      const d = (trip.destination || '').toLowerCase();
      const tripDate = trip.departureDate ? new Date(trip.departureDate).toISOString().split('T')[0] : '';
      const matchDate = !searchDate || tripDate === searchDate;
      return o.includes(origin.toLowerCase()) && d.includes(destination.toLowerCase()) && matchDate;
    });
    setFilteredTrips(filtered);
    if (!filtered.length) {
      toast.error('No trips found for this route');
    }
  };

  const toggleSeat = (seatNumber, isBooked) => {
    if (isBooked) return;
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(s => s !== seatNumber);
      }
      if (prev.length >= 6) {
        toast.error('Maximum 6 seats per booking');
        return prev;
      }
      return [...prev, seatNumber];
    });
  };

  const handleContinueToPassengers = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    setPassengers(selectedSeats.map(seat => ({
      name: '',
      age: '',
      gender: 'Male',
      seatNumber: seat,
    })));
    setBookingStep('passengers');
  };

  const updatePassenger = (index, field, value) => {
    setPassengers(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const validatePassengers = () => {
    for (const p of passengers) {
      if (!p.name.trim()) { toast.error(`Enter name for seat ${p.seatNumber}`); return false; }
      if (!p.age || Number(p.age) < 1 || Number(p.age) > 120) { toast.error(`Valid age required for seat ${p.seatNumber}`); return false; }
    }
    if (!contactMobile || contactMobile.length < 10) { toast.error('Valid mobile number required'); return false; }
    if (!contactEmail || !contactEmail.includes('@')) { toast.error('Valid email required'); return false; }
    return true;
  };

  const handleProceedToPayment = async () => {
    if (!validatePassengers()) return;
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    setProcessing(true);
    try {
      const { data } = await tripAPI.book(selectedTrip._id, {
        seats: selectedSeats,
        passengers: passengers.map(p => ({
          name: p.name.trim(),
          age: Number(p.age),
          gender: p.gender,
          seatNumber: p.seatNumber,
        })),
        contactMobile,
        contactEmail,
      });

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: 'IPL Travels',
        description: `${busTypeLabel(seatLayout?.busType)} - ${selectedSeats.length} seat(s)`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const confirmRes = await tripAPI.confirm(selectedTrip._id, {
              bookingId: data.bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setBookingResult(confirmRes.data.booking);
            setBookingStep('confirmed');
            toast.success('Booking confirmed successfully!');
          } catch {
            toast.error('Payment verified but confirmation failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast.error('Payment was cancelled');
          },
        },
        prefill: {
          contact: contactMobile,
          email: contactEmail,
        },
        theme: { color: '#0057B8' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      setProcessing(false);
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    }
  };

  const displayTrips = searched ? filteredTrips : allTrips;

  if (loading && !selectedTrip) {
    return (
      <div className="bg-lightGray min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full border-2 border-darkText/30 border-t-royalBlue animate-spin mx-auto mb-4" />
          <p className="text-darkText/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (selectedTrip && bookingStep === 'details') {
    return renderTripDetails();
  }

  if (selectedTrip && bookingStep === 'passengers') {
    return renderPassengerForm();
  }

  if (selectedTrip && bookingStep === 'confirmed') {
    return renderConfirmation();
  }

  return renderTripList();

  function renderTripDetails() {
    return (
      <div className="bg-lightGray min-h-[calc(100vh-4rem)] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/booking')}
            className="text-darkText/50 hover:text-darkText text-sm flex items-center gap-1 mb-6 transition-colors"
          >
            <HiArrowRight size={16} className="rotate-180" /> Back to All Trips
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden"
              >
                <div className="bg-gradient-to-r from-royalBlue to-navyBlue p-6 sm:p-8">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-darkText text-xs font-bold bg-white/20 backdrop-blur-sm">
                          {getInitials(selectedTrip.matchName || selectedTrip.busOperator)}
                        </div>
                        <div>
                          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">{selectedTrip.matchName}</h1>
                          <p className="text-white/70 text-sm">{busTypeLabel(selectedTrip.busType)} • {selectedTrip.busOperator}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gold">₹{selectedTrip.pricePerSeat}</p>
                      <p className="text-white/60 text-xs">per seat</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
                    <div>
                      <p className="text-darkText/40 text-xs uppercase tracking-wide font-medium mb-1">Route</p>
                      <p className="text-darkText font-semibold flex items-center gap-1"><HiLocationMarker size={14} className="text-gold" />{selectedTrip.origin} → {selectedTrip.destination}</p>
                    </div>
                    <div>
                      <p className="text-darkText/40 text-xs uppercase tracking-wide font-medium mb-1">Date</p>
                      <p className="text-darkText font-semibold">{formatDate(selectedTrip.departureDate)}</p>
                    </div>
                    <div>
                      <p className="text-darkText/40 text-xs uppercase tracking-wide font-medium mb-1">Departure</p>
                      <p className="text-darkText font-semibold">{selectedTrip.departureTime}</p>
                    </div>
                    <div>
                      <p className="text-darkText/40 text-xs uppercase tracking-wide font-medium mb-1">Arrival</p>
                      <p className="text-darkText font-semibold">{selectedTrip.arrivalTime}</p>
                    </div>
                    <div>
                      <p className="text-darkText/40 text-xs uppercase tracking-wide font-medium mb-1">Duration</p>
                      <p className="text-darkText font-semibold flex items-center gap-1"><HiClock size={14} className="text-royalBlue" />{formatDuration(selectedTrip.duration)}</p>
                    </div>
                    <div>
                      <p className="text-darkText/40 text-xs uppercase tracking-wide font-medium mb-1">Available</p>
                      <p className="text-darkText font-semibold flex items-center gap-1"><HiUsers size={14} className="text-green-500" />{seatLayout?.availableSeats ?? selectedTrip.availableSeats} / {selectedTrip.totalSeats}</p>
                    </div>
                    <div>
                      <p className="text-darkText/40 text-xs uppercase tracking-wide font-medium mb-1">Bus No.</p>
                      <p className="text-darkText font-semibold">{selectedTrip.busNumber || '—'}</p>
                    </div>
                    <div>
                      <p className="text-darkText/40 text-xs uppercase tracking-wide font-medium mb-1">Rating</p>
                      <p className="text-darkText font-semibold flex items-center gap-1"><HiStar size={14} className="text-gold" />{selectedTrip.rating || '4.0'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 mt-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold text-darkText">Select Seats</h2>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded inline-block seat-available border" /> Available</span>
                    <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded inline-block seat-selected" /> Selected</span>
                    <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded inline-block seat-booked" /> Booked</span>
                  </div>
                </div>

                {loadingSeats || !seatLayout ? (
                  <div className="text-center py-12">
                    <div className="w-10 h-10 rounded-full border-2 border-darkText/30 border-t-royalBlue animate-spin mx-auto mb-3" />
                    <p className="text-darkText/60 text-sm">Loading seats...</p>
                  </div>
                ) : (
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 overflow-x-auto">
                      <div className="inline-block p-4 sm:p-6 rounded-xl border border-gray-200 bg-gray-50/50 min-w-[320px]">
                        <div className="flex justify-end mb-4 pr-2">
                          <div className="px-6 py-1.5 bg-darkText/5 rounded-full text-xs text-darkText/50 font-medium">Driver</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {renderSeatGrid()}
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-72">
                      <div className="bg-royalBlue/5 rounded-xl p-5 border border-royalBlue/10">
                        <h3 className="font-bold text-darkText mb-3">Selected Seats</h3>
                        {selectedSeats.length === 0 ? (
                          <p className="text-darkText/40 text-sm">No seats selected yet</p>
                        ) : (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {selectedSeats.map(s => (
                              <span key={s} className="px-3 py-1 rounded-lg text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #0057B8, #0A2E5D)' }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="border-t border-royalBlue/10 pt-3 space-y-2 text-sm">
                          <div className="flex justify-between text-darkText/60">
                            <span>Seats</span>
                            <span className="font-semibold text-darkText">{selectedSeats.length}</span>
                          </div>
                          <div className="flex justify-between text-darkText/60">
                            <span>Fare per seat</span>
                            <span className="font-semibold text-darkText">₹{seatLayout.pricePerSeat}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold text-darkText border-t border-royalBlue/10 pt-3">
                            <span>Total</span>
                            <span className="text-royalBlue">₹{selectedSeats.length * seatLayout.pricePerSeat}</span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleContinueToPassengers}
                          disabled={selectedSeats.length === 0}
                          className="w-full mt-4 brand-button py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-royalBlue/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Continue <HiArrowRight size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderSeatGrid() {
    const grouped = {};
    seatLayout.seats.forEach(seat => {
      if (!grouped[seat.row]) grouped[seat.row] = [];
      grouped[seat.row].push(seat);
    });

    const rowKeys = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));

    const lastRowKey = rowKeys[rowKeys.length - 1];

    return rowKeys.map(row => {
      const isLast = row === lastRowKey;
      const seats = grouped[row];
      const leftSeats = seats.filter(s => s.side === 'left').sort((a, b) => Number(a.seatNumber) - Number(b.seatNumber));
      const rightSeats = seats.filter(s => s.side === 'right').sort((a, b) => Number(a.seatNumber) - Number(b.seatNumber));

      return (
        <div key={row} className="flex items-center gap-1.5">
          <span className="text-xs text-darkText/30 w-5 text-right shrink-0">{row}</span>
          {leftSeats.map(seat => (
            <div
              key={seat.seatNumber}
              onClick={() => toggleSeat(seat.seatNumber, seat.isBooked)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer select-none transition-all duration-200 border-2
                ${seat.isBooked ? 'seat-booked' : selectedSeats.includes(seat.seatNumber) ? 'seat-selected' : 'seat-available'}`}
              title={`Seat ${seat.seatNumber}`}
            >
              {seat.seatNumber}
            </div>
          ))}
          {!isLast && <div className="w-6 sm:w-8 shrink-0" />}
          {rightSeats.map(seat => (
            <div
              key={seat.seatNumber}
              onClick={() => toggleSeat(seat.seatNumber, seat.isBooked)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer select-none transition-all duration-200 border-2
                ${seat.isBooked ? 'seat-booked' : selectedSeats.includes(seat.seatNumber) ? 'seat-selected' : 'seat-available'}`}
              title={`Seat ${seat.seatNumber}`}
            >
              {seat.seatNumber}
            </div>
          ))}
        </div>
      );
    });
  }

  function renderPassengerForm() {
    const totalFare = selectedSeats.length * selectedTrip.pricePerSeat;

    return (
      <div className="bg-lightGray min-h-[calc(100vh-4rem)] py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setBookingStep('details')}
            className="text-darkText/50 hover:text-darkText text-sm flex items-center gap-1 mb-6 transition-colors"
          >
            <HiArrowRight size={16} className="rotate-180" /> Back to Seat Selection
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-royalBlue to-navyBlue p-6">
                <h2 className="text-xl font-display font-bold text-white">Passenger Details</h2>
                <p className="text-white/60 text-sm mt-1">Enter details for each passenger</p>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {passengers.map((passenger, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-darkText flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-royalBlue text-white text-xs flex items-center justify-center">{index + 1}</span>
                        Passenger {index + 1}
                      </h3>
                      <span className="text-xs bg-royalBlue/10 text-royalBlue font-semibold px-3 py-1 rounded-full">Seat {passenger.seatNumber}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="input-label">Full Name</label>
                        <input
                          type="text"
                          placeholder="Enter name"
                          value={passenger.name}
                          onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                          className="input-field text-sm"
                        />
                      </div>
                      <div>
                        <label className="input-label">Age</label>
                        <input
                          type="number"
                          placeholder="Age"
                          min={1}
                          max={120}
                          value={passenger.age}
                          onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                          className="input-field text-sm"
                        />
                      </div>
                      <div>
                        <label className="input-label">Gender</label>
                        <select
                          value={passenger.gender}
                          onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                          className="input-field text-sm"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-royalBlue/5 rounded-xl p-4 sm:p-5 border border-royalBlue/10">
                  <h3 className="font-bold text-darkText mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={contactMobile}
                        onChange={(e) => setContactMobile(e.target.value)}
                        className="input-field text-sm"
                        maxLength={10}
                      />
                    </div>
                    <div>
                      <label className="input-label">Email Address</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="input-field text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                  <h3 className="font-bold text-darkText mb-3">Fare Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-darkText/60"><span>Base Fare ({selectedSeats.length} seats)</span><span className="font-semibold text-darkText">₹{totalFare}</span></div>
                    <div className="flex justify-between text-lg font-bold text-darkText border-t border-gray-200 pt-3">
                      <span>Total Amount</span>
                      <span className="text-royalBlue">₹{totalFare}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setBookingStep('details')}
                    className="flex-1 py-3 rounded-xl text-sm font-bold border-2 border-royalBlue/20 text-royalBlue hover:bg-royalBlue/5 transition-colors"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceedToPayment}
                    disabled={processing}
                    className="flex-1 brand-button py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-royalBlue/30 disabled:opacity-60"
                  >
                    {processing ? (
                      <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Processing...</>
                    ) : (
                      <><HiCreditCard size={18} /> Pay ₹{totalFare}</>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  function renderConfirmation() {
    return (
      <div className="bg-lightGray min-h-[calc(100vh-4rem)] py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden text-center"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <HiCheck size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white">Booking Confirmed!</h2>
            <p className="text-white/70 text-sm mt-1">Your seats have been booked successfully</p>
          </div>

          <div className="p-6 sm:p-8 text-left">
            {bookingResult && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-darkText/50">Booking ID</span>
                  <span className="font-bold text-darkText">{bookingResult.bookingId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-darkText/50">Route</span>
                  <span className="font-semibold text-darkText">{bookingResult.from} → {bookingResult.to}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-darkText/50">Date</span>
                  <span className="font-semibold text-darkText">{formatDate(bookingResult.journeyDate)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-darkText/50">Seats</span>
                  <span className="font-semibold text-darkText">{bookingResult.seats?.join(', ')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-darkText/50">Passengers</span>
                  <span className="font-semibold text-darkText">{bookingResult.passengers?.length}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-darkText/50">Total Paid</span>
                  <span className="font-bold text-lg text-green-600">₹{bookingResult.totalFare}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 mt-6 p-3 bg-green-50 rounded-xl text-green-700 text-sm">
              <HiShieldCheck size={18} />
              Payment successful via Razorpay
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/profile')}
                className="flex-1 brand-button py-3 rounded-xl text-sm font-bold shadow-lg shadow-royalBlue/30"
              >
                View My Bookings
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/booking')}
                className="flex-1 py-3 rounded-xl text-sm font-bold border-2 border-royalBlue/20 text-royalBlue hover:bg-royalBlue/5 transition-colors"
              >
                Book Another Trip
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  function renderTripList() {
    return (
      <div className="bg-lightGray min-h-[calc(100vh-4rem)]">
        <section className="relative py-12 sm:py-20 px-4 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/20 rounded-full blur-3xl" style={{ animationDelay: '2s' }} />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-darkText mb-3">
                Book Your Trip
              </h1>
              <p className="text-darkText/60 max-w-xl mx-auto">Browse all trips from the trips collection</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <form onSubmit={handleSearch} className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-royalBlue/20 shadow-2xl shadow-royalBlue/15">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[140px]">
                    <label className="input-label">From</label>
                    <input type="text" placeholder="Enter origin city" value={origin} onChange={(e) => setOrigin(e.target.value)} className="input-field" list="cities" />
                  </div>
                  <div className="flex-1 min-w-[140px]">
                    <label className="input-label">To</label>
                    <input type="text" placeholder="Enter destination city" value={destination} onChange={(e) => setDestination(e.target.value)} className="input-field" list="cities" />
                  </div>
                  <div className="w-full sm:w-48">
                    <label className="input-label">Journey Date</label>
                    <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="input-field" min={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                <datalist id="cities">
                  {['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Pune', 'Vijayawada', 'Jaipur', 'Agra', 'Kolkata', 'Tirupati'].map(c => <option key={c} value={c} />)}
                </datalist>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="mt-4 w-full brand-button py-3 rounded-xl text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-royalBlue/30">
                  <HiSearch size={20} /> Search Trips
                </motion.button>
              </form>
            </motion.div>
          </div>
        </section>

        <section className="pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            {displayTrips.length > 0 ? (
              <>
                <motion.div {...fadeUp} className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-darkText">
                    {searched ? 'Search Results' : 'All Trips'} <span className="text-darkText/60 text-base font-normal">({displayTrips.length} found)</span>
                  </h2>
                </motion.div>
                <div className="space-y-4">
                  {displayTrips.map((trip, i) => (
                    <motion.div
                      key={trip._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1 w-full">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: '#D4A373' }}>
                              {getInitials(trip.matchName || trip.busOperator)}
                            </div>
                            <div>
                              <h3 className="text-darkText font-semibold">{trip.matchName}</h3>
                              <p className="text-darkText/50 text-sm">{busTypeLabel(trip.busType)} • {trip.busOperator}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                            <div><p className="text-darkText/40 text-xs">From</p><p className="text-darkText font-semibold">{trip.origin}</p></div>
                            <div><p className="text-darkText/40 text-xs">To</p><p className="text-darkText font-semibold">{trip.destination}</p></div>
                            <div><p className="text-darkText/40 text-xs">Departure</p><p className="text-darkText font-semibold flex items-center gap-1"><HiClock size={12} className="text-royalBlue" />{trip.departureTime}</p></div>
                            <div><p className="text-darkText/40 text-xs">Seats Left</p><p className="text-darkText font-semibold">{trip.availableSeats}</p></div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                          <p className="text-2xl font-bold text-darkText">₹{trip.pricePerSeat}</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/booking?trip=${trip._id}`)}
                            className="brand-button px-6 py-2 rounded-xl text-sm font-semibold w-full sm:w-auto flex items-center justify-center gap-1"
                          >
                            View Details <HiArrowRight size={16} />
                          </motion.button>
                        </div>
                      </div>
                      {trip.busDetails && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-darkText/50 text-xs">{trip.busDetails}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <motion.div {...fadeUp} className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <HiSearch size={32} className="text-darkText/30" />
                </div>
                <h3 className="text-xl font-bold text-darkText mb-2">{searched ? 'No trips found for this route' : 'No trips available'}</h3>
                <p className="text-darkText/50">{searched ? 'Try searching with different cities.' : 'No trips found in the trips collection.'}</p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    );
  }
};

export default Booking;