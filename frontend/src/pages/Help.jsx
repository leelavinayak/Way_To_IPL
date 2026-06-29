import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChat, HiPaperAirplane, HiUser, HiPhone, HiCheckCircle, HiChatAlt2, HiMail } from 'react-icons/hi';
import toast from 'react-hot-toast';

const replies = {
  'hello|hi|hey': 'Hello! Welcome to IPL Travels Support. How can I help you today? You can ask about:\n• Booking tickets\n• Cancellation policy\n• Payment options\n• Bus routes & schedules\n• Luggage policy',
  'book|ticket|bus|route|schedule|timing|time': 'To book a bus ticket:\n1. Go to the Booking page\n2. Enter your departure city, destination, and date\n3. Select a bus and choose your seats\n4. Enter passenger details\n5. Complete payment\n\nNeed help with anything specific about booking?',
  'cancel|cancellation|refund': 'Cancellation Policy:\n• Free cancellation up to 24 hours before departure\n• 50% refund if cancelled 12-24 hours before\n• No refund within 12 hours of departure\n\nTo cancel, go to your Profile → Booking History and click Cancel.',
  'pay|payment|razorpay|phonepe|card|upi': 'Payment Options:\n• Razorpay: Cards, UPI, Net Banking, Wallets\n• PhonePe: UPI payments\n\nAll payments are secure and encrypted. You will receive a confirmation email after successful payment.',
  'luggage|baggage|bag': 'Luggage Policy:\n• You can carry up to 2 bags (total 30kg)\n• One hand bag (up to 5kg) in the cabin\n• Excess luggage may incur additional charges\n• Luggage tags are provided at boarding',
  'board|pickup|stop|boarding|dropping': 'Boarding Points:\n• You will receive boarding point details in your ticket\n• Please arrive 15 minutes before departure\n• Show your e-ticket (print or mobile) at boarding\n• Boarding points may vary by bus operator',
  'contact|support|help': 'You can reach us at:\n📞 +91 98765 43210\n✉️ support@ipltravels.com\n📍 Hyderabad, Telangana\n\nOr continue chatting here — I\'m happy to help!',
  'bye|thanks|thank you': 'You\'re welcome! 😊 Before you go, could you please share your name and mobile number so we can reach out if needed?',
};

const defaultResponse = "I'm sorry, I didn't quite understand that. Could you please rephrase? You can ask me about booking, cancellation, payment, routes, luggage, or boarding points.";

const Help = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! 👋 Welcome to IPL Travels Help Center. How can I assist you today?', user: false },
  ]);
  const [input, setInput] = useState('');
  const [userDetails, setUserDetails] = useState({ name: '', mobile: '' });
  const [showForm, setShowForm] = useState(false);
  const [collected, setCollected] = useState(false);
  const [sending, setSending] = useState(false);
  const chatEnd = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (text, isUser) => {
    setMessages(prev => [...prev, { id: Date.now(), text, user: isUser }]);
  };

  const findReply = (msg) => {
    const lower = msg.toLowerCase();
    for (const [pattern, reply] of Object.entries(replies)) {
      const keywords = pattern.split('|');
      if (keywords.some(k => lower.includes(k))) {
        return reply;
      }
    }
    return null;
  };

  const handleSend = () => {
    const msg = input.trim();
    if (!msg) return;
    addMessage(msg, true);
    setInput('');

    setTimeout(() => {
      const reply = findReply(msg);
      if (reply) {
        addMessage(reply, false);
        if (reply.includes('could you please share your name and mobile number')) {
          setTimeout(() => setShowForm(true), 1000);
        }
      } else {
        addMessage(defaultResponse, false);
      }
    }, 500 + Math.random() * 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleCollectDetails = async (e) => {
    e.preventDefault();
    if (!userDetails.name || !userDetails.mobile) {
      toast.error('Please fill your name and mobile number');
      return;
    }
    setSending(true);
    const chatData = {
      id: Date.now(),
      user: userDetails,
      messages,
      date: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('ipl_chats') || '[]');
    existing.push(chatData);
    localStorage.setItem('ipl_chats', JSON.stringify(existing));
    setCollected(true);
    setSending(false);
    addMessage('Thank you! Your details have been saved. Our team will get back to you shortly if needed. Have a great day! 🚌✨', false);
  };

  return (
    <div className="bg-lightGray py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royalBlue to-navyBlue flex items-center justify-center mx-auto mb-4 shadow-lg">
            <HiChat size="22" className="text-white" />
          </div>
          <h1 className="text-3xl font-bold font-display text-navyBlue">Help Center</h1>
          <p className="text-darkText/50 text-sm mt-1">Chat with us — we're here to help!</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white rounded-xl border border-royalBlue/10 px-4 py-2.5 shadow-sm">
            <HiPhone size="16" className="text-gold" />
            <span className="text-darkText text-sm">+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl border border-royalBlue/10 px-4 py-2.5 shadow-sm">
            <HiMail size="16" className="text-gold" />
            <span className="text-darkText text-sm">support@ipltravels.com</span>
          </div>
        </motion.div>

          <motion.div initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}
            className="bg-white/90 backdrop-blur-xl rounded-2xl border border-royalBlue/15 shadow-xl shadow-royalBlue/5 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-royalBlue to-navyBlue px-5 py-3 flex items-center gap-3">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <HiChatAlt2 size="18" className="text-white" />
              </motion.div>
              <div>
                <p className="text-white font-bold text-sm">IPL Travels Support</p>
                <p className="text-white/70 text-[10px]">We typically reply in a few seconds</p>
              </div>
            </div>

          <div className="h-96 overflow-y-auto p-5 space-y-3 bg-lightGray/50" style={{ scrollBehavior: 'smooth' }}>
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.user ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.user
                    ? 'bg-gradient-to-r from-royalBlue to-navyBlue text-white rounded-br-md'
                    : 'bg-white border border-royalBlue/10 text-darkText rounded-bl-md shadow-sm'
                }`}
                  dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br>') }}
                />
              </div>
            ))}

            <AnimatePresence>
              {showForm && !collected && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-white rounded-2xl border border-gold/20 p-4 shadow-sm max-w-[85%] mx-auto">
                  <p className="text-xs text-darkText/50 mb-3">Share your details so we can reach out:</p>
                  <form onSubmit={handleCollectDetails} className="space-y-2.5">
                    <div className="relative">
                      <HiUser size="14" className="absolute left-3 top-1/2 -translate-y-1/2 text-darkText/30" />
                      <input type="text" placeholder="Your name" value={userDetails.name} onChange={e => setUserDetails(p => ({ ...p, name: e.target.value }))}
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-royalBlue/15 focus:border-gold outline-none transition-all" />
                    </div>
                    <div className="relative">
                      <HiPhone size="14" className="absolute left-3 top-1/2 -translate-y-1/2 text-darkText/30" />
                      <input type="tel" placeholder="Mobile number" value={userDetails.mobile} onChange={e => setUserDetails(p => ({ ...p, mobile: e.target.value }))}
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-royalBlue/15 focus:border-gold outline-none transition-all" />
                    </div>
                    <button type="submit" disabled={sending} className="brand-button w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5">
                      {sending ? 'Saving...' : <><HiCheckCircle size="16" /> Submit</>}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={chatEnd} />
          </div>

          <div className="border-t border-royalBlue/10 p-4 bg-white">
            <div className="flex items-center gap-3">
              <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Type your message..." disabled={collected}
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-royalBlue/15 focus:border-gold outline-none transition-all bg-lightGray/50" />
              <button onClick={handleSend} disabled={!input.trim() || collected}
                className="w-11 h-11 rounded-xl bg-gradient-to-r from-royalBlue to-navyBlue flex items-center justify-center shadow-md disabled:opacity-50 transition-all active:scale-95">
                <HiPaperAirplane size="16" className="text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Help;
