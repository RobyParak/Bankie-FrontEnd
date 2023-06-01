import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:8081'
});

// Add an interceptor to set the token in the request headers
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default {
  // User Login
  login(loginData) {
    return apiClient.post('/login', loginData);
  },

  // Get all users
  getAllUsers(params) {
    return apiClient.get('/users', { params });
  },

  // Create a new user
  createUser(userData) {
    return apiClient.post('/users', userData);
  },

  // Get a user by ID
  getUserById(userId) {
    return apiClient.get(`/users/${userId}`);
  },

  // Update a user by ID
  updateUserById(userId, userData) {
    return apiClient.put(`/users/${userId}`, userData);
  },

  // Delete a user by ID
  deleteUserById(userId) {
    return apiClient.delete(`/users/${userId}`);
  },

  // Create an account
  createAccount(accountData) {
    return apiClient.post('/bankaccounts', accountData);
  },

  // Get account details
  getAccountById(accountId) {
    return apiClient.get(`/bankaccounts/${accountId}`);
  },

  // Perform a transaction
  performTransaction(transactionData) {
    return apiClient.post('/transactions', transactionData);
  },

  // Get transaction history
  getTransactionHistory() {
    return apiClient.get('/transactions');
  }
};
