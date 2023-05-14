<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" class="logo">
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'App'
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
