import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdmin = window.location.pathname.startsWith('/admin');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('adminToken');
      window.location.href = isAdmin ? '/admin/login' : '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
  verifyOTP: (data) => API.post('/auth/verify-otp', data),
  resetPassword: (data) => API.post('/auth/reset-password', data),
  sendMobileOTP: (data) => API.post('/auth/send-mobile-otp', data),
  resetPasswordWithOTP: (data) => API.post('/auth/reset-password-with-otp', data),
  sendOTP: (data) => API.post('/auth/send-otp', data),
};

export const busAPI = {
  search: (params) => API.get('/buses/search', { params }),
  getById: (id) => API.get(`/buses/${id}`),
  getAll: () => API.get('/buses'),
  getCompanies: () => API.get('/buses/companies'),
  getRoutes: () => API.get('/buses/routes'),
};

export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  confirm: (data) => API.post('/bookings/confirm', data),
  getAll: () => API.get('/bookings'),
  getById: (id) => API.get(`/bookings/${id}`),
  cancel: (id, data) => API.put(`/bookings/${id}/cancel`, data),
  downloadTicket: (id) => API.get(`/bookings/${id}/ticket`, { responseType: 'blob' }),
  getSeatLayout: (busId) => API.get(`/bookings/bus/${busId}/seats`),
};

export const contactAPI = {
  submit: (data) => API.post('/contact', data),
};

export const paymentAPI = {
  createRazorpayOrder: (data) => API.post('/payments/razorpay/create-order', data),
  verifyRazorpay: (data) => API.post('/payments/razorpay/verify', data),
  createPhonePeOrder: (data) => API.post('/payments/phonepe/create-order', data),
};

export const adminAPI = {
  login: (data) => API.post('/admin/login', data),
  getProfile: () => API.get('/auth/profile'),
  getDashboardStats: () => API.get('/admin/dashboard/stats'),
  getAllBuses: () => API.get('/admin/buses'),
  getBusById: (id) => API.get(`/admin/buses/${id}`),
  createBus: (data) => API.post('/admin/buses', data),
  updateBus: (id, data) => API.put(`/admin/buses/${id}`, data),
  deleteBus: (id) => API.delete(`/admin/buses/${id}`),
  getBookings: (params) => API.get('/admin/bookings', { params }),
  getBookingById: (id) => API.get(`/admin/bookings/${id}`),
  updateBookingStatus: (id, data) => API.put(`/admin/bookings/${id}/status`, data),
  getUsers: (params) => API.get('/admin/users', { params }),
  getReviews: (params) => API.get('/admin/reviews', { params }),
  deleteReview: (id) => API.delete(`/admin/reviews/${id}`),
  getContacts: (params) => API.get('/admin/contacts', { params }),
  deleteContact: (id) => API.delete(`/admin/contacts/${id}`),
  getCompanies: () => API.get('/admin/companies'),
  createCompany: (data) => API.post('/admin/companies', data),
  updateCompany: (id, data) => API.put(`/admin/companies/${id}`, data),
  deleteCompany: (id) => API.delete(`/admin/companies/${id}`),
  getAdminRoutes: () => API.get('/admin/routes/list'),
  createRoute: (data) => API.post('/admin/routes', data),
  updateRoute: (id, data) => API.put(`/admin/routes/${id}`, data),
  deleteRoute: (id) => API.delete(`/admin/routes/${id}`),
};

export const tripAPI = {
  getAll: () => API.get('/trips'),
  getById: (id) => API.get(`/trips/${id}`),
  search: (params) => API.get('/trips/search', { params }),
  getSeats: (tripId) => API.get(`/trips/${tripId}/seats`),
  book: (tripId, data) => API.post(`/trips/${tripId}/book`, data),
  confirm: (tripId, data) => API.post(`/trips/${tripId}/confirm`, data),
};

export default API;
