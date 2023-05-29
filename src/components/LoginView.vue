<template>
  <div>
    <h3>Welcome to Banky!</h3>
    <h5>Log in or <router-link to="/register">register</router-link></h5>
  </div>
  <div class="q-pa-md" style="display: flex; justify-content: center; align-items: center;">
    <div class="q-gutter-y-md column" style="max-width: 400px;">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          filled
          v-model="email"
          type="email"
          label="Email"
          placeholder="Email"
          lazy-rules
          :rules="[val => val && /.+@.+\..+/.test(val) || 'Please enter a valid email']"
        />

        <q-input
          filled
          type="password"
          v-model="password"
          label="Password *"
          lazy-rules
          :rules="[val => val && val.length > 0 || 'Please enter your password']"
        />

        <div>
          <q-btn class="q-ml-auto" style="background: #f919a9; color: white" label="Login" type="submit" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import { QBtn } from "quasar";
export default {
  name: 'LoginButton',
  components: {
    QBtn
  },
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
  onSubmit() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    // Send the login request to your backend API
    // and handle the response to obtain the JWT token

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
      .then(response => response.json())
      .then(data => {
        const token = data.token;

        // Store the token in local storage or another suitable storage method
        localStorage.setItem('token', token);

        this.$router.push('/UserDashboard'); // STILL NEED TO CHECK FOR ROLE AND REROUTE
      })
      .catch(error => {
        console.error('Login failed:', error);
      });
  }
}
};
</script>

<style scoped>
.q-btn {
  border-radius: 20px;
  padding: 8px 16px;
}
</style>
