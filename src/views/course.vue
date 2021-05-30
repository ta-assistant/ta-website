<template>
  <layout>
    <p>Console Page (Course List)</p>
  </layout>
</template>

<script>
import firebase from "firebase";
import Layout from "../layouts/Main.vue"

export default {
  components: {
    Layout
  }
  // mounted() {
  //   firebase.auth().onauthstatechanged((user) => {
  //     if (!user) {
  //       console.log("not signed in");
  //       this.$router.push({ path: "/signin" });
  //     }
  //     console.log(user.tojson());
  //   });
  // },
};
</script>
