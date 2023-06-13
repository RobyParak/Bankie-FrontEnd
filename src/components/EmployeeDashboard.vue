<template>
  <q-btn class="q-ml-auto" id="logoutBtn" style="background: #f919a9; color: white" label="Logout" @click="logout" />
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 100%">
      <q-btn
          label="To User Dashboard"
          id="EditUser"
          style="background: #f919a9; color: white; float: left; top:1em"
          @click="goToUserDashboard"
      />
      <br>
      <br>
      <h3>Employee Dashboard</h3>
      <q-option-group
          v-model="panel"
          inline
          :options="[
          { label: 'Edit User/Bank information', value: 'edit' },
          { label: 'Select User', value: 'delUser' },
          { label: 'Deactivate Bank Account', value: 'delAccount' }
        ]"
      />

      <q-tab-panels v-model="panel" animated class="shadow-2 rounded-borders">
        <q-tab-panel name="edit">
          <div class="text-h6">Edit Information</div>
          <q-input outlined bottom-slots v-model="userSearchText" label="Search Users" counter maxlength="30" :dense="dense">
            <template v-slot:append>
              <q-icon v-if="userSearchText !== ''" name="close" @click="userSearchText = ''" class="cursor-pointer" />
              <q-icon name="search" />
            </template>
          </q-input>
          <!-- User table -->
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <q-table
              style="height: 400px"
              flat bordered
              ref="tableRef"
              :rows="filteredUsersRows"
              :columns="usersColumns"
              :table-colspan="9"
              row-key="firstname"
              virtual-scroll
              :virtual-scroll-item-size="48"
              :pagination="pagination"
              :rows-per-page-options="[0]"
              v-model:expanded="expanded"
          >
            <template #body="props">
              <q-tr>
                <q-td key="firstName" :props="props" class="editable">
                  {{ props.row.firstName }}
                  <q-popup-edit v-model="props.row.firstName" v-slot="scope">
                    <q-input v-model="scope.value" dense autofocus counter @keyup.enter="saveAndSetUser(scope, props.row)"/>
                  </q-popup-edit>
                </q-td>
                <q-td key="lastName" :props="props" class="editable">
                  {{ props.row.lastName }}
                  <q-popup-edit v-model="props.row.lastName" v-slot="scope">
                    <q-input v-model="scope.value" dense autofocus counter @keyup.enter="saveAndSetUser(scope, props.row)"/>
                  </q-popup-edit>
                </q-td>
                <q-td key="phoneNumber" :props="props" class="editable">
                  {{ props.row.phoneNumber }}
                  <q-popup-edit v-model="props.row.phoneNumber" v-slot="scope">
                    <q-input v-model="scope.value" dense autofocus counter @keyup.enter="saveAndSetUser(scope, props.row)"/>
                  </q-popup-edit>
                </q-td>
                <q-td key="Email" :props="props" class="editable">
                  {{ props.row.email }}
                  <q-popup-edit v-model="props.row.email" v-slot="scope">
                    <q-input v-model="scope.value" dense autofocus counter @keyup.enter="saveAndSetUser(scope, props.row)"/>
                  </q-popup-edit>
                </q-td>
                <q-td key="dailyLimit" :props="props" class="editable">
                  €{{ props.row.dailyLimit }}
                  <q-popup-edit v-model="props.row.dailyLimit" v-slot="scope">
                    <q-input v-model="scope.value" dense autofocus counter @keyup.enter="saveAndSetUser(scope, props.row)"/>
                  </q-popup-edit>
                </q-td>
                <q-td key="transactionLimit" :props="props" class="editable">
                  €{{ props.row.transactionLimit }}
                  <q-popup-edit v-model="props.row.transactionLimit" v-slot="scope">
                    <q-input v-model="scope.value" dense autofocus counter @keyup.enter="saveAndSetUser(scope, props.row)"/>
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
          <q-input outlined bottom-slots v-model="bankAccountSearchText" label="Search Bank Accounts" counter maxlength="30" :dense="dense">
            <template v-slot:append>
              <q-icon v-if="bankAccountSearchText !== ''" name="close" @click="bankAccountSearchText = ''" class="cursor-pointer" />
              <q-icon name="search" />
            </template>
          </q-input>

          <!-- Bank Account table -->
          <q-table
              :rows="filteredBankAccountRows"
              :columns="bankAccountColumns"
              title="Bank Accounts"
              :rows-per-page-options="[]"
              row-key="iban"
              binary-state-sort
          >
            <template #body="props">
              <q-tr :props="props">
                <q-td key="iban" :props="props">
                  {{ props.row.iban }}
                </q-td>
                <q-td key="ownerId" :props="props">
                  {{ props.row.ownerId }}
                </q-td>
                <q-td key="statusId" :props="props">
                  {{ props.row.statusId === 0 ? 'Active' : 'Inactive' }}
                </q-td>
                <q-td key="balance" :props="props">
                  {{
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(props.row.balance)
                  }}
                </q-td>
                <q-td key="absoluteLimit" :props="props" class="editable">
                  €{{ props.row.absoluteLimit }}
                  <q-popup-edit v-model="props.row.absoluteLimit" v-slot="scope">
                    <q-input v-model="scope.value" dense autofocus counter @keyup.enter="saveAndSetAbsoluteLimit(scope, props.row)"/>
                  </q-popup-edit>
                </q-td>
                <q-td key="typeId" :props="props">
                  {{ props.row.typeId === 0 ? 'Savings' : 'Current' }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="delUser">
          <div class="text-h6">Select User</div>
          <q-table
              flat bordered
              :rows="usersRows"
              :columns="usersColumns"
              row-key="id"
              selection="single"
              v-model:selected="selectedUser"
          />
          <q-btn  class="q-ml-auto" style="background: #800000; color: white; margin-right: 0.5em" label="Delete User" type="submit" @click="deleteUser" />
          <q-btn class="q-ml-auto" style="background: #547863; color: white; margin-right: 0.5em" label="Create Current Account" type="submit" @click="createCurrentAccount" :disable="hasExistingCurrentAccount" />
          <q-btn class="q-ml-auto" style="background: #547863; color: white; margin-right: 0.5em" label="Create Savings Account" type="submit" @click="createSavingsAccount" :disable="hasExistingSavingsAccount" />

        </q-tab-panel>
        <!-- DEACTIVATE BANK ACCOUNT -->
        <q-tab-panel name="delAccount">
          <div class="text-h6">Deactivate Bank Account</div>
          <q-table
              flat bordered
              :rows="bankAccountRows"
              :columns="bankAccountColumns"
              row-key="iban"
              selection="single"
              v-model:selected="selectedBankAccount"
          />
          <q-btn  class="q-ml-auto" style="background: #800000; color: white" label="Deactivate Bank Account" type="submit" @click="disableBankie" />
        </q-tab-panel>

      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import api from '../../axios.js';
import { ref, onMounted, computed } from 'vue';

export default {
  setup() {
    const errorMessage = ref('');
    const bankAccountColumns = [
      {name: 'iban', align: 'left', label: 'IBAN', field: 'iban'},
      {name: 'ownerId', label: 'Owner ID', field: 'ownerId', sortable: true},
      {name: 'statusId', label: 'status', field: 'statusId'},
      {name: 'balance', label: 'Balance', field: 'balance'},
      {name: 'absoluteLimit', label: 'Absolute Limit (editable)', field: 'absoluteLimit'},
      {name: 'typeId', label: 'Type ID', field: 'typeId'},
    ];

    const bankAccountRows = ref([]);

    const usersColumns = [
      {name: 'firstName', align: 'left', label: 'First Name', field: 'firstName', sortable: true},
      {name: 'lastName', align: 'center', label: 'Last Name', field: 'lastName'},
      {name: 'phoneNumber', label: 'Phone', field: 'phoneNumber'},
      {name: 'Email', label: 'Email', field: 'email'},
      {name: 'dailyLimit', label: 'Daily Limit', field: 'dailyLimit'},
      {name: 'transactionLimit', label: 'Transaction Limit', field: 'transactionLimit'},
      {name: 'role', label: 'Role', field: 'role', sortable: true},
      {name: 'bsn', label: 'BSN', field: 'bsn'},
    ];

    const usersRows = ref([]);
    const getAllUsers = async () => {
      try {
        const response = await api.getAllUsers();
        usersRows.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };
    const getAllBankAccounts = async () => {
      try {
        const response = await api.getAllBankAccounts();
        bankAccountRows.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };
    const userSearchText = ref('');
    const bankAccountSearchText = ref('');
    const filteredUsersRows = computed(() => {
      return usersRows.value.filter(row =>
          row.firstName.toLowerCase().includes(userSearchText.value.toLowerCase()) ||
          row.lastName.toLowerCase().includes(userSearchText.value.toLowerCase()) ||
          row.phoneNumber.includes(userSearchText.value) ||
          row.email.toLowerCase().includes(userSearchText.value.toLowerCase()) ||
          row.role.toLowerCase().includes(userSearchText.value.toLocaleLowerCase())
      );
    });
    const filteredBankAccountRows = computed(() => {
      return bankAccountRows.value.filter(row =>
          row.iban.toLowerCase().includes(bankAccountSearchText.value.toLowerCase()) ||
          String(row.ownerId).includes(bankAccountSearchText.value)
      );
    });


    function checkfortoken() {
      if (localStorage.getItem('token') === null) {
        window.location.href = '/login';
      }
    }

    onMounted(() => {
      getAllUsers();
      getAllBankAccounts();
      checkfortoken();
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
      userSearchText,
      bankAccountSearchText,
      filteredUsersRows,
      filteredBankAccountRows,
      errorMessage,

    };
  },
  computed: {
    hasExistingCurrentAccount() {

      return this.checkExistingAccount(this.selectedUser[0], 1);
    },
    hasExistingSavingsAccount() {
      return this.checkExistingAccount(this.selectedUser[0], 0 );
    },
  },

  methods: {
    checkExistingAccount(selectedUser, typeId) {
      if (!selectedUser || !this.bankAccountRows) return false; // No user selected or bankAccountRows is undefined
      const existingAccounts = this.bankAccountRows.filter(account => account.ownerId === selectedUser.id && account.typeId === typeId);
      return existingAccounts.length > 0;
    },
    logout() {
      // Clear session data and route to log in page
      localStorage.clear();
      this.$router.push('/login');
    },
    createSavingsAccount(){
      const accountData = {
        ownerId : this.selectedUser[0].id,
        statusId: 0,
        balance: 0,
        absoluteLimit: 0,
        //type id 1 is current and 0 is savings
        typeId: 0,
      };
      this.createAccount(accountData);
    },
    createCurrentAccount() {
      const accountData = {
        ownerId: this.selectedUser[0].id,
        statusId: 0,
        balance: 0,
        absoluteLimit: 0,
        //type id 1 is current and 0 is savings
        typeId: 1,
      };
      this.createAccount(accountData);
    },
    createAccount(accountData) {
      api.createAccount(accountData)
          .then(() => {
            console.log('Bank Account created successfully:');
           if (this.selectedUser[0].role !== 'Employee') {
              this.selectedUser[0].role = 'Customer';
              api.updateUserById(this.selectedUser[0].id, this.selectedUser[0])
                  .then(response => {
                    console.log('User updated successfully:', response.data);
                  })
                  .catch(error => {
                    // Handle the error
                    console.error('Error updating user:', error);
                  });
            }
          })
          .catch(error => {
            // Handle the error
            console.error('Error creating bank account:', error);
          });
      window.location.reload();
    },

    async getAllUsers() {
      try {
        const response = await api.getAllUsers();
        this.usersRows = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    deleteUser() {
      const user =this.selectedUser[0];
      api.deleteUserById(user.id)
          .then(() => {
            this.getAllUsers();
            console.log('User deleted successfully:');
          })
          .catch(error => {
            // Handle the error
            console.error('Error deleting user:', error);
          });
    },
    disableBankie()
    {
      // 0 = active, 1 = disabled
      this.selectedBankAccount[0].statusId = 1;
      if (this.selectedBankAccount[0].balance > 0) {
        this.errorMessage = 'Cannot disable bank account with a balance greater than 0.';
        return;
      }
      console.log(this.selectedBankAccount[0])
      api.updateBankAccountByIban(this.selectedBankAccount[0].iban, this.selectedBankAccount[0])
          .then(response => {
            console.log('Bank account disabled successfully:', response.data);
          })
          .catch(error => {
            // Handle the error
            console.error('Error disabling bank account:', error);
          });
    },
    saveAndSetUser(scope, row) {
      scope.set(); // Set the updated value before saving
      this.saveUser(row);
    },
    saveUser(row) {
      // Check nothing is NUll because we don't like the void
      if (!row.firstName || !row.lastName || !row.phoneNumber || !row.email || !row.dailyLimit || !row.transactionLimit) {
        this.errorMessage = 'Please fill in all required fields.';
        return;
      }
      else if (row.firstName.length < 2 || row.lastName.length < 2) {
        this.errorMessage = 'Name must be at least 2 characters long.';
        return;
      }
      // Validate email using a regular expression
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.email)) {
        this.errorMessage = 'Invalid email address. Please enter a valid email.';
        return;
      }
      // Validate phone number as numeric
      if (isNaN(row.phoneNumber)) {
        this.errorMessage = 'Phone number should be numeric.';
        return;
      }
      // Validate limits as numeric
      if (isNaN(row.dailyLimit) || isNaN(row.transactionLimit)) {
        this.errorMessage = 'Limits should be numeric.';
        return;
      }
      api.updateUserById(row.id, row)
          .then(response => {
            // Handle the response
            console.log('User updated successfully:', response.data);
            console.log(row);
          })
          .catch(error => {
            // Handle the error
            console.error('Error updating user:', error);
          });
    },
    saveAndSetAbsoluteLimit(scope, row) {
      scope.set();
      if (isNaN(row.absoluteLimit)) {
        this.errorMessage = 'Absolute limit should be numeric.';
        return;
      }
      api.updateBankAccountByIban(row.iban, row)
          .then(response => {
            console.log('Bank account updated successfully:', response.data);
          })
          .catch(error => {
            // Handle the error
            console.error('Error updating bank account:', error);
          });
    },
    goToUserDashboard(){
      this.$router.push('/userDashboard');
    }
  },

};

</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
<style>
.editable{
  font-size: 24px;
  font-weight: bold;
  color: blue;
}
#logoutBtn {
  border-radius: 20px;
  padding: 8px 16px;
  position:absolute;
  top: 1em;
  right:1em;
}
</style>