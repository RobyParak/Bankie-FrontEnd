<template>
    <div>
      <h3>Transaction</h3>
      <q-btn-toggle
        v-model="model"
        spread
        no-caps
        toggle-color="indigo-11"
        color="white"
        text-color="black"
        :options="[
          {label: 'Normal Transaction', value: 'one'},
          {label: 'ATM Transaction', value: 'two'}
        ]"
      />
    </div>
    <div class="q-pa-md" style="display: grid; float:left; height: 600px; width: 50%;">
  <div class="q-gutter-y-md column" style="max-width: 300px;">
    <q-input filled v-model="emailInput" label="From" placeholder="" :dense="dense" />
    <q-input filled v-model="passwordInput" label="To" placeholder="" :dense="dense" />
    <div class="q-pa-md" style="max-width: 300px">
    <q-input
      v-model="text"
      filled
      autogrow
      hint="Comment"
    />
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
    <q-btn style="background: #507963; color: white; bottom: 0px;" label="Transfer"/>
  </div>
  </div>
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
        <q-btn flat color="Red" label="No" />
      </template>
    </q-banner>
</template>
<script>
import { ref } from 'vue'
export default {
  name: "TransactionView.vue",
  setup () {
    return {
      model: ref('one'),
      secondModel: ref('one')
    }
  },
}

</script>

<style scoped>


</style>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
