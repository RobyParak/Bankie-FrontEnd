<template>
  <div>
    <h1>LoginView</h1>
    <q-input filled v-model="ph" label="FirstName" placeholder="Enter first name" hint="name" :dense="dense" />
  </div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column" style="max-width: 300px">
        <q-input filled v-model="ph" label="FirstName" placeholder="Enter first name" hint="name" :dense="dense" />
        <q-input filled v-model="ph" label="LastName" placeholder="Enter last name" hint="surname" :dense="dense" />
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