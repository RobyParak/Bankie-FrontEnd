import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8081'
});

export default {
  // User Login
  login(loginData) {
    return apiClient.post('/login', loginData);
  },

  // Refresh JWT Token
  refreshAuthToken() {
    return apiClient.post('/refresh');
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