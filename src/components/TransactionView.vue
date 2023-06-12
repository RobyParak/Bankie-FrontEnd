<template>
  <div>
    <h3>Transaction</h3>
    <q-btn class="q-ml-auto" id="backbtn" style="background: white; color: #f919a9; border: 3px solid #f919a9;" label="Back" to="/userDashboard" />
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
                <p class="searchbyname">
                  Search IBAN by name below. The IBAN of the wanted user will appear unless they do not have an account at our bank
                </p>
                  <q-input filled v-model="searchByName" label="Search" @update:model-value="searchBankAccountByName" placeholder="Search IBAN by Name" :dense="dense" style="padding: 1em; width: 300px">
                    <template v-slot:append>
                      <q-icon v-if="searchByName !== ''" name="close" @click="searchByName = ''" class="cursor-pointer" />                      <q-icon name="search" />
                    </template>
                  </q-input>

                <q-field outlined label="IBAN" stack-label>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">
                      {{ matchedAccount ? matchedAccount.iban : ''}}
                    </div>
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
            <q-select standout="bg-indigo-11 text-white" v-model="ATMSelection" :options="ATMOptions" label="Select Account" />
            <q-input filled v-model="amountATM" prefix="€" label="Amount" mask="#.##" fill-mask="0" input-class="text-right" reverse-fill-mask/>
            <q-btn style="background: #507963; color: white;" label="Transfer" @click="atmTransaction" :disable="!isFormValidATM"/>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

  </div>
</template>

<!-- version underneath work with btn but im not sure if it makes transactions correctly -->
<script>
import api from '../../axios.js'
import { ref, } from "vue";
import jwtDecode from "jwt-decode";


export default {
  name: "TransactionView.vue",
  data() {
    return {
      searchByName:'',
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
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      api.getUserByEmail(email)
          .then(response => {
            // Update the user data with the retrieved data
            this.user = response.data[0];

            const ownerId = this.user.id; // Move the ownerId assignment inside the callback

            if (decodedToken.auth === 'Employee') {
              api.getAllBankAccounts()
                  .then(response => {
                    this.bankAccounts = response.data;
                    this.populateBankAccountOptions(); // Call the extracted method here
                  })
                  .catch(error => {
                    console.error('Error retrieving bank accounts:', error);
                  });
            } else if (decodedToken.auth === 'Customer') {
              api.getBankAccounts(ownerId)
                  .then(response => {
                    this.bankAccounts = response.data;
                    this.populateBankAccountOptions(); // Call the extracted method here
                  })
                  .catch(error => {
                    console.error('Error retrieving bank accounts:', error);
                  });
            }
          })
          .catch(error => {
            console.error('Error retrieving user data:', error);
          });
    } else {
      this.$router.push('/login');
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
    searchBankAccountByName() {
  const [firstName, lastName] = this.searchByName.split(" ");
  console.log(firstName);
  if (firstName) {
    api.getBankAccountByFirstName(firstName)
      .then(response => {
        if (response.data.length > 0) {
          this.matchedAccount = response.data[0];
          return; // Exit the method early if a match is found
        }
        // If no match is found by first name, search by last name
        api.getBankAccountByLastName(lastName)
          .then(response => {
            if (response.data.length > 0) {
              this.matchedAccount = response.data[0];
            } else {
              this.matchedAccount = null;
            }
          })
          .catch(error => {
            console.log("No account found yet", error);
            this.matchedAccount = null;
          });
      })
      .catch(error => {
        console.log("No account found yet", error);
        this.matchedAccount = null;
      });
  } else {
    this.matchedAccount = null;
  }
},

    atmTransaction() {
      const now = new Date();
      const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      const formattedDateTime = now.toLocaleString([], options);

      const transactionData = {
        userPerforming: this.user.id,
        amount: this.amountATM,
        accountTo: "",
        accountFrom: "",
        time: formattedDateTime,
        comment: "ATM Transaction",
      };

      if (this.radio === 'deposit') {
        transactionData.accountFrom = this.ATMIban;
        transactionData.accountTo = this.ATMSelection.value;
      } else if (this.radio === 'withdraw') {
        transactionData.accountFrom = this.ATMSelection.value;
        transactionData.accountTo = this.ATMIban;
      }
      console.log(transactionData);
      const isNotBelowAbsoluteLimit = (parseFloat(this.bankAccountFrom.balance) - parseFloat(this.amount)) >= this.bankAccountFrom.absoluteLimit;

      if (isNotBelowAbsoluteLimit) {
        api.performTransaction(transactionData)
            .then(response => {
              const transactionResult = response.data;
              console.log('Transaction performed successfully:', transactionResult);
              this.$router.push('/SuccessfulTransaction');
            })
            .catch(error => {
              console.error('Error performing transaction:', error);
            });
      }
    },
    populateBankAccountOptions() {
      const formatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      this.bankAccountFromOption = this.bankAccounts
          .filter(account => account.iban !== 'NL01INHO0000000001')
          .map(account => ({
            label: `${account.typeId === 1 ? 'Current' : 'Savings'} - ${account.iban} ${formatter.format(account.balance)}`,
            value: account.iban
          }));

      this.ATMOptions = this.bankAccounts
          .filter(account => account.iban !== 'NL01INHO0000000001')
          .map(account => ({
            label: `${account.typeId === 1 ? 'Current' : 'Savings'} - ${account.iban} ${formatter.format(account.balance)}`,
            value: account.iban
          }));
    },
    async performTransactionWithValidation() {
      const now = new Date();
      const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      const formattedDateTime = now.toLocaleString([], options);

      const transactionData = {
        userPerforming: this.user.id,
        accountFrom: this.bankAccountFrom.value,
        accountTo: "",
        amount: this.amount,
        time: formattedDateTime,
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
                    const isNotBelowAbsoluteLimit = (parseFloat(this.bankAccountFrom.balance) - parseFloat(this.amount)) >= this.bankAccountFrom.absoluteLimit;

                    if (
                        (isSameOwner && isAccountFromActive && isAccountToActive) ||
                        (isSameType && this.bankAccountFrom.typeId === 1 && isAccountFromActive && isAccountToActive) &&
                        (isNotBelowAbsoluteLimit)
                    ) {
                      api.performTransaction(transactionData)
                          .then(response => {
                            const transactionResult = response.data;
                            console.log('Transaction performed successfully:', transactionResult);
                            this.$router.push('/SuccessfulTransaction');
                          })
                          .catch(error => {
                            console.error('Error performing transaction:', error);
                          });
                    } else {
                      console.log('Nah, this is wrong mate, need to be two current accounts to do this transaction.');
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
#backbtn{
  border-radius: 20px;
  padding: 8px 16px;
  position:absolute;
  top: 1em;
  left:1em;
  margin-top: 5em;

}

.tab-content {
  background-color: #ffffff; /* Replace with your desired background color */
}
</style>