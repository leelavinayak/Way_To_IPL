import { motion } from 'framer-motion';
import { HiHeart, HiStar, HiClock, HiLocationMarker, HiArrowRight, HiUserGroup, HiPhotograph } from 'react-icons/hi';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-50px' }, transition: { duration: 0.6 } };
const staggerItem = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4 } };
const staggerContainer = { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { staggerChildren: 0.1 } };

const About = () => {
  const sections = [
    { icon: HiHeart, title: 'Built by IPL Fans', desc: 'IPL Travels was created by die-hard cricket fans who live and breathe the IPL season. Every feature, every route, and every experience is designed with the same passion that fuels the greatest cricket league in the world.' },
    { icon: HiStar, title: 'IPL Winner Gallery', desc: 'Celebrate the champions! Our website proudly showcases IPL winner team photos year after year. From the title lift to the confetti, relive every championship moment right here on our platform.' },
    { icon: HiUserGroup, title: 'A Community of Fans', desc: 'We are more than just a travel platform — we are a community. Connect with fellow cricket enthusiasts, share match-day journeys, and travel together to cheer for your favorite teams.' },
    { icon: HiPhotograph, title: 'Moments That Matter', desc: 'Every IPL season brings unforgettable memories. We capture and display the winning moments, the celebrations, and the spirit of the game, making IPL Travels a true fan destination.' },
  ];

  const routes = [
    { from: 'Bangalore', to: 'Hyderabad', time: '7h 30m', buses: '14 daily' },
    { from: 'Bangalore', to: 'Chennai', time: '6h 30m', buses: '16 daily' },
    { from: 'Bangalore', to: 'Mumbai', time: '10h 00m', buses: '8 daily' },
    { from: 'Hyderabad', to: 'Bangalore', time: '7h 30m', buses: '14 daily' },
    { from: 'Hyderabad', to: 'Chennai', time: '8h 00m', buses: '12 daily' },
    { from: 'Hyderabad', to: 'Vijayawada', time: '4h 30m', buses: '10 daily' },
    { from: 'Chennai', to: 'Bangalore', time: '6h 30m', buses: '16 daily' },
    { from: 'Chennai', to: 'Hyderabad', time: '8h 00m', buses: '12 daily' },
    { from: 'Mumbai', to: 'Pune', time: '3h 30m', buses: '20 daily' },
  ];

  return (
    <div className="bg-lightGray">
      {/* Founder Section */}
      {/* <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-drift" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-royalBlue/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-gold/30 rounded-full animate-ping" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-darkText text-sm font-medium">About Us</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold leading-tight">
                <span className="text-darkText">Meet Our Founder</span>
              </h1>
              <div className="glass-card p-6 space-y-4">
                <h2 className="text-2xl font-bold font-display text-darkText">Kothakota Leela Vinayak</h2>
                <p className="text-darkText/70 leading-relaxed">
                  IPL Travels is a trusted transportation service dedicated to providing safe, comfortable, and affordable travel experiences across multiple destinations. Our mission is to deliver exceptional customer satisfaction through reliable services, modern buses, and seamless online booking.
                </p>
                <p className="text-darkText/50 text-sm">
                  Founded with a vision to revolutionize bus travel in India, Kothakota Leela Vinayak has built IPL Travels on the principles of trust, innovation, and customer-first approach. Under his leadership, the company has grown to serve 100+ routes with a fleet of modern, well-maintained buses.
                </p>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="lg:sticky lg:top-28">
              <div className="relative w-full max-w-sm mx-auto">
                <div className="w-full aspect-square rounded-3xl glass-dark border border-gold/30 flex items-center justify-center overflow-hidden">
                  <div className="text-center p-8">
                    <div className="w-36 h-36 rounded-full brand-gradient flex items-center justify-center mx-auto mb-6 shadow-lg shadow-royalBlue/30">
                      <span className="text-6xl font-bold text-white">LV</span>
                    </div>
                    <p className="text-darkText font-semibold text-xl">Kothakota Leela Vinayak</p>
                    <p className="text-darkText/60 text-sm mt-1">Founder & CEO</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold/10 rounded-full blur-xl animate-float" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-royalBlue/5 rounded-full blur-xl" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
 */}
      {/* Why Choose IPL Travels */}
      <section className="py-16 px-4 bg-lightGray">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-gold/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-darkText/80 text-xs font-semibold tracking-wide uppercase">Why Us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-darkText mb-4">Why Choose IPL Travels?</h2>
            <p className="text-darkText/60 max-w-2xl mx-auto">Built by cricket fans, for cricket fans — experience travel with the spirit of IPL</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-royalBlue/20 flex items-center justify-center shrink-0">
                    <section.icon className="text-royalBlue" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-darkText mb-2">{section.title}</h3>
                    <p className="text-darkText/60 leading-relaxed text-sm">{section.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16"
          >
            <div className="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-10 text-center shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-royalBlue/20 flex items-center justify-center mx-auto mb-6">
                <HiStar className="text-royalBlue" size={32} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-darkText mb-4">IPL Champion of the Year</h3>
              <p className="text-darkText/60 max-w-2xl mx-auto mb-8">
                We celebrate the spirit of IPL by featuring the reigning champions. Check out the winner team photo from the latest IPL season — because IPL Travels is built by fans, for fans.
              </p>
              <div className="max-w-lg mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                <img
                  src="/rcd_winning.jpg"
                  alt="IPL Winner Team Photo"
                  className="w-full h-auto object-cover"
                />
              </div>
              <p className="text-darkText/40 text-sm mt-4">
                Relive the championship glory every time you book with us.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="relative h-16 overflow-hidden">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Most Booked Routes */}
      <section className="py-16 px-4 bg-lightGray">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-gold/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-darkText/80 text-xs font-semibold tracking-wide uppercase">Popular Routes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-darkText mb-4">Most Booked Routes</h2>
            <p className="text-darkText/60 max-w-2xl mx-auto">Top routes connecting major cities across India</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {routes.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-royalBlue/20 flex items-center justify-center">
                      <HiLocationMarker className="text-royalBlue" size={18} />
                    </div>
                    <div>
                      <p className="text-darkText font-bold text-base">{r.from}</p>
                      <p className="text-darkText/50 text-xs">to {r.to}</p>
                    </div>
                  </div>
                  <HiArrowRight size={18} className="text-gold" />
                </div>
                <div className="flex items-center justify-between text-xs text-darkText/60 border-t border-gray-100 pt-3">
                  <span className="flex items-center gap-1"><HiClock size={12} className="text-gold" /> {r.time}</span>
                  <span className="text-darkText/50">{r.buses}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
