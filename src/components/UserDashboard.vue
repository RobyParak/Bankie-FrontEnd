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

    <div class="q-pa-md" v-if="showUserForm" style="max-width: 300px; padding-left: 3em">
      <div class="cursor-pointer">
        <div class="q-gutter-y-md column">
        <div>
          <q-input
              filled
              v-model="user.firstName"
              label="First Name"
              placeholder="First Name"
          />
          <q-popup-edit v-model="showPopup.firstName" buttons v-slot="scope">
              <q-input v-model="user.firstName"
                       dense
                       autofocus
                       counter
                       label="Last Name"
                       placeholder="Last Name"
                       :validate="validateName"
                       @keyup.enter="scope.set" />
            </q-popup-edit>
        </div>
        <div>
          <q-input
              filled
              v-model="user.lastName"
              label="Last Name"
              placeholder="Last Name"
          />
          <q-popup-edit  v-model="showPopup.lastName" buttons v-slot="scope">
            <q-input
                v-model="user.lastName"
                dense
                autofocus
                counter
                label="Last Name"
                placeholder="Last Name"
                :validate="validateName"
                @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </div>
        <div>
          <q-input
              filled
              v-model="user.email"
              label="Email"
              placeholder="Email"
          />

          <q-popup-edit  v-model="showPopup.email" buttons v-slot="scope">
            <q-input
                v-model="user.email"
                dense
                autofocus
                counter
                label="Email"
                placeholder="Email"
                :validate="validateEmailAddress"
                @keyup.enter="scope.set"
                @input="scope.modelValue = $event.target.value"
            />
          </q-popup-edit>
        </div>
        <div>
          <q-input
              filled
              v-model="user.phone"
              label="Phone Number"
              placeholder="Phone Number"
          />
          <q-popup-edit  v-model="showPopup.lastName" buttons v-slot="scope">
            <q-input
                v-model="user.phone"
                dense
                autofocus
                counter
                label="Phone Number"
                placeholder="Phone Number"
                @click="openPopup('phone')"
                :validate="validatePhoneNumber"
                @keyup.enter="scope.set"
                @input="scope.modelValue = $event.target.value"
            />
          </q-popup-edit>
        </div>
        </div>
      </div>
    </div>

    <q-page-container>
      <q-splitter v-model="splitterPosition" class="my-splitter">
        <q-page class="q-pa-md" style="padding-left: 5em; padding-top: 0" :style="{ width: '80%' }">
          <h5 style="text-align: left;">Current Account Balance: {{ balance }}</h5>
          <q-table
              class="my-sticky-header-table"
              flat
              bordered
              title="Current Account"
              :rows="currentAccountRows"
              :columns="columns"
              row-key="name"
          />

          <h5 style="text-align: left;">Savings Account Balance: {{ balance }}</h5>
          <q-table
              class="my-sticky-header-table"
              flat
              bordered
              title="Savings Account"
              :rows="savingsAccountRows"
              :columns="columns"
              row-key="name"
          />
        </q-page>
        <q-page class="q-pa-md" style="alignment: center; padding-right: 3em;" :style="{ width: '20%' }">
          <q-input
              filled
              v-model="filterInput"
              label="Search"
              placeholder="Type to search transaction"
              :dense="dense"
              style="padding: 1em; width: 300px"
          />
          <q-btn class="q-ml-auto" id="transactionButton" label="Make a new transaction" to="/transaction" />
        </q-page>
      </q-splitter>
    </q-page-container>
  </q-layout>
</template>
<script>
export default {
  name: 'UserDashboard',
  data() {
    return {
      balance: 1000.0,
      splitterPosition: 0,
      currentAccountRows: [
        {
          date: '2023-05-01',
          from: 'John Doe',
          to: 'Jane Smith',
          amount: 500.0,
        },
        {
          date: '2023-05-08',
          from: 'James Johnson',
          to: 'John Doe',
          amount: 1500.0,
        },
      ],
      savingsAccountRows: [
        {
          date: '2023-05-05',
          from: 'Jane Smith',
          to: 'James Johnson',
          amount: 2000.0,
        },
      ],
      user: {
        firstName: 'Soft',
        lastName: 'Kitty',
        email: 'itworks@example.com',
        phone: '1234567890'
      },
      showUserForm: false,
      showPopup: {
        firstName: false,
        lastName: false,
        email: false,
        phone: false
      },
      errorFirstName: false, // Error state for firstName
      errorMessageFirstName: '', // Error message for firstName
      errorLastName: false, // Error state for lastName
      errorMessageLastName: '', // Error message for lastName
      errorEmailAddress: false, // Error state for emailAddress
      errorMessageEmailAddress: '', // Error message for emailAddress
      errorPhoneNumber: false, // Error state for phoneNumber
      errorMessagePhoneNumber: '', // Error message for phoneNumber
    };
  },
  methods: {
    logout() {
      // Clear session data and route to log in page
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    toggleUserForm() {
      this.showUserForm = !this.showUserForm
    },
    validateName(value) {
      if (!value || value.length === 0) {
        this.errorFirstName = true;
        this.errorMessageFirstName = 'Please enter your first name';
        return false;
      }
      this.errorFirstName = false;
      this.errorMessageFirstName = '';
      return true;
    },
    validateEmailAddress(value) {
      if (!value || !/.+@.+\..+/.test(value)) {
        this.errorEmailAddress = true;
        this.errorMessageEmailAddress = 'Please enter a valid email address';
        return false;
      }
      this.errorEmailAddress = false;
      this.errorMessageEmailAddress = '';
      return true;
    },
    validatePhoneNumber(value) {
      if (!value || value.length < 10) {
        this.errorPhoneNumber = true;
        this.errorMessagePhoneNumber = 'Please enter a valid phone number';
        return false;
      }
      this.errorPhoneNumber = false;
      this.errorMessagePhoneNumber = '';
      return true;
    },
  },
  computed: {
    columns() {
      return [
        { name: 'date', required: true, label: 'Date', align: 'left', field: 'date', sortable: true },
        { name: 'from', required: true, label: 'From', align: 'left', field: 'from', sortable: true },
        { name: 'to', required: true, label: 'To', align: 'left', field: 'to', sortable: true },
        { name: 'amount', required: true, label: 'Amount', align: 'right', field: 'amount', sortable: true },
      ]
    }
  }
}
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