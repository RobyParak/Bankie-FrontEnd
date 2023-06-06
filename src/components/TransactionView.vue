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
              <q-select standout="bg-indigo-11 text-white" v-model="bankAccountFrom" :options="bankAccountFromOption" label="Select Account from" />
              <q-input v-model="bankAccountTo" :rules="ibanValidationRule" label="To" filled></q-input>
              <div class="q-pa-md" style="max-width: 300px">
                <q-input v-model="text" filled autogrow hint="Comment" />
              </div>
            </div>
          </div>
          <div class="q-pa-md" style="display: grid; float:right; height: 600px; width: 50%;">
            <div class="q-gutter-y-md column" style="max-width: 300px;">
              <q-input filled v-model="amount" prefix="€" label="Amount" mask="#.##" fill-mask="0" input-class="text-right" reverse-fill-mask/>
              <q-btn style="background: #507963; color: white; bottom: 0px;" label="Transfer" @click="createTransaction" />
            </div>
          </div>
        </q-tab-panel>
<!-- ATM TRANSACTIONS PAGE -->
        <q-tab-panel name="atm_transaction">
          <div class="text-h6">Withdraw/Deposit</div>
          <div class="q-gutter-sm">
              <q-radio
                  v-model="radio"
                  val="withdraw"
                  label="Withdraw"
              />
              <q-radio
                  v-model="radio"
                  val="deposit"
                  label="Deposit"
              />
              <div class="q-px-sm">
              Your selection is: <strong>{{ radio }}</strong>
            </div>
            <q-select standout="bg-indigo-11 text-white" v-model="ATMSelection" :options="ATMOptions" label="Select Account" />
            <q-input filled v-model="amount" prefix="€" label="Amount" mask="#.##" fill-mask="0" input-class="text-right" reverse-fill-mask/>

            <q-btn style="background: #507963; color: white; bottom: 0px;" label="Transfer" @click="createTransaction" />
            </div>
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
import { ref, } from "vue";
import jwtDecode from "jwt-decode";

export default {
  name: "TransactionView.vue",
  data() {
    return {
      user: {},
      bankAccounts: [],
      bankAccountFrom: '',
      ATMSelection: '',
      bankAccountTo: '',
      ATMIban: "NL01INHO0000000001",
      ibanValidationRule: [
        (val) => !!val || "IBAN is required",
        (val) => this.isValidIBAN(val) || "Invalid IBAN",
      ],
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

            const ownerId = this.user.id; // Move the ownerId assignment inside the callback

            api.getBankAccounts(ownerId)
                .then(response => {
                  this.bankAccounts = response.data;

                  // Populate bank account options
                  this.bankAccountFromOption = this.bankAccounts.map(account => ({
                    label: account.iban,
                    value: account.iban
                  }));
                  this.ATMOptions = this.bankAccounts.map(account => ({
                    label: account.iban,
                    value: account.iban
                  }));
                })
                .catch(error => {
                  console.error('Error retrieving bank accounts:', error);
                });
          })
          .catch(error => {
            console.error('Error retrieving user data:', error);
          });
    }
  },
  setup() {
    const text = ref('');
    const amount = ref('');
    const tab = ref('normal_transaction');
    const bankAccountFromOption = ref([]);
    const radio = ref('withdraw');
    const ATMOptions = ref([]);

    return {
      text,
      amount,
      tab,
      bankAccountFromOption,
      ATMOptions,
      radio,
    };
  },
  methods: {
    createTransaction() {
      const now = new Date();
      const options = { hour: '2-digit', minute: '2-digit' };
      const formattedTime = now.toLocaleTimeString([], options);

      const transactionData = {
        userPerforming: this.user.id,
        accountFrom: '',
        accountTo: '',
        amount: this.amount,
        time: formattedTime,
        comment: this.text,
      };

    console.log(this.ATMSelection);

      if (this.radio === 'deposit') {
        transactionData.accountFrom = this.ATMIban;
        transactionData.accountTo = this.ATMSelection.value;
      } else if (this.radio === 'withdraw') {
        transactionData.accountFrom = this.ATMSelection.value;
        transactionData.accountTo = this.ATMIban;
      }

      api.performTransaction(transactionData)
          .then(response => {
            console.log(response.data);
            console.log('Transaction created successfully');
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
  background-color: hsl(246, 36%, 57%); /* Replace with your desired background color */
}

.tab-content {
  background-color: #ffffff; /* Replace with your desired background color */
}
</style>