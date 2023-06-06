<template>
  <q-btn class="q-ml-auto" id="logoutBtn" style="background: #f919a9; color: white" label="Logout" @click="logout" />
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
          <q-input outlined bottom-slots v-model="userSearchText" label="Search Users" counter maxlength="30" :dense="dense">
            <template v-slot:append>
              <q-icon v-if="userSearchText !== ''" name="close" @click="userSearchText = ''" class="cursor-pointer" />
              <q-icon name="search" />
            </template>
          </q-input>
          <!-- User table -->
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
                  <q-popup-edit v-model="props.row.firstName" buttons @save="saveUser(props.row)" v-slot="scope">
                    <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set(); saveUser(props.row)"/>
                  </q-popup-edit>
                </q-td>
                    <q-td key="lastName" :props="props" class="editable">
                        {{ props.row.lastName }}
                        <q-popup-edit v-model="props.row.lastName" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set(); saveUser(props.row)"/>
                        </q-popup-edit>
                    </q-td>
                    <q-td key="phoneNumber" :props="props" class="editable">
                        {{ props.row.phoneNumber }}
                        <q-popup-edit v-model="props.row.phoneNumber" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set(); saveUser(props.row)"/>
                        </q-popup-edit>
                    </q-td>
                    <q-td key="Email" :props="props" class="editable">
                        {{ props.row.email }}
                        <q-popup-edit v-model="props.row.email" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set(); saveUser(props.row)"/>
                        </q-popup-edit>
                    </q-td>
                    <q-td key="dailyLimit" :props="props" class="editable">
                        €{{ props.row.dailyLimit }}
                        <q-popup-edit v-model="props.row.dailyLimit" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set(); saveUser(props.row)"/>
                        </q-popup-edit>
                    </q-td>
                    <q-td key="transactionLimit" :props="props" class="editable">
                        €{{ props.row.transactionLimit }}
                        <q-popup-edit v-model="props.row.transactionLimit" buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set(); saveUser(props.row)"/>
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
                <q-td key="amount" :props="props">
                  {{ props.row.amount }}
                </q-td>
                <q-td key="absoluteLimit" :props="props" class="editable">
                  €{{ props.row.absoluteLimit }}
                  <q-popup-edit v-model="props.row.absoluteLimit" buttons v-slot="scope">
                    <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                  </q-popup-edit>
                </q-td>
                <q-td key="typeId" :props="props">
                  {{ props.row.typeId === 0 ? 'Savings' : 'Current' }}
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
      row-key="id"
      selection="single"
      v-model:selected="selectedUser"
    />
    <div class="q-mt-md">
      Selected: {{ JSON.stringify(selectedUser) }}
    </div>
    <q-btn  class="q-ml-auto" style="background: #800000; color: white" label="Delete User" type="submit" @click="deleteUser" />
          <q-btn class="q-ml-auto" style="background: #547863; color: white" label="Create Bank Account" type="submit" @click="createAccount" />

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
    
    const bankAccountColumns = [
      { name: 'iban', align: 'left', label: 'IBAN', field: 'iban' },
      { name: 'ownerId', label: 'Owner ID', field: 'ownerId' },
      { name: 'statusId', label: 'status', field: 'statusId' },
      { name: 'amount', label: 'Balance', field: 'amount' },
      { name: 'absoluteLimit', label: 'Absolute Limit (editable)', field: 'absoluteLimit'},
      { name: 'typeId', label: 'Type ID', field: 'typeId' },
    ];

    const bankAccountRows = ref([]);

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


    onMounted(() => {
      getAllUsers();
      getAllBankAccounts();
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
    };
  },
  methods: {
    createAccount() {
      const accountData = {
      ownerId : this.selectedUser[0].id,
        statusId: 0,
        balance: 0,
        absoluteLimit: 0,
        //type id 1 is current and 0 is savings
        typeId: 1,
      };
      api.createAccount(accountData)
          .then(response => {
            console.log('Bank Account created successfully:', response.data);
          })
          .catch(error => {
            // Handle the error
            console.error('Error creating bank account:', error);
          });
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
          .then(response => {
            console.log('User deleted successfully:', response.data);
          })
          .catch(error => {
            // Handle the error
            console.error('Error deleting user:', error);
          });
    },
    disableBankie()
    {
      //TODO encrypt IBAN once Catalin has added encryption to backend
      // 0 = active, 1 = disabled
     this.selectedBankAccount[0].statusId = 1;
     console.log(this.selectedBankAccount[0])
      api.disableBankAccount(this.selectedBankAccount[0].iban, this.selectedBankAccount[0])
      .then(response => {
        console.log('Bank account disabled successfully:', response.data);
      })
      .catch(error => {
        // Handle the error
        console.error('Error disabling bank account:', error);
      });
    },

    saveUser(updatedUser) {
    api.updateUserById(updatedUser.id, updatedUser)
    .then(response => {
      // Handle the response
      console.log('User updated successfully:', response.data);
      console.log(updatedUser);
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
<style>
.editable{
  font-size: 24px;
  font-weight: bold;
  color: blue;
}
</style>