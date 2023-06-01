<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 100%">
      <h3>Employee Dashboard</h3>
      <q-option-group
        v-model="panel"
        inline
        :options="[
          { label: 'Edit User/Bank information', value: 'edit' },
          { label: 'New Bank Account', value: 'newBankAccount' },
          { label: 'Delete User', value: 'delUser' },
          { label: 'Deactivate Bank Account', value: 'delAccount' }
        ]"
      />

      <q-tab-panels v-model="panel" animated class="shadow-2 rounded-borders">
        <q-tab-panel name="edit">
          <div class="text-h6">Edit Information</div>
          <q-input outlined bottom-slots v-model="text" label="Search Users" counter maxlength="30" :dense="dense">
            <template v-slot:append>
              <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
              <q-icon name="search" />
            </template>
          </q-input>
          <!-- User table -->
          <q-table
            :rows="usersRows"
            :columns="usersColumns"
            title="Users"
            :rows-per-page-options="[]"
            row-key="Fname"
            binary-state-sort
          >
            <template #body="props">
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
                    <q-td key="Role" :props="props">
                        {{ props.row.Role }}
                        <q-popup-edit v-model="props.row.Role" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                        </q-popup-edit>
                    </q-td>
              </q-tr>
            </template>
          </q-table>

          <div class="spacing" style="height: 100px;"></div>
          <q-input outlined bottom-slots v-model="text" label="Search Bank Accounts" counter maxlength="30" :dense="dense">
            <template v-slot:append>
              <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
              <q-icon name="search" />
            </template>
          </q-input>

          <!-- Bank Account table -->
          <q-table
            :rows="bankAccountRows"
            :columns="bankAccountColumns"
            title="Bank Accounts"
            :rows-per-page-options="[]"
            row-key="iban"
            binary-state-sort
          >
            <template #body="props">
              <q-tr :props="props">
                <q-td key="IBAN" :props="props">
                  {{ props.row.iban }}
                </q-td>
                <q-td key="OwnerID" :props="props">
                  {{ props.row.ownerID }}
                </q-td>
                <q-td key="Balance" :props="props">
                  {{ props.row.balance }}
                </q-td>
                <q-td key="AbsoluteLimit" :props="props">
                  <q-popup-edit v-model="props.row.absoluteLimit" buttons v-slot="scope">
                    <q-input
                      v-model="scope.modelValue"
                      dense
                      autofocus
                      counter
                      @keyup.enter="scope.set"
                      @input="scope.modelValue = $event.target.value"
                    />
                  </q-popup-edit>
                </q-td>
                <q-td key="Status" :props="props">
                  {{ props.row.status }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-tab-panel>
    <!-- ADD A BANK ACCOUNT -->

        <q-tab-panel name="newBankAccount">
          <div class="text-h6">Add new Bank Account</div>
          <div class="q-pa-md" style="justify-content: center; padding-left: 3em; max-width: 80%;">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-select filled v-model="model" :options="options" label="User Account" />
        <q-input
        filled
        v-model="price"
        prefix="€"
        label="Amount"
        mask="#.##"
        fill-mask="0"
        input-class="text-right"
      />
      <q-input
            filled
            v-model="absoluteLimit"
            label="Absolute Limit"
            placeholder="€1000"
        />
        <q-btn-toggle
        v-model="model"
        class="my-custom-toggle"
        no-caps
        rounded
        unelevated
        toggle-color="indigo-11"
        color="white"
        text-color="black"
        :options="[
          {label: 'Current Account', value: 'one'},
          {label: 'Savings Account', value: 'two'}
        ]"
      />
        <div>
          <q-btn  class="q-ml-auto" style="background: #f919a9; color: white" label="Add New Bank Account" type="submit" />
        </div>
      </q-form>
    </div>
    <!-- DELETE USER -->
        </q-tab-panel>
        <q-tab-panel name="delUser">
          <div class="text-h6">Delete User</div>
          <q-input outlined bottom-slots v-model="text" label="Search Users" counter maxlength="30" :dense="dense">
  <template v-slot:append>
    <q-icon name="search" />
  </template>
</q-input>
  <q-table
      flat bordered
      :rows="usersRows"
      :columns="usersColumns"
      row-key="Fname"
      selection="single"
      v-model:selected="selectedUser"
    />
    <div class="q-mt-md">
      Selected: {{ JSON.stringify(selectedUser) }}
    </div>
    <q-btn  class="q-ml-auto" style="background: #800000; color: white" label="Delete User" type="submit" />
        </q-tab-panel>
<!-- DEACTIVATE BANK ACCOUNT -->
        <q-tab-panel name="delAccount">
          <div class="text-h6">Deactivate Bank Account</div>
          <q-input outlined bottom-slots v-model="text" label="Search Bank Accounts" counter maxlength="30" :dense="dense">
  <template v-slot:append>
    <q-icon name="search" />
  </template>
</q-input>
          <q-table
      flat bordered
      :rows="bankAccountRows"
      :columns="bankAccountColumns"
      row-key="iban"
      selection="single"
      v-model:selected="selectedBankAccount"
    />
    <div class="q-mt-md">
      Selected: {{ JSON.stringify(selectedBankAccount) }}
    </div>
    <q-btn  class="q-ml-auto" style="background: #800000; color: white" label="Deactivate Bank Account" type="submit" />
        </q-tab-panel>

      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios';
import jwtDecode from 'jsonwebtoken';

export default {
  name: 'UserDashboard',
  setup() {
    const bankAccountColumns = [
      { name: 'IBAN', align: 'left', label: 'IBAN', field: 'iban' },
      { name: 'OwnerID', align: 'left', label: 'OwnerID', field: 'ownerID' },
      { name: 'Balance', label: 'Balance', field: 'balance' },
      { name: 'AbsoluteLimit', label: 'Absolute Limit (editable)', field: 'absoluteLimit' },
      { name: 'Status', label: 'Status', field: 'status' },
    ]

    const bankAccountRows = ref([
      {
        iban: 'NL12345678900',
        ownerID: 765,
        balance: 1234.5678,
        absoluteLimit: 1000,
        status: 'Inactive',
      },
      {
        iban: 'NL12345678900',
        ownerID: 765,
        balance: 1234.5678,
        absoluteLimit: 1000,
        status: 'Active',
      },
    ])

    const usersColumns = [
      { name: 'FirstName', align: 'left', label: 'First Name', field: 'Fname' },
      { name: 'LastName', align: 'center', label: 'Last Name', field: 'Lname' },
      { name: 'Phone', label: 'Phone', field: 'phone' },
      { name: 'Email', label: 'Email', field: 'email' },
      { name: 'DailyLimit', label: 'Daily Limit', field: 'Dlimit' },
      { name: 'TransactionLimit', label: 'Transaction Limit', field: 'Tlimit' },
      { name: 'Role', label: 'Role', field: 'Role' },
    ]

    const usersRows = ref([
      {
        Fname: 'John',
        Lname: 'Doe',
        phone: 12345678,
        email: 'email@fakeemail.com',
        Dlimit: 4.0,
        Tlimit: 87,
        Role: 'user',
      },
      {
        Fname: 'John',
        Lname: 'Doetoo',
        phone: 12345678,
        email: 'email@fakeemail.com',
        Dlimit: 4.0,
        Tlimit: 87,
        Role: 'customer',
      },
    ])
    return {
      bankAccountColumns,
      panel: ref('edit'),
      bankAccountRows,
      usersColumns,
      usersRows,
      model: ref('one'),
      selectedUser: ref([]),
      selectedBankAccount: ref([]),
    }
  },
}
</script>
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>