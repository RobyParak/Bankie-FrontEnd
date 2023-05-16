<template>
    <q-btn class="q-ml-auto" id="logoutBtn" style="background: #f919a9; color: white" label="Logout" @click="logout"/>
    <q-layout view="hHh Lpr fFf">
      <h3>Employee Dashboard</h3>
      <q-page-container>
        <q-splitter v-model="splitterPosition" class="my-splitter">
          <q-page class="q-pa-md" style="padding-left: 5em" :style="{ width: '65%' }">
            <div id="q-app" style="min-height: 100vh;">
            <div class="q-pa-md">
                <q-table
                :rows="usersWithAccountRows"
                :columns="usersWithAccountsColumns"
                title="Users (with accounts)"
                :rows-per-page-options="[]"
                row-key="name"
                selection="single"
                v-model:selected="selectedRowsWithAccounts"
                >
                <template v-slot:body="props">
                    <q-tr :props="props" :class="{ 'q-table__row--selected': selectedRowsWithAccounts.includes(props.row) }">
                    <q-td key="FirstName" :props="props">
                        {{ props.row.Fname }}
                        <q-popup-edit v-model="props.row.Fname" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                        </q-popup-edit>
                    </q-td>
                    <q-td key="LastName" :props="props">
                        {{ props.row.Lname }}
                        <q-popup-edit v-model="props.row.Lname" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                        </q-popup-edit>
                    </q-td>
                    <q-td key="Phone" :props="props">
                        {{ props.row.phone }}
                        <q-popup-edit v-model="props.row.phone" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                        </q-popup-edit>
                    </q-td>
                    <q-td key="Email" :props="props">
                        {{ props.row.email }}
                        <q-popup-edit v-model="props.row.email" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                        </q-popup-edit>
                    </q-td>
                    <q-td key="DailyLimit" :props="props">
                        €{{ props.row.Dlimit }}
                        <q-popup-edit v-model="props.row.Dlimit" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                        </q-popup-edit>
                    </q-td>
                    <q-td key="TransactionLimit" :props="props">
                        €{{ props.row.Tlimit }}
                        <q-popup-edit v-model="props.row.Tlimit" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                        </q-popup-edit>
                    </q-td>
                    </q-tr>
                </template>
                </q-table>
                <div class="q-mt-md">
      Selected: {{ JSON.stringify(selected) }}
    </div>
            </div>
</div>
          </q-page>
          <q-page class="q-pa-md" style="alignment: center; padding-right: 3em;" :style="{ width: '35%' }">
            <q-table
            :rows="usersWithoutAccountRows"
            :columns="usersWithoutAccountsColumns"
            title="Users (no accounts)"
            :rows-per-page-options="[]"
            row-key="name"
            selection="single"
            v-model:selected="selectedRowsWithoutAccounts"
                >
                <template v-slot:body="props">
                    <q-tr :props="props">
                    <q-td key="FirstName" :props="props">
                        {{ props.row.Fname }}
                        <q-popup-edit v-model="props.row.Fname" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                        </q-popup-edit>
                    </q-td>
                    <q-td key="LastName" :props="props">
                        {{ props.row.Lname }}
                        <q-popup-edit v-model="props.row.Lname" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                        </q-popup-edit>
                    </q-td>
                    <q-td key="Phone" :props="props">
                        {{ props.row.phone }}
                        <q-popup-edit v-model="props.row.phone" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                        </q-popup-edit>
                    </q-td>
                    <q-td key="Email" :props="props">
                        {{ props.row.email }}
                        <q-popup-edit v-model="props.row.email" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                        </q-popup-edit>
                    </q-td>
                    </q-tr>
                </template>
                </q-table>
                <div class="q-mt-md">
      Selected: {{ JSON.stringify(selected) }}
    </div>
           
          </q-page>
        </q-splitter>
      </q-page-container>
    </q-layout>
  
  </template>
<script>
import { ref } from 'vue'

export default {
  name: 'UserDashboard',
  setup() {
    const usersWithAccountsColumns = [
      { name: 'FirstName', align: 'left', label: 'First Name', field: 'Fname' },
      { name: 'LastName', align: 'center', label: 'Last Name', field: 'Lname' },
      { name: 'Phone', label: 'Phone', field: 'phone' },
      { name: 'Email', label: 'Email', field: 'email' },
      { name: 'DailyLimit', label: 'Daily Limit', field: 'Dlimit' },
      { name: 'TransactionLimit', label: 'Transaction Limit', field: 'Tlimit' },
    ]

    const usersWithAccountRows = ref([
      {
        Fname: 'John',
        Lname: 'Doe',
        phone: 12345678,
        email:  'email@fakeemail.com',
        Dlimit: 4.0,
        Tlimit: 87,
      },
      {
        Fname: 'John',
        Lname: 'Doetoo',
        phone: 12345678,
        email:  'email@fakeemail.com',
        Dlimit: 4.0,
        Tlimit: 87,
      },
    ])
    const usersWithoutAccountsColumns = [
      { name: 'FirstName', align: 'left', label: 'First Name', field: 'Fname' },
      { name: 'LastName', align: 'center', label: 'Last Name', field: 'Lname' },
      { name: 'Phone', label: 'Phone', field: 'phone' },
      { name: 'Email', label: 'Email', field: 'email' },
    ]
    const usersWithoutAccountRows = ref([
      {
        Fname: 'John',
        Lname: 'Doe',
        phone: 12345678,
        email: 'email@fakeemail.com',
        Dlimit: 4.0,
        Tlimit: 87,
      },
      {
        Fname: 'John',
        Lname: 'Doetoo',
        phone: 12345678,
        email:  'email@fakeemail.com',
        Dlimit: 4.0,
        Tlimit: 87,
      },
    ])

    return {
        selectedRowsWithoutAccounts: ref([]),
        selectedRowsWithAccounts: ref([]),
        usersWithAccountRows,
      usersWithoutAccountRows,
      usersWithAccountsColumns,
      usersWithoutAccountsColumns,
      splitterPosition: 0,
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
.q-table__row--selected {
  background-color: #e6f2ff;
}
</style>
  