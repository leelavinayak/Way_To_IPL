import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiUser, HiLogout, HiTicket, HiChevronDown } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setShowDropdown(false); }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Booking', path: '/booking' },
    { name: 'Routes', path: '/routes' },
    { name: 'About', path: '/about' },
    { name: 'Help', path: '/help' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 left-0 right-0 z-50 transition-all duration-700 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] border-b border-royalBlue/15'
        : 'bg-white/80 backdrop-blur-sm border-b border-royalBlue/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="relative">
            <div className="flex items-center gap-3">
              <img
                src="/Way_to_IPL_Logo.png"
                alt="Way To IPL"
                className="h-8 sm:h-9 lg:h-10 w-auto rounded-[10px]"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-base sm:text-lg font-bold text-navyBlue font-title tracking-wide">Way To IPL</span>
                <span className="text-[10px] sm:text-xs text-darkText/40 font-medium tracking-[0.2em] uppercase">Book with Pride</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-navyBlue'
                    : 'text-darkText/60 hover:text-darkText'
                }`}
              >
                {isActive(link.path) && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 bg-royalBlue/10 rounded-xl border border-royalBlue/15" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl text-darkText/60 hover:text-darkText hover:bg-royalBlue/10 transition-all duration-300 border border-transparent hover:border-royalBlue/15"
                >
                  <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center shadow-lg shadow-royalBlue/20">
                    <span className="text-white font-bold text-sm">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-darkText">{user.name?.split(' ')[0]}</span>
                  <HiChevronDown size={14} className={`transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 origin-top-right"
                    >
                      <div className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl shadow-navyBlue/20 border border-royalBlue/10">
                        <div className="p-4 border-b border-royalBlue/8">
                          <p className="text-sm font-semibold text-darkText">{user.name}</p>
                          <p className="text-xs text-darkText/40 mt-0.5">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-darkText/60 hover:text-darkText hover:bg-royalBlue/10 rounded-xl transition-all"><HiUser size={16} /> Profile</Link>
                          <Link to="/profile?tab=history" className="flex items-center gap-3 px-3 py-2.5 text-sm text-darkText/60 hover:text-darkText hover:bg-royalBlue/10 rounded-xl transition-all"><HiTicket size={16} /> Booking History</Link>
                          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-darkText/10 rounded-xl transition-all w-full"><HiLogout size={16} /> Logout</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-darkText/60 hover:text-darkText hover:bg-royalBlue/10 rounded-xl transition-all duration-300">Login</Link>
                <Link to="/register" className="px-5 py-2 text-sm font-semibold brand-button rounded-xl shadow-lg shadow-royalBlue/20">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative lg:hidden p-2.5 rounded-xl text-darkText/60 hover:text-darkText hover:bg-royalBlue/10 transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-xl bg-white/0 hover:bg-royalBlue/10 transition-all" />
            {isOpen ? <HiX size={22} className="relative" /> : <HiMenu size={22} className="relative" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden"
          >
            <div className="bg-white border-t border-royalBlue/10 shadow-2xl shadow-navyBlue/10">
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(link.path)
                        ? 'text-navyBlue bg-royalBlue/10 border border-royalBlue/15'
                        : 'text-darkText/60 hover:text-darkText hover:bg-royalBlue/10'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="px-4 pb-4 space-y-2 border-t border-royalBlue/10 pt-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-10 rounded-full brand-gradient flex items-center justify-center">
                        <span className="text-white font-bold">{user.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-darkText">{user.name}</p>
                        <p className="text-xs text-darkText/40">{user.email}</p>
                      </div>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-darkText/60 hover:text-darkText hover:bg-royalBlue/10 rounded-xl transition-all"><HiUser size={16} /> Profile</Link>
                    <Link to="/profile?tab=history" className="flex items-center gap-3 px-4 py-3 text-sm text-darkText/60 hover:text-darkText hover:bg-royalBlue/10 rounded-xl transition-all"><HiTicket size={16} /> Booking History</Link>
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:text-red-600 hover:bg-darkText/10 rounded-xl transition-all w-full"><HiLogout size={16} /> Logout</button>
                  </>
                ) : (
                  <div className="flex gap-3 px-4 py-2">
                    <Link to="/login" className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-darkText/60 hover:text-darkText border border-royalBlue/15 rounded-xl hover:bg-royalBlue/10 transition-all">Login</Link>
                    <Link to="/register" className="flex-1 text-center px-4 py-2.5 text-sm font-semibold brand-button rounded-xl shadow-lg shadow-royalBlue/20">Register</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
