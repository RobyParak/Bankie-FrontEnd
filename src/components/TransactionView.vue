<template>
  <div>
    <h3>Transaction</h3>
    <q-card>
      <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
      >
        <q-tab name="normal_transaction" label="Transaction" :class="{ 'active-tab': tab === 'normal_transaction' }" />
        <q-tab name="atm_transaction" label="ATM" :class="{ 'active-tab': tab === 'atm_transaction' }"/>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="normal_transaction">
          <div class="text-h6">Transaction</div>
          <div class="q-pa-md" style="display: grid; float:left; height: 600px; width: 50%;">
            <div class="q-gutter-y-md column" style="max-width: 300px;">
              <q-select standout="indigo text-white" v-model="bankAccountFrom" :options="bankAccountFromOption" label="Select Account from" />
              <q-input v-model="bankAccountTo" :rules="ibanValidationRule" label="To" filled></q-input>
              <div class="q-pa-md" style="max-width: 300px">
                <q-input v-model="text" filled autogrow hint="Comment" />
              </div>
            </div>
          </div>
          <div class="q-pa-md" style="display: grid; float:right; height: 600px; width: 50%;">
            <div class="q-gutter-y-md column" style="max-width: 300px;">
              <q-input filled v-model="price" prefix="€" label="Amount" mask="#.##" fill-mask="0" input-class="text-right" reverse-fill-mask/>
              <q-btn style="background: #507963; color: white; bottom: 0px;" label="Transfer" />
            </div>
          </div>
        </q-tab-panel>
<!-- ATM TRANSACTIONS PAGE -->
        <q-tab-panel name="atm_transaction">
          <div class="text-h6">Withdraw/Deposit</div>
          <div class="q-pa-md" style="display: grid; float:left; height: 600px; width: 50%;"></div>
            
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <q-banner class="bg-primary text-white">
      Unfortunately, the credit card did not go through, please try again.
      <template v-slot:action>
        <q-btn flat color="white" label="Dismiss" />
        <q-btn flat color="white" label="Update Credit Card" />
      </template>
    </q-banner>

    <q-banner class="bg-primary text-white">
      Are you sure you want to make this transaction?
      <template v-slot:action>
        <q-btn flat color="#507963" label="Yes" />
        <q-btn flat color="red" label="No" />
      </template>
    </q-banner>
  </div>
</template>

<script>
import api from '../../axios.js'
import { ref, computed } from "vue";

export default {
  name: "TransactionView.vue",
  data() {
    return {
      bankAccounts: [],
      currentAccount: {},
      savingsAccount: {},
      //The bank itself iban to make transactions for ATM
      bankjeAccountIban: "NL01INHO0000000001",
      ibanValidationRule: [
        (val) => !!val || "IBAN is required",
        (val) => this.isValidIBAN(val) || "Invalid IBAN",
      ],
    };
  },
  mounted() {
    //TODO check with Mark about userId in localstorage
    api.getBankAccounts(localStorage.getItem('userId'))
        .then(response => {
          this.bankAccounts = response.data;

          // Categorize bank accounts as current or saving
          this.bankAccounts.forEach(account => {
            if (account.type === 'Current') {
              this.currentAccount.push(account);
            } else if (account.type === 'Saving') {
              this.savingsAccount.push(account);
            }
          });

          // Populate bank account options
          this.bankAccountFromOption = this.bankAccounts.map(account => ({
            label: account.iban,
            value: account.type
          }));
        })
        .catch(error => {
          console.error('Error retrieving user data:', error);
        });
  },

  setup() {
    const emailInput = ref('');
    const passwordInput = ref('');
    const text = ref('');
    const price = ref('');
    const dense = ref(false);
    const tab = ref('normal_transaction');
    const shape = ref('withdraw');
    const bankAccount = ref({});
    const bankAccountFrom = ref('');
    const bankAccountTo = ref('');
    const bankAccountFromOption = ref([]);

    // Add computed property for filtered bank account options based on the selected bankAccountFrom
    const bankAccountToOption = computed(() => {
      if (this.bankAccountFrom.value === 'Saving') {
        // Filter the bank accounts to only include 'Current' accounts
        return this.bankAccounts
            .filter(account => account.type === 'Current')
            .map(account => ({
              label: account.iban,
              value: account.type
            }));
      } else {
        // Return all bank accounts for other types
        return this.bankAccounts.map(account => ({
          label: account.iban,
          value: account.type
        }));
      }
    });


    return {
      emailInput,
      passwordInput,
      text,
      price,
      dense,
      tab,
      shape,
      bankAccount,
      bankAccountFrom,
      bankAccountTo,
      bankAccountFromOption,
      bankAccountToOption,
    };
  },
  methods: {
    createTransaction() {
      const transactionData = {
        userId: localStorage.getItem('userId'),
        from: this.bankAccount.from,
        to: this.bankAccount.to,
        amount: this.price,
        text: this.text,
      };
      api.performTransaction(transactionData)
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error('Error creating transaction:', error);
          });
    },
    isValidIBAN(iban) {
      // Regular expression pattern to validate IBAN
      const ibanPattern = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
      return ibanPattern.test(iban);
    },
  },
};
</script>


<style scoped>
/* Add your custom styles here */
</style>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
<style scoped>
/* Add the following styles */
.active-tab {
  background-color: #ccaeff; /* Replace with your desired background color */
}

.tab-content {
  background-color: #ffffff; /* Replace with your desired background color */
}
</style>