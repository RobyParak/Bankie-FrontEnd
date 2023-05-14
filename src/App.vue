<template>
  <img alt="Vue logo" src="./assets/logo.png" class="logo">
  <LoginView msg="Please log in"/>
</template>

<script>
import LoginView from './components/LoginView.vue'

export default {
  name: 'App',
  components: {
    LoginView
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.logo{
  position:absolute;
  top: 0;
  left:0;
  height: 80px;
  width: 100px;
}
</style>
