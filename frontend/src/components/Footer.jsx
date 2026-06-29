import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBus, FaShieldAlt, FaHeadset, FaStar } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  return (
    <footer className="relative w-full overflow-hidden border-t border-royalBlue/10">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />

      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gold/5 rounded-full blur-3xl animate-drift pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          {/* Brand */}
          <motion.div {...fadeIn} className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src="/Way_to_IPL_Logo.png" alt="Way To IPL" className="h-9 w-auto rounded-[10px]" />
              <div>
                <h3 className="text-lg font-bold text-darkText font-title">Way To IPL</h3>
                <p className="text-[10px] text-darkText/40 font-medium tracking-[0.2em] uppercase">Book with Pride</p>
              </div>
            </div>
            <p className="text-darkText/60 text-sm leading-relaxed mb-6">
              Your trusted partner for premium bus travel across India. Experience comfort, reliability, and exceptional service.
            </p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} size={14} className="text-gold" />
              ))}
              <span className="text-darkText/30 text-xs ml-2">4.8/5 Rating</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div {...fadeIn} transition={{ duration: 0.5, delay: 0.1 }}>
            <h4 className="text-darkText font-semibold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3.5">
              {[
                { name: 'Home', path: '/' },
                { name: 'Booking', path: '/booking' },
                { name: 'Help Center', path: '/help' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'About Us', path: '/about' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-darkText/50 hover:text-navyBlue text-sm transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-[2px] bg-navyBlue transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div {...fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
            <h4 className="text-darkText font-semibold mb-5 text-sm uppercase tracking-wider">Our Services</h4>
            <ul className="space-y-3.5">
              {[
                { icon: FaBus, text: 'Bus Booking' },
                { icon: FaShieldAlt, text: 'Safe Travel' },
                { icon: FaHeadset, text: '24/7 Support' },
                { icon: FaStar, text: 'Premium Service' },
              ].map((item) => (
                <li key={item.text} className="text-darkText/50 text-sm flex items-center gap-3 group">
                  <item.icon size={14} className="text-gold shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  {item.text}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div {...fadeIn} transition={{ duration: 0.5, delay: 0.3 }}>
            <h4 className="text-darkText font-semibold mb-5 text-sm uppercase tracking-wider">Get in Touch</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:leelavinayakkothakota155@gmail.com" className="text-darkText/50 hover:text-navyBlue text-sm transition-all duration-300 inline-flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-[2px] bg-navyBlue transition-all duration-300" />
                  leelavinayakkothakota155@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+918523086151" className="text-darkText/50 hover:text-navyBlue text-sm transition-all duration-300 inline-flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-[2px] bg-navyBlue transition-all duration-300" />
                  +91 8523086151
                </a>
              </li>
              {/* <li className="text-darkText/50 text-sm leading-relaxed">
                Chennai, Tamil Nadu, India
              </li> */}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div {...fadeIn} transition={{ duration: 0.5, delay: 0.4 }} className="border-t border-royalBlue/10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-darkText/30 text-xs">
              &copy; {currentYear} Way To IPL. All rights reserved.
            </p>
            <p className="text-darkText/20 text-xs">
              Made with care for your journey
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
