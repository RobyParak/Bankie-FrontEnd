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
import api from '../../axios';
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

      // Use the Axios service to make the login request
      api.login(loginData)
        .then(response => {
          const token = response.data.token;
          localStorage.setItem('token', token);

          const role = response.data.role;
          // this probably doesnt work
          if (role === 'user') {
            this.$router.push('/userDashboard');
          } else if (role === 'employee') {
            this.$router.push('/employeeDashboard');
          } else {
            console.error('Unknown role:', role);
          }
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
