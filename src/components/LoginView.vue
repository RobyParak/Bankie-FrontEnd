<template>
  <div>
    <h3>Login</h3>
  </div>
  <div class="q-pa-md" style="display: flex; justify-content: center; height: 100vh;">
  <div class="q-gutter-y-md column" style="max-width: 300px;">
    <q-input filled v-model="emailInput" label="Username/Email" placeholder="Username/Email" :dense="dense" />
    <q-input v-model="password" filled type="password" label="Password" :dense="dense"/>
    <q-btn  class="q-ml-auto" style="background: #f919a9; color: white" label="Login" @click="login" />
  </div>
</div>

  </template>

<script>
import {QBtn} from "quasar";
export default {
name: 'LogoutButton',
    components: {
  QBtn
},
methods: {
  login() {
    // perform logout action here
  }
}
}
</script>

<style scoped>
.q-btn {
  border-radius: 20px;
  padding: 8px 16px;
}
</style>