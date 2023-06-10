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
              <q-input filled v-model="amount" prefix="€" label="Amount" mask="#.##" fill-mask="0" input-class="text-right" reverse-fill-mask/>
              <q-btn style="background: #507963; color: white;" label="Transfer" @click="performTransactionWithValidation" :disable="!isFormValid"/>
              <div class="searchByName">
              <q-input outlined bottom-slots v-model="searchByName" label="Search IBAN by Name" counter maxlength="30" :dense="dense">
                <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-field outlined label="IBAN" stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">IBAN</div>
              </template>
            </q-field>
          </div>
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
              <q-input standout="bg-indigo-11 text-white" v-model="text" label="Custom standout" />
              <q-input standout="bg-indigo-11 text-white" v-model="text" label="Custom standout" />
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
import { ref, computed } from "vue";
import jwtDecode from "jwt-decode";

export default {
  name: "TransactionView.vue",
  data() {
    return {
      user: {},
      bankAccounts: [],
      bankAccountFrom: '',
      bankAccountTo: '',
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
                    value: account.type
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
    const price = ref('');
    const tab = ref('normal_transaction');
    const bankAccountFromOption = ref([]);
    const radio = ref('withdraw');

    // Add computed property for filtered bank account options based on the selected bankAccountFrom
    const bankAccountToOption = computed(() => {
      if (this.bankAccountFrom === 'Saving') {
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
      text,
      price,
      tab,
      bankAccountFromOption,
      bankAccountToOption,
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
          accountFrom: this.bankAccountFrom.label,
          accountTo: this.bankAccountTo,
          amount: this.price,
          time: formattedTime,
          comment: this.text,
        };
      console.log(transactionData)
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

<!-- version underneath work with btn but im not sure if it makes transactions correctly -->
<!-- <script>
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
      isFormValid: false,
      isFormValidATM: false,
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
                    value: account.type
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
    const amountATM = ref('');
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
      amountATM,
    };
  },
  
  methods: {
    atmTransaction() {
      const now = new Date();
     // const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
      //TODO change back to the top option once back end supports it
      const options = {hour: '2-digit', minute: '2-digit'};
      const formattedTime = now.toLocaleTimeString([], options);

      const transactionData = {
        userPerforming: this.user.id,
        amount: this.amountATM,
        accountTo: "",
        accountFrom: "",
        time: formattedTime,
        comment: "ATM Transaction",
      };

      if (this.radio === 'deposit') {
        transactionData.accountFrom = this.ATMIban;
        transactionData.accountTo = this.ATMSelection.value;
      } else if (this.radio === 'withdraw') {
        transactionData.accountFrom = this.ATMSelection.value;
        transactionData.accountTo = this.ATMIban;
      }

      api.performTransaction(transactionData)
          .then(response => {
            const transactionResult = response.data;
            console.log('Transaction performed successfully:', transactionResult);
            this.$router.push('/SuccessfulTransaction');
          })
          .catch(error => {
            console.error('Error performing transaction:', error);
          });
    },
    populateBankAccountOptions() {
      this.bankAccountFromOption = this.bankAccounts.map(account => ({
        label: `${account.typeId === 1 ? 'Current' : 'Savings'} - ${account.iban} ${account.balance}€`,
        value: account.iban
      }));
      this.ATMOptions = this.bankAccounts.map(account => ({
        label: `${account.typeId === 1 ? 'Current' : 'Savings'} - ${account.iban} ${account.balance}€`,
        value: account.iban
      }));
    },
    async performTransactionWithValidation() {
      const now = new Date();
      // const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
      //TODO change back to the top option once back end supports it
      const options = {hour: '2-digit', minute: '2-digit'};
      const formattedTime = now.toLocaleTimeString([], options);

      const transactionData = {
        userPerforming: this.user.id,
        accountFrom: this.bankAccountFrom.value,
        accountTo: "",
        amount: this.amount,
        time: formattedTime,
        comment: this.text,
      };
      transactionData.accountTo = this.bankAccountTo;

      try {
        // Get accountFrom details by iban
        api.getBankAccountByIban(transactionData.accountFrom)
            .then(response => {
              // Update the user data with the retrieved data
              this.bankAccountFrom = response.data[0];
              // Get accountTo details by iban
              api.getBankAccountByIban(this.bankAccountTo)
                  .then(response => {
                    // Update the user data with the retrieved data
                    this.bankAccountTo = response.data[0];

                    // Perform the validation checks
                    const isSameOwner = this.bankAccountFrom.ownerId === this.bankAccountTo.ownerId;
                    const isAccountFromActive = this.bankAccountFrom.statusId !== 1;
                    const isAccountToActive = this.bankAccountTo.statusId !== 1;
                    const isSameType = this.bankAccountFrom.typeId === this.bankAccountTo.typeId;

                    // If accounts have the same owner and both are active, or if they have the same type regardless of the owner, proceed with the transaction
                    if ((isSameOwner && isAccountFromActive && isAccountToActive) || (isSameType && this.bankAccountFrom.typeId === 1 && isAccountFromActive && isAccountToActive)) {
                      api.performTransaction(transactionData)
                          .then(response => {
                            const transactionResult = response.data;
                            console.log('Transaction performed successfully:', transactionResult);
                          })
                          .catch(error => {
                            console.error('Error performing transaction:', error);
                          });
                    } else {
                      console.log('Account validation failed. Transaction cannot be performed.');
                    }
                  })
                  .catch(error => {
                    console.error('Error retrieving accountTo data:', error);
                  });
            })
            .catch(error => {
              console.error('Error retrieving accountFrom data:', error);
            });
      } catch (error) {
        console.error('Error performing transaction:', error);
      }
      this.$router.push('/SuccessfulTransaction');
    },
    isValidIBAN(iban) {
      // Regular expression pattern to validate IBAN
      const ibanPattern = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
      return ibanPattern.test(iban);
    },
    validateForm() {
      // Validate the form fields and set isFormValid accordingly
      this.isFormValid =
          !!this.bankAccountFrom &&
          !!this.bankAccountTo &&
          !!this.amount;
    },
    validateFormATM(){
      this.isFormValidATM =
          !!this.ATMSelection &&
          !!this.ATMIban &&
          !!this.amountATM;
    },
  },
  watch: {
    bankAccountFrom() {
      this.validateForm();
    },
    bankAccountTo() {
      this.validateForm();
    },
    amount() {
      this.validateForm();
    },
    amountATM() {
      this.validateFormATM();
    },
  },
};
</script> -->

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