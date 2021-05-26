<template>
  <div class="signIn">
    <div class="bg">
      <md-card class="signInBox">
        <md-card-header>
          <div class="md-title">TA Assistant</div>
        </md-card-header>

        <md-card-content>
          <section id="firebaseui-auth-container"></section>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import * as fbui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  test: () => {
    let auth = firebase.auth();
    console.log(auth.currentUser.toJSON());
  },
  mounted() {
    let googleSigninProvider = new firebase.auth.GoogleAuthProvider();
    googleSigninProvider.addScope(
      "https://www.googleapis.com/auth/classroom.courses.readonly"
    );

    const uiConfig = {
      signInSuccessUrl: "/loginCallback",
      signInOptions: [googleSigninProvider.providerId],
    };
    const ui = new fbui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
  },
};
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
