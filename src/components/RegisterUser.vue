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
            v-model="bsn"
            label="bsn"
            placeholder="bsn"
            lazy-rules
            :rules="[val => val && (val.length === 8 || val.length === 9) || 'Please enter a valid BSN']"
        />

        <q-input
            filled
            v-model="phoneNumber"
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
          <!-- Display error message -->
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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
        bsn: this.bsn,
        phoneNumber: this.phoneNumber,
        password: bcrypt.hashSync(this.password, bcrypt.genSaltSync(10)), // Hash the password
        role : 'User',
        transactionLimit: 800,
        dailyLimit: 1000,
      };
      api.createUser(userData)
          .then(response => {
            console.log(response.data);
            this.$router.push('/success'); // Redirect the user to the success page
          })
          .catch(error => {
            // Check if the error is due to duplicate email address
            if (error.response && error.response.status === 400 && error.response.data.message === "Email address already exists") {
              // Handle the duplicate email error
              this.errorMessage = "Email address already exists. Please choose a different email.";
            } else {
              // Handle other errors
              console.error(error);
              this.errorMessage = "An error occurred. Please try again.";
            }
          });
    }
  },
  setup() {
    const firstName = ref(null)
    const lastName = ref(null)
    const email = ref(null)
    const bsn = ref(null)
    const phoneNumber = ref(null)
    const password = ref(null)
    const accept = ref(false)
    const errorMessage = ref(null)

    const onReset = () => {
      firstName.value = null
      lastName.value = null
      email.value = null
      bsn.value = null
      phoneNumber.value = null
      password.value = null
      accept.value = false
    }

    return {
      firstName,
      lastName,
      email,
      bsn,
      phoneNumber,
      password,
      accept,
      onReset,
      errorMessage,
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