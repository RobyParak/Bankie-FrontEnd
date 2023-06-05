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
                <q-td key="firstName" :props="props">
                        {{ props.row.firstName }}
                        <q-popup-edit v-model="props.row.firstName" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" @blur="updateUser(props.row)"/>
                        </q-popup-edit>
                    </q-td>
                    <q-td key="lastName" :props="props">
                        {{ props.row.lastName }}
                        <q-popup-edit v-model="props.row.lastName" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" @blur="updateUser(props.row)"/>
                        </q-popup-edit>
                    </q-td>
                    <q-td key="phoneNumber" :props="props">
                        {{ props.row.phoneNumber }}
                        <q-popup-edit v-model="props.row.phoneNumber" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" @blur="updateUser(props.row)"/>
                        </q-popup-edit>
                    </q-td>
                    <q-td key="Email" :props="props">
                        {{ props.row.email }}
                        <q-popup-edit v-model="props.row.email" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" @blur="updateUser(props.row)"/>
                        </q-popup-edit>
                    </q-td>
                    <q-td key="dailyLimit" :props="props">
                        €{{ props.row.dailyLimit }}
                        <q-popup-edit v-model="props.row.dailyLimit" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" @blur="updateUser(props.row)"/>
                        </q-popup-edit>
                    </q-td>
                    <q-td key="transactionLimit" :props="props">
                        €{{ props.row.transactionLimit }}
                        <q-popup-edit v-model="props.row.transactionLimit" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" @blur="updateUser(props.row)"/>
                        </q-popup-edit>
                    </q-td>
                    <q-td key="role" :props="props">
                  {{ props.row.role }}
                </q-td>
                    <q-td key="bsn" :props="props">
                  {{ props.row.bsn }}
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

//import jwtDecode from 'jwt-decode';
import api from '../../axios.js';
import { ref, onMounted } from 'vue';

export default {
  name: 'UserDashboard',
  setup() {
    const bankAccountColumns = [
      { name: 'IBAN', align: 'left', label: 'IBAN', field: 'iban' },
      { name: 'OwnerID', align: 'left', label: 'OwnerID', field: 'ownerID' },
      { name: 'Balance', label: 'Balance', field: 'balance' },
      { name: 'AbsoluteLimit', label: 'Absolute Limit (editable)', field: 'absoluteLimit' },
      { name: 'Status', label: 'Status', field: 'status' },
    ];

    const bankAccountRows = ref([]);
    const getAllAccounts = async () => {
      try {
        const response = await api.getAllAccounts();
        bankAccountRows.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(() => {
      getAllUsers();
      getAllAccounts();
    });

    const usersColumns = [
      { name: 'firstName', align: 'left', label: 'First Name', field: 'firstName' },
      { name: 'lastName', align: 'center', label: 'Last Name', field: 'lastName' },
      { name: 'phoneNumber', label: 'Phone', field: 'phoneNumber' },
      { name: 'Email', label: 'Email', field: 'email' },
      { name: 'dailyLimit', label: 'Daily Limit', field: 'dailyLimit' },
      { name: 'transactionLimit', label: 'Transaction Limit', field: 'transactionLimit' },
      { name: 'role', label: 'Role', field: 'role' },
      { name: 'bsn', label: 'BSN', field: 'bsn' },
    ];

    const usersRows = ref([]); //make the edited rows reactive

    const getAllUsers = async () => {
      try {
        const response = await api.getAllUsers();
        usersRows.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(() => {
      getAllUsers();
    });

    return {
      bankAccountColumns,
      panel: ref('edit'),
      bankAccountRows,
      usersColumns,
      usersRows,
      model: ref('one'),
      selectedUser: ref([]),
      selectedBankAccount: ref([]),
    };
  },
  methods: {
    async getAllUsers() {
      try {
        const response = await api.getAllUsers();
        this.usersRows = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    updateUser(user) {
    api.updateUserById(user.id, user)
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
};

</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>