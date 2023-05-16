<template>
  <div>
    <h3>Welcome to Banky!</h3>
    <h5>Register as a new user or <router-link to="/login">log in</router-link></h5>
  </div>
  <div class="q-pa-md" style="justify-content: center; padding-left: 3em; max-width: 80%;">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input
            filled
            v-model="firstName"
            label="First Name"
            placeholder="First Name"
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Please enter your first name']"
        />
        <q-input
            filled
            v-model="lastName"
            label="Last Name"
            placeholder="Last Name"
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Please enter your last name']"
        />
        <q-input
            filled
            v-model="email"
            label="Email"
            placeholder="Email"
            lazy-rules
            :rules="[val => val && /.+@.+\..+/.test(val) || 'Please enter a valid email']"
        />
        <q-input
            filled
            v-model="BSN"
            label="BSN"
            placeholder="BSN"
            lazy-rules
            :rules="[val => val && val.length === 9 || 'Please enter a valid BSN']"
        />
        <q-input
            filled
            v-model="phone"
            label="Phone Number"
            placeholder="Phone"
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Please enter your phone number']"
        />
        <q-input
            filled
            v-model="password"
            type="password"
            label="Password"
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Please enter your password', val => /[A-Z]/.test(val) || 'Password must contain at least one capital letter', val => /[^A-Za-z0-9]/.test(val) || 'Password must contain at least one special character']"
        />


        <div>
          <q-btn  class="q-ml-auto" style="background: #f919a9; color: white" label="Register" type="submit" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

export default {
  name: "RegisterUser",
  methods: {
    register() {
      // Perform user registration here
      // this method is already called when the user clicks the register button so only the logic is needed here
    }
  },
  setup() {
    const $q = useQuasar()

    const firstName = ref(null)
    const lastName = ref(null)
    const email = ref(null)
    const BSN = ref(null)
    const phone = ref(null)
    const password = ref(null)
    const accept = ref(false)

    const onSubmit = () => {
      if (accept.value !== true) {
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'You need to accept the license and terms first'
        })
      } else {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
        this.register() // Call the register method
      }
    }

    const onReset = () => {
      firstName.value = null
      lastName.value = null
      email.value = null
      BSN.value = null
      phone.value = null
      password.value = null
      accept.value = false
    }

    return {
      firstName,
      lastName,
      email,
      BSN,
      phone,
      password,
      accept,
      onSubmit,
      onReset
    }
  }
}
</script>


<style scoped>

</style>