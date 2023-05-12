<template>
  <div>
    <h3>Login</h3>
  </div>
  <div class="q-pa-md" style="display: flex; justify-content: center; height: 100vh;">
  <div class="q-gutter-y-md column" style="max-width: 300px;">
    <q-input filled v-model="emailInput" label="Username/Email" placeholder="Username/Email" :dense="dense" />
    <q-input filled v-model="passwordInput" label="Password" placeholder="Password" :dense="dense" />
    <q-btn style="background: #f919a9; color: white" label="Login" />
  </div>
</div>

  </template>

<script>
export default {
  name: "LoginView.vue"
}
</script>

<style scoped>

</style>