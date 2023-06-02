<template>
  <div>
    <h3>Welcome to Banky!</h3>
    <h5>Register as a new user or <router-link to="/login">log in</router-link></h5>
  </div>
  <div class="q-pa-md" style="justify-self: center; padding-left: 20em; max-width: 80%;">
      <q-form @reset="onReset" class="q-gutter-md">
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
            :rules="[val => val && (val.length === 8 || val.length === 9) || 'Please enter a valid BSN']"
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
          <q-btn class="q-ml-auto" id="registerBtn" label="Register" @click="register" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
</template>

<script>
import { ref } from 'vue'
import api from '../../axios.js';
import bcrypt from 'bcryptjs';


export default {
  name: "RegisterUser",
  methods: {
    register() {
      const userData = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        BSN: this.BSN,
        phone: this.phone,
        password: bcrypt.hashSync(this.password, bcrypt.genSaltSync(10)) // Hash the password
      };
      api.createUser(userData)
          .then(response => {
            console.log(response.data);
            this.$router.push('/success'); // Redirect the user to the success page
          })
          .catch(error => {
            // Handle the error here
            console.error(error);
          });
    }
  },
  setup() {
    const firstName = ref(null)
    const lastName = ref(null)
    const email = ref(null)
    const BSN = ref(null)
    const phone = ref(null)
    const password = ref(null)
    const accept = ref(false)


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
      onReset,
    }
  }
}
</script>


<style scoped>
#registerBtn {
  background: #f919a9;
  color: white
}
</style>