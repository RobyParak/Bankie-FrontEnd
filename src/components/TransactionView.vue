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
        <q-tab name="normal_transaction" label="Transaction" />
        <q-tab name="atm_transaction" label="ATM" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="normal_transaction">
          <div class="text-h6">Transaction</div>
          <div class="q-pa-md" style="display: grid; float:left; height: 600px; width: 50%;">
            <div class="q-gutter-y-md column" style="max-width: 300px;">
              <q-input
                filled
                v-model="emailInput"
                :label="transactionLabels.fromLabel"
                placeholder=""
                :dense="dense"
              />
              <q-input
                filled
                v-model="passwordInput"
                :label="transactionLabels.toLabel"
                placeholder=""
                :dense="dense"
              />
              <div class="q-pa-md" style="max-width: 300px">
                <q-input v-model="text" filled autogrow hint="Comment" />
              </div>
              <q-btn style="background: #f919a9; color: white" label="Cancel" />
            </div>
          </div>
          <div class="q-pa-md" style="display: grid; float:right; height: 600px; width: 50%;">
            <div class="q-gutter-y-md column" style="max-width: 300px;">
              <q-input
                filled
                v-model="price"
                prefix="€"
                label="Amount"
                mask="#.##"
                fill-mask="0"
                input-class="text-right"
              />
              <q-btn style="background: #507963; color: white; bottom: 0px;" label="Transfer" />
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="atm_transaction">
          <div class="text-h6">Withdraw/Deposit</div>
          <div class="q-pa-md" style="display: grid; float:left; height: 600px; width: 50%;">
            <div class="q-gutter-sm">
              <q-radio
                v-model="shape"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="withdraw"
                label="Withdraw"
              />
              <q-radio
                v-model="shape"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="deposit"
                label="Deposit"
              />
            </div>

            <div class="q-px-sm">
              Your selection is: <strong>{{ shape }}</strong>
            </div>
            <div class="q-gutter-y-md column" style="max-width: 300px;">
              <q-input
                filled
                :label="shape === 'withdraw' ? 'From (Savings)' : 'From (Current)'"
                v-model="bankAccount.from"
                placeholder=""
                :dense="dense"
              />
              <q-input
                filled
                :label="shape === 'withdraw' ? 'To (Current)' : 'To (Savings)'"
                v-model="bankAccount.to"
                placeholder=""
                :dense="dense"
              />
              <div class="q-pa-md" style="max-width: 300px">
                <q-input v-model="text" filled autogrow hint="Comment" />
              </div>
              <q-btn style="background: #f919a9; color: white" label="Cancel" />
            </div>
          </div>
          <div class="q-pa-md" style="display: grid; float:right; height: 600px; width: 50%;">
            <div class="q-gutter-y-md column" style="max-width: 300px;">
              <q-input
                filled
                v-model="price"
                prefix="€"
                label="Amount"
                mask="#.##"
                fill-mask="0"
                input-class="text-right"
              />
              <q-btn style="background: #507963; color: white; bottom: 0px;" label="Transfer" />
            </div>
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
import { ref, computed } from 'vue';

export default {
  name: "TransactionView.vue",
  setup() {
    const emailInput = ref('');
    const passwordInput = ref('');
    const text = ref('');
    const price = ref('');
    const dense = ref(false);
    const tab = ref('normal_transaction');
    const shape = ref('withdraw');
    const bankAccount = computed(() => {
      if (shape.value === "withdraw") {
        return {
          from: 'NL12345SAVINGS',
          to: 'NL12345CURRENT',
        };
      } else if (shape.value === "deposit") {
        return {
          to: 'NL12345SAVINGS',
          from: 'NL12345CURRENT',
        };
      }

      return {
        from: "",
        to: "",
      };
    });

    const transactionLabels = computed(() => {
      if (shape.value === "withdraw") {
        return {
          fromLabel: "From (Savings)",
          toLabel: "To (Current)",
        };
      } else if (shape.value === "deposit") {
        return {
          fromLabel: "From (Current)",
          toLabel: "To (Savings)",
        };
      }

      return {
        fromLabel: "",
        toLabel: "",
      };
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
      transactionLabels,
    };
  },
};
</script>

<style scoped>
</style>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
