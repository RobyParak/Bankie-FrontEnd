<template>
  <div class="success-registration">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" width="100px" height="100px">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
    </svg>
    <h3>Registration Successful!</h3>
    <p>Thank you for registering with Banky!</p>
    <p>Your account is pending approval. Please wait for the banky! to verify and open your account.</p>
    <q-btn class="q-ml-auto" id="loginBtn" label="Login" to="/login" />

  </div>
</template>

<script>
export default {
  name: "SuccessfulRegistration",
};
</script>

<style scoped>
.success-registration {
  text-align: center;
  margin-top: 100px;
}
#loginBtn {
  background: #f919a9;
  color: white;
  margin-top: 0.5em;
  margin-left: 3em;
  position: center;
}
</style>
