<template>
  <div class="signIn">
    <div class="bg">
      <md-card class="signInBox">
        <md-card-header>
          <div class="md-title">TA Assistant</div>
        </md-card-header>

        <md-card-content>
          <section id="firebaseui-auth-container"></section>
          <md-button class="md-raised md-primary" v-on:click="forwardToCourses">
            Click to SignIn</md-button
          >
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import firebase from "firebase";
import * as firebaseUi from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default Vue.extend({
  methods: {
    // TODO: Remove these code after the export from template is completed
    forwardToCourses() {
      this.$router.push({ path: "/course" });
    },
  },
  mounted() {
    const firebaseAuth = firebase.auth();
    const uiConfig = {
      signInSuccessUrl: "/course",
      signInOptions: [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          scopes: [
            "https://www.googleapis.com/auth/classroom.courses.readonly",
            "https://www.googleapis.com/auth/classroom.coursework.students",
          ],
          customParameters: {
            prompt: "select_account",
          },
        },
      ],
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          this.$session.start();
          this.$session.set("authCredential", authResult);
          console.log(authResult);
          return true;
        },
      },
    };
    const ui = new firebaseUi.auth.AuthUI(firebaseAuth);
    ui.start("#firebaseui-auth-container", uiConfig);
  },
});
</script>

<style scoped>
.signIn {
  height: 100%;
}

.bg {
  /* The image used */
  background-image: url("../assets/map.png");

  /* Full height */
  height: 100%;

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 60%;
}

.signInBox {
  margin: 20%;
  display: inline-block;
  vertical-align: top;
  width: 500px;
  border-radius: 10px;
  z-index: 3;
}
</style>
