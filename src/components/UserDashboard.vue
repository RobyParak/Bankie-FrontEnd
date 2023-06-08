<template>
  <q-btn class="q-ml-auto" id="logoutBtn" style="background: #f919a9; color: white" label="Logout" @click="logout" />
  <q-layout view="hHh Lpr fFf">
    <h3>Dashboard</h3>
    <div style="display: flex; flex-direction: column; align-items: flex-start;">
      <h4 style="text-align: left; padding-left: 1em; margin-bottom: 0;">Welcome, {{ user.firstName + " " + user.lastName}}!</h4>
      <q-btn
          label="Edit your info"
          id="EditUser"
          style="background: #f919a9; color: white; margin-top: 0.5em; margin-left: 3em;"
          @click="toggleUserForm"
      />
    </div>

    <div v-if="showUserForm" class="q-pa-md">
      <div class="q-gutter-y-md column" style="max-width: 300px">
        <q-input
            clearable
            filled
            clear-icon="clear"
            color="indigo"
            v-model="user.firstName"
            label="First Name"
            :rules="[val => !!val || 'First Name is required', val => (val && val.length >= 2) || 'First Name must be more than or equal to 2 characters']"
        >
          <template v-if="user.firstName === updateUser.firstName" v-slot:append>
            <q-icon name="cancel" @click.stop.prevent="user.firstName = ''" class="cursor-pointer" />
          </template>
        </q-input>
        <q-input
            clearable
            filled
            clear-icon="clear"
            color="indigo"
            v-model="user.lastName"
            label="Last Name"
            :rules="[val => !!val || 'Last Name is required', val => (val && val.length >= 2) || 'Last Name must be more than or equal to 2 characters']"
        >
          <template v-if="user.lastName === updateUser.lastName" v-slot:append>
            <q-icon name="cancel" @click.stop.prevent="user.lastName = ''" class="cursor-pointer" />
          </template>
        </q-input>
        <q-input
            clearable
            filled
            clear-icon="clear"
            color="indigo"
            v-model="user.email"
            label="Email"
            :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Please enter a valid email']"
        >
          <template v-if="user.email === updateUser.email" v-slot:append>
            <q-icon name="cancel" @click.stop.prevent="user.email = ''" class="cursor-pointer" />
          </template>
        </q-input>
        <q-input
            clearable
            filled
            clear-icon="clear"
            color="indigo"
            v-model="user.phoneNumber"
            label="Phone Number"
            :rules="[val => !!val || 'Phone Number is required', val => (val && val.length >= 10) || 'Phone Number must be more than or equal to 10 characters']"
        >
          <template v-if="user.phone === updateUser.phone" v-slot:append>
            <q-icon name="cancel" @click.stop.prevent="user.phone = ''" class="cursor-pointer" />
          </template>
        </q-input>
        <q-btn
            label="Save"
            id="saveUser"
            style="background: #f919a9; color: white; margin-top: 0.5em; margin-left: 3em;"
            @click="saveUser"
        />
      </div>
    </div>

    <q-page-container>
      <q-splitter v-model="splitterPosition" class="my-splitter">
        <q-page class="q-pa-md" style="padding-left: 5em; padding-top: 0" :style="{ width: '80%' }">
          <h5 style="text-align: left;">Current Account Balance: {{ currentAccount.balance }}</h5>
          <q-input filled v-model="transactionSearchText" label="Search" placeholder="Type to search transaction" :dense="dense" style="padding: 1em; width: 300px">
            <template v-slot:append>
              <q-icon v-if="transactionSearchText !== ''" name="close" @click="transactionSearchText = ''" class="cursor-pointer" />
              <q-icon name="search" />
            </template>
          </q-input>
          <q-table class="my-sticky-header-table" flat bordered title="Current Account" :rows="filteredCurrentTransactionsRows" :columns="columns" row-key="name"
          />

          <h5 style="text-align: left;">Savings Account Balance: {{ savingsAccount.balance }}</h5>
          <q-table class="my-sticky-header-table" flat bordered title="Savings Account" :rows="filteredSavingsTransactionsRows" :columns="columns" row-key="name"
          />
        </q-page>
        <q-page class="q-pa-md" style="alignment: center; padding-right: 3em;" :style="{ width: '20%' }">
          <q-btn class="q-ml-auto" id="transactionButton" label="Make a new transaction" to="/transaction" />
        </q-page>
      </q-splitter>
    </q-page-container>
  </q-layout>
</template>

<script>
import api from '../../axios.js'
import jwtDecode from 'jwt-decode';
import { computed, ref, onMounted, reactive } from 'vue';

export default {
  name: 'UserDashboard',
  setup() {
    const updateUser = reactive({});
    const splitterPosition = ref(0);
    const bankAccounts = ref([]);
    const currentAccount = ref({});
    const savingsAccount = ref({});
    const user = reactive({});
    const showUserForm = ref(false);
    const transactionSearchText = ref('');

    const transC = ref([]);
    const transS = ref([]);
    const filteredCurrentTransactionsRows = computed(() => {
      return transC.value.filter(row =>
        row.comment.toLowerCase().includes(transactionSearchText.value.toLowerCase()) ||
        row.accountTo.toLowerCase().includes(transactionSearchText.value.toLowerCase()) ||
        row.accountFrom.toLowerCase().includes(transactionSearchText.value.toLowerCase())
      );
    });
    const filteredSavingsTransactionsRows = computed(() => {
      return transS.value.filter(row =>
        row.comment.toLowerCase().includes(transactionSearchText.value.toLowerCase()) ||
        row.accountTo.toLowerCase().includes(transactionSearchText.value.toLowerCase()) ||
        row.accountFrom.toLowerCase().includes(transactionSearchText.value.toLowerCase())
      );
    });
    const columns = [
  { field: 'time', label: 'Date' },
  { field: 'accountTo', label: 'Account To' },
  { field: 'accountFrom', label: 'Account From' },
  {
        name: 'amount',
        required: true,
        label: 'Amount',
        align: 'right',
        field: 'amount',
        sortable: true,
        format: (val) => {
          // Format the amount as currency with 2 decimal places and a euro sign
          const formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(val);

          return formattedAmount;
        },
      },
  { field: 'comment', label: 'Comment' },
];




    const getAllTransactions = async (iban) => {
      try {
        console.log(iban);
        const fromResponse = await api.getTransactionsByIbanFrom(iban);
        const toResponse = await api.getTransactionsByIbanTo(iban);
        const transactions = [...fromResponse.data, ...toResponse.data];
        console.log(transactions);
        return transactions;
      } catch (error) {
        console.error(error);
        return []; // Return an empty array or handle the error as needed
      }
    };

    const fetchUserAndAccounts = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const email = decodedToken.sub;

        try {
          const response = await api.getAccountByEmail(email);
          // Update the user data with the retrieved data
          user.firstName = response.data[0].firstName;
          user.lastName = response.data[0].lastName;
          user.email = response.data[0].email;
          user.phoneNumber = response.data[0].phoneNumber;

          const bankAccountsResponse = await api.getBankAccounts(response.data[0].id);
          bankAccounts.value = bankAccountsResponse.data;

          // Categorize bank accounts as current or saving
          bankAccounts.value.forEach(account => {
            if (account.typeId === 1) {
              currentAccount.value = account;
            } else if (account.typeId === 0) {
              savingsAccount.value = account;
            }
          });

          // Fetch transactions for the current account
          const currentAccountTransactions = await getAllTransactions(currentAccount.value.iban);
          transC.value = currentAccountTransactions;

          // Fetch transactions for the savings account
          const savingsAccountTransactions = await getAllTransactions(savingsAccount.value.iban);
          transS.value = savingsAccountTransactions;
        } catch (error) {
          console.error('Error retrieving user data:', error);
        }
      } else {
        // Redirect the user to the login page if there is no token
        // window.location.href = '/login';
        console.log('No token available');
      }
    };

    const logout = () => {
      localStorage.removeItem('token');
      // Redirect the user to the login page after logging out
      // window.location.href = '/login';
      console.log('Logged out');
    };

    const toggleUserForm = () => {
      showUserForm.value = !showUserForm.value;
    };

    const saveUser = async () => {
      try {
        await api.updateUser(user);
        toggleUserForm();
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    };

    onMounted(fetchUserAndAccounts);

    return {
      updateUser,
      splitterPosition,
      bankAccounts,
      currentAccount,
      savingsAccount,
      user,
      showUserForm,
      transactionSearchText,
      filteredCurrentTransactionsRows,
      filteredSavingsTransactionsRows,
      logout,
      toggleUserForm,
      saveUser,
      columns
    };
  }
};
</script>




<style scoped>
#logoutBtn {
  border-radius: 20px;
  padding: 8px 16px;
  position:absolute;
  top: 1em;
  right:1em;
}
#EditUser {
  margin-left: 3em;
  position: relative;
}
#transactionButton {
  border-radius: 20px;
  padding: 8px 16px;
  position: center;
}

</style>

<style lang="sass">
.my-sticky-header-table
  height: 310px
  width: 70%

  .q-table__top
    background-color: #f919a9
    color: white
  .q-table__bottom
    background-color: #ffffff

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>