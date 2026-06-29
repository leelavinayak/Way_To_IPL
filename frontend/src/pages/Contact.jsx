import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker, HiPaperAirplane } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { contactAPI } from '../utils/api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', message: '' });
  const [sending, setSending] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile || !form.message) {
      toast.error('Please fill all fields');
      return;
    }
    setSending(true);
    try {
      await contactAPI.submit(form);
      setForm({ name: '', email: '', mobile: '', message: '' });
      toast.success('Message sent! We will get back to you soon.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
    setSending(false);
  };

  return (
    <div className="bg-lightGray py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royalBlue to-navyBlue flex items-center justify-center mx-auto mb-4 shadow-lg">
            <HiPaperAirplane size="22" className="text-white" />
          </div>
          <h1 className="text-3xl font-bold font-display text-navyBlue">Contact Us</h1>
          <p className="text-darkText/50 text-sm mt-1">We'd love to hear from you</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-royalBlue/15 p-6 shadow-xl shadow-royalBlue/5">
              <h2 className="text-lg font-bold font-display text-navyBlue mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="input-label">Full Name</label><input type="text" placeholder="Your name" value={form.name} onChange={e => update('name', e.target.value)} className="input-field" /></div>
                <div><label className="input-label">Email</label><input type="email" placeholder="Your email" value={form.email} onChange={e => update('email', e.target.value)} className="input-field" /></div>
                <div><label className="input-label">Mobile Number</label><input type="tel" placeholder="Your mobile" value={form.mobile} onChange={e => update('mobile', e.target.value)} className="input-field" /></div>
                <div><label className="input-label">Message</label><textarea placeholder="Your message..." value={form.message} onChange={e => update('message', e.target.value)} className="input-field" rows={4} /></div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={sending} className="brand-button w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                  {sending ? 'Sending...' : <><HiPaperAirplane size={18} /> Send Message</>}
                </motion.button>
              </form>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-4">
            {[
              { icon: HiPhone, title: 'Phone', detail: '+91 98765 43210', sub: 'Mon-Sat, 9AM-8PM' },
              { icon: HiMail, title: 'Email', detail: 'support@ipltravels.com', sub: 'We reply within 24 hours' },
              { icon: HiLocationMarker, title: 'Address', detail: 'Hyderabad, Telangana, India', sub: 'Head Office' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-royalBlue/10 p-5 group hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-gold/20 transition-all duration-300">
                  <item.icon size="20" className="text-gold" />
                </div>
                <h3 className="text-sm font-bold text-navyBlue mb-1">{item.title}</h3>
                <p className="text-sm text-darkText/60">{item.detail}</p>
                <p className="text-xs text-darkText/40">{item.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
