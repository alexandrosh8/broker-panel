import axios from 'axios'

// Create axios instance
export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage')
    if (token) {
      try {
        const auth = JSON.parse(token)
        if (auth.state?.token) {
          config.headers.Authorization = `Bearer ${auth.state.token}`
        }
      } catch (error) {
        console.error('Error parsing auth token:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  register: (userData) => api.post('/auth/register', userData),
}

export const singleCalculatorAPI = {
  getData: () => api.get('/single/data'),
  saveData: (data) => api.post('/single/data', data),
  exportCSV: () => api.get('/single/export'),
}

export const proCalculatorAPI = {
  getData: () => api.get('/pro/data'),
  saveData: (data) => api.post('/pro/data', data),
  exportCSV: () => api.get('/pro/export'),
}

export const brokerAPI = {
  getAccounts: () => api.get('/broker/accounts'),
  saveAccount: (account) => api.post('/broker/accounts', account),
  updateAccount: (id, account) => api.put(`/broker/accounts/${id}`, account),
  deleteAccount: (id) => api.delete(`/broker/accounts/${id}`),
  getCosts: () => api.get('/broker/costs'),
  saveCost: (cost) => api.post('/broker/costs', cost),
  updateCost: (id, cost) => api.put(`/broker/costs/${id}`, cost),
  deleteCost: (id) => api.delete(`/broker/costs/${id}`),
  getProxies: () => api.get('/broker/proxies'),
  saveProxy: (proxy) => api.post('/broker/proxies', proxy),
  updateProxy: (id, proxy) => api.put(`/broker/proxies/${id}`, proxy),
  deleteProxy: (id) => api.delete(`/broker/proxies/${id}`),
}