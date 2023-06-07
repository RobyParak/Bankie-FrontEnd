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

// Enable CORS headers
apiClient.interceptors.response.use(response => {
  // Add CORS headers to the response
  response.headers['Access-Control-Allow-Origin'] = '*';
  response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
  response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

  return response;
}, error => {
  return Promise.reject(error);
});
export default {
  // User Login
  login(loginData) {
    return apiClient.post('/login', loginData);
  },

  // Create a new user
  createUser(userData) {
    return apiClient.post('/users', userData);
  },
  //get transactions by iban
  getTransactionsByIbanFrom(iban) {
    return apiClient.get(`/transactions?accountfrom=${iban}`);
  },
  getTransactionsByIbanTo(iban) {
    return apiClient.get(`/transactions?accountto=${iban}`);
},
    // Get all users
    getAllUsers() {
      return apiClient.get('/users');
    },
      //get all bank accounts
  getAllBankAccounts() {
    return apiClient.get(`/bankaccounts`);
  },
  //get user's accounts
  getBankAccounts(ownerId) {
    return apiClient.get(`/bankaccounts?ownerId=${ownerId}`);
  },
  getBankAccountByIban(iban) {
    return apiClient.get(`/bankaccounts?iban=${iban}`);
  },
  // Update a user by ID
  updateUserById(userId, userData) {
    return apiClient.put(`/users/${userId}`, userData);
  },

  // Delete a user by ID
  deleteUserById(userId) {
    return apiClient.delete(`/users/${userId}`);
  },

    // Get all bankaccounts
    getAllAccounts(params) {
      return apiClient.get('/bankaccounts', { params });
    },

  // Create an account
  createAccount(accountData) {
    return apiClient.post('/bankaccounts', accountData);
  },

  // Get account details
  getAccountByEmail(email) {
    return apiClient.get(`/users?email=${email}`);
  },

  // Perform a transaction
  performTransaction(transactionData) {
    return apiClient.post('/transactions', transactionData);
  },

  // Get transaction history
  getTransactionHistory(transactionData) {
    return apiClient.get('/transactions', transactionData);
  },
  disableBankAccount(iban, accountData) {
    return apiClient.put(`/bankaccounts/${iban}`, accountData);
  }
};
