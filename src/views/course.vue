<template>
  <div>
    <p>Console Page (Course List)</p>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        console.log("Not signed in");
        this.$router.push({ path: "/SignIn" });
      }
      console.log(user.toJSON());
    });
  },
};
</script>
