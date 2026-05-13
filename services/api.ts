import axios from 'axios'

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || ' https://pasam-back.onrender.com/api',
  timeout: 30000,
})

API.interceptors.request.use((cfg) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('pasam_token')
    if (token) cfg.headers.Authorization = `Bearer ${token}`
  }
  return cfg
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('pasam_token')
      localStorage.removeItem('pasam_user')
      window.location.href = '/auth/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register:       (d: any) => API.post('/auth/register', d),
  login:          (d: any) => API.post('/auth/login', d),
  verifyOTP:      (d: any) => API.post('/auth/verify-otp', d),
  resendOTP:      (d: any) => API.post('/auth/resend-otp', d),
  forgotPassword: (d: any) => API.post('/auth/forgot-password', d),
  resetPassword:  (d: any) => API.post('/auth/reset-password', d),
  getMe:          ()       => API.get('/auth/me'),
  updateProfile:  (d: any) => API.put('/auth/profile', d),
}

export const productAPI = {
  getAll:        (p?: any) => API.get('/products', { params: p }),
  getOne:        (id: string) => API.get(`/products/${id}`),
  // getBySlug: (slug: string) => API.get(`/products/${slug}`),
  getFeatured:   ()           => API.get('/products/featured'),
  getByCategory: (id: string) => API.get(`/products/category/${id}`),
  create:        (fd: FormData) => API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:        (id: string, fd: FormData) => API.put(`/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:        (id: string) => API.delete(`/products/${id}`),
}

export const categoryAPI = {
  getAll:  ()           => API.get('/categories'),
  getOne:  (id: string) => API.get(`/categories/${id}`),
  create:  (fd: FormData) => API.post('/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:  (id: string, fd: FormData) => API.put(`/categories/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:  (id: string) => API.delete(`/categories/${id}`),
}

export const orderAPI = {
  create:        (d: any) => API.post('/orders', d),
  getMyOrders:   (p?: any) => API.get('/orders/my-orders', { params: p }),
  getMyOrder:    (id: string) => API.get(`/orders/my-orders/${id}`),
  uploadPayment: (id: string, fd: FormData) => API.post(`/orders/my-orders/${id}/payment-proof`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  cancel:        (id: string) => API.put(`/orders/my-orders/${id}/cancel`),
  getAllAdmin:    (p?: any)    => API.get('/orders/admin/all', { params: p }),
  getAdminOrder: (id: string) => API.get(`/orders/admin/${id}`),
  updateStatus:  (id: string, d: any) => API.put(`/orders/admin/${id}/status`, d),
}

export const adminAPI = {
  getDashboard:  ()       => API.get('/admin/dashboard'),
  getAnalytics:  (p?: any) => API.get('/admin/analytics', { params: p }),
  getUsers:      (p?: any) => API.get('/admin/users', { params: p }),
  toggleSuspend: (id: string) => API.put(`/admin/users/${id}/suspend`),
  getUserOrders: (id: string) => API.get(`/admin/users/${id}/orders`),
}

export const couponAPI = {
  validate: (d: any) => API.post('/coupons/validate', d),
  getAll:   ()       => API.get('/coupons'),
  create:   (d: any) => API.post('/coupons', d),
  update:   (id: string, d: any) => API.put(`/coupons/${id}`, d),
  delete:   (id: string) => API.delete(`/coupons/${id}`),
}

export const quoteAPI = {
  submit:     (d: any) => API.post('/quotes', d),
  getMyQuotes: ()       => API.get('/quotes/my-quotes'),
  getAllAdmin:  (p?: any) => API.get('/quotes/admin/all', { params: p }),
  updateAdmin: (id: string, d: any) => API.put(`/quotes/admin/${id}`, d),
}

export default API
