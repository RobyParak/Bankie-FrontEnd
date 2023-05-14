<template>
  <div class="q-pa-md" style="padding-left:4em; padding-top: 2px">
    <q-btn class="q-ml-auto" style="background: #f919a9; color: white" label="Logout" @click="logout"/>
    <h3>Dashboard</h3>
    <h4 style="text-align: left;">Welcome, {{ userName }}!</h4>

    <h5 style="text-align: left;">Current Account Balance: {{ balance }}</h5>
    <q-table
        class="my-sticky-header-table"
        flat bordered
        title="Current Account"
        :rows="currentAccountRows"
        :columns="columns"
        row-key="name"
    />

      <h5 style="text-align: left;">Savings Account Balance: {{ balance }}</h5>
    <q-table
        class="my-sticky-header-table"
        flat bordered
        title="Savings Account"
        :rows="savingsAccountRows"
        :columns="columns"
        row-key="name"
    />
  </div>

</template>

<script>
import { QBtn, QTable } from 'quasar'

export default {
  name: 'UserDashboard',
  components: {
    QBtn,
    QTable
  },
  data() {
    return {
      userName: 'Soft Kitty',
      balance: 1000.00,
      currentAccountRows: [
        {
          date: '2023-05-01',
          from: 'John Doe',
          to: 'Jane Smith',
          amount: 500.00
        },
        {
          date: '2023-05-08',
          from: 'James Johnson',
          to: 'John Doe',
          amount: 1500.00
        }
      ],
      savingsAccountRows: [
        {
          date: '2023-05-05',
          from: 'Jane Smith',
          to: 'James Johnson',
          amount: 2000.00
        }
      ]
    }
  },
  methods: {
    logout() {
      // perform logout action here
    }
  }
}
</script>

<style scoped>
.q-btn {
  border-radius: 20px;
  padding: 8px 16px;
  position:absolute;
  top: 1em;
  right:1em;
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