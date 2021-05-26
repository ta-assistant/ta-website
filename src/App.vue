<template>
  <div id="app">
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
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view /> -->
  </div>
</template>

<script>
import * as firebaseui from "firebaseui";
import firebase from "firebase";
// import { googleapis } from "googleapis";
import "firebaseui/dist/firebaseui.css";

export default {
  name: "App",
  methods: {
    // eslint-disable-next-line
    test: () => {
      let auth = firebase.auth();
      console.log(auth.currentUser.toJSON());
    },
  },
  // eslint-disable-next-line
  mounted() {
    let googleSigninProvider = new firebase.auth.GoogleAuthProvider();
    googleSigninProvider.addScope(
      "https://www.googleapis.com/auth/classroom.courses.readonly"
    );

    const uiConfig = {
      signInSuccessUrl: "/",
      signInOptions: [googleSigninProvider.providerId],
    };
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
  },
};
</script>

<style>
body,
html {
  height: 100%;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-size: cover;
  height: 100%;
}

.bg {
  /* The image used */
  background-image: url("assets/map.png");

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
  border-radius: 100px;
  z-index: 3;
}
/* #nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
