<template>
  <div>
    <h3>Register</h3>
  </div>
  <div class="q-pa-md" style="display: flex; justify-content: center; height: 100vh;">
    <q-input v-model="firstName" label="First Name" placeholder="First Name" :dense="dense" />
    <q-input v-model="lastName" label="Last Name" placeholder="Last Name" :dense="dense"/>
    <q-input v-model="email" label="Email" placeholder="Email" :dense="dense"/>
    <q-input v-model="BSN" label="BSN" placeholder="BSN" :dense="dense"/>
    <q-input v-model="phone" label="Phone Number" placeholder="phone" :dense="dense"/>
   <q-input v-model="password" filled type="password" label="Password" :dense="dense"/>
    <q-btn  class="q-ml-auto" style="background: #f919a9; color: white" label="Register" @click="register" />
  </div>
</template>

<script>
export default {
  name: "RegisterUser.vue"
}
</script>

<style scoped>

</style>