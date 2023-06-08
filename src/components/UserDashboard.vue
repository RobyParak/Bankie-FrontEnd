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
          <q-table class="my-sticky-header-table" flat bordered title="Current Account" :rows="currentAccountRows" :columns="columns" row-key="name"
          />

          <h5 style="text-align: left;">Savings Account Balance: {{ savingsAccount.balance }}</h5>
          <q-table class="my-sticky-header-table" flat bordered title="Savings Account" :rows="savingsAccountRows" :columns="columns" row-key="name"
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
// import { computed, ref } from 'vue';

export default {
  name: 'UserDashboard',
  data() {
    return {
      updateUser: {},
      splitterPosition: 0,
      bankAccounts: [],
      currentAccount: {},
      savingsAccount: {},
      user : {},
      currentAccountRows: [],
      savingsAccountRows: [],
      showUserForm: false,
    };
  },
    mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const email = decodedToken.sub;

      api.getAccountByEmail(email)
        .then(response => {
          // Update the user data with the retrieved data
          this.user = response.data[0];
          api.getBankAccounts(this.user.id)
            .then(response => {
              this.bankAccounts = response.data;
              console.log(this.bankAccounts);

              // Categorize bank accounts as current or saving
              this.bankAccounts.forEach(account => {
                if (account.typeId == 1) {
                  this.currentAccount = account;
                } else if (account.typeId == 0) {
                  this.savingsAccount = account;
                }
              });
              const transC = this.getAllTransactions(this.currentAccount.iban);
              this.currentAccountRows = transC;
              const transS = this.getAllTransactions(this.savingsAccount.iban);
              this.savingsAccountRows = transS;

            })
            .catch(error => {
              console.error('Error retrieving bank accounts:', error);
            });
        })
        .catch(error => {
          console.error('Error retrieving user data:', error);
        });
    } else {
      this.$router.push('/login');
    }
  },
  setup() {
    // const transactionSearchText = ref('');
    // const filteredCurrentRows = computed(() => {
    //   return currentAccountRows.value.filter(
    //     (row) =>
    //       row.time.includes(transactionSearchText.value) ||
    //       row.accountFrom.includes(transactionSearchText.value) ||
    //       row.accountTo.includes(transactionSearchText.value) ||
    //       row.comment.includes(transactionSearchText.value)
    //   );
    // });
    // const filteredSavingsRows = computed(() => {
    //   return savingsAccountRows.value.filter(
    //     (row) =>
    //       row.time.includes(transactionSearchText.value) ||
    //       row.accountFrom.includes(transactionSearchText.value) ||
    //       row.accountTo.includes(transactionSearchText.value) ||
    //       row.comment.includes(transactionSearchText.value)
    //   );
    // });

    // return {
    //   transactionSearchText,
    //   filteredCurrentRows,
    //   filteredSavingsRows
    // };
  },
  methods: {
    getAllTransactions(iban) {
      try {
        console.log(iban);
        const response = api.getTransactionsByIbanFrom(iban);
        console.log(response.data);
        return response.data;
       

      } catch (error) {
        console.error(error);
      }
    },
    changePage(page) {
      // Update the current page and fetch transactions for the new page
      this.currentPage = page;
    },
    logout() {
      // Clear session data and route to log in page
      localStorage.clear();
      this.$router.push('/login');
    },
    toggleUserForm() {
      this.showUserForm = !this.showUserForm;
    },
    saveUser() {
      this.updatedUser = { ...this.user }; // Store the updated user data

      // Perform the PUT request to the API with the updatedUser data
      api.updateUserById(this.user.id, this.updatedUser)
          .then(response => {
            // Handle the response
            console.log('User updated successfully:', response.data);
          })
          .catch(error => {
            // Handle the error
            console.error('Error updating user:', error);
          });
    },
  },
  watch: {
    transactionSearchText() {
      this.searchCurrentRows();
      this.searchSavingsRows();
    },
  },
  computed: {
    columns() {
      return [
        { name: 'time', required: true, label: 'Date', align: 'left', field: 'time', sortable: true },
        { name: 'accountFrom', required: true, label: 'From', align: 'left', field: 'accountFrom', sortable: true },
        { name: 'accountTo', required: true, label: 'To', align: 'left', field: 'accountTo', sortable: true },
        { name: 'amount', required: true, label: 'Amount', align: 'right', field: 'amount', sortable: true, format: (val) => {
          // Format the amount as currency with 2 decimal places and a euro sign
          const formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(val);

          return formattedAmount;
        },
      }
      ];
    },
  },
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