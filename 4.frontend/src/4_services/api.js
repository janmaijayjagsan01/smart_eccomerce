import axios from 'axios'

// Har service ka apna base URL — env variable se override ho sakta hai, warna default local port
const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:5001'
const PRODUCT_URL = import.meta.env.VITE_PRODUCT_URL || 'http://localhost:5002'
const CART_URL = import.meta.env.VITE_CART_URL || 'http://localhost:5003'
const ORDER_URL = import.meta.env.VITE_ORDER_URL || 'http://localhost:5004'
const PAYMENT_URL = import.meta.env.VITE_PAYMENT_URL || 'http://localhost:5005'

// Common config helper — har service ke liye apna axios instance banata hai
const createApiInstance = (baseURL) =>
  axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

const authApi = createApiInstance(AUTH_URL)
const productApi = createApiInstance(PRODUCT_URL)
const cartApi = createApiInstance(CART_URL)
const orderApi = createApiInstance(ORDER_URL)
const paymentApi = createApiInstance(PAYMENT_URL)

// Auth service
export const authAPI = {
  login: (data) => authApi.post('/api/auth/login', data),
  register: (data) => authApi.post('/api/auth/register', data),
  getProfile: () => authApi.get('/api/auth/me'),
  updateProfile: (data) => authApi.put('/api/auth/me', data),
}

// Product service
export const productAPI = {
  getAll: (params) => productApi.get('/api/products/', { params }),
  getById: (id) => productApi.get(`/api/products/${id}`),
  getCategories: () => productApi.get('/api/products/categories'),
  getFeatured: () => productApi.get('/api/products/featured'),
}

// Cart service
export const cartAPI = {
  getCart: (userId) => cartApi.get('/api/cart/', { params: { user_id: userId } }),
  addToCart: (data) => cartApi.post('/api/cart/add', data),
  updateItem: (id, data) => cartApi.put(`/api/cart/update/${id}`, data),
  removeItem: (id) => cartApi.delete(`/api/cart/remove/${id}`),
  clearCart: (userId) => cartApi.delete('/api/cart/clear', { params: { user_id: userId } }),
}

// Order service
export const orderAPI = {
  getOrders: (userId) => orderApi.get('/api/orders/', { params: { user_id: userId } }),
  getById: (id) => orderApi.get(`/api/orders/${id}`),
  createOrder: (data) => orderApi.post('/api/orders/create', data),
}

// Payment service
export const paymentAPI = {
  process: (data) => paymentApi.post('/api/payments/process', data),
  getPayments: (params) => paymentApi.get('/api/payments/', { params }),
}

export default authApi