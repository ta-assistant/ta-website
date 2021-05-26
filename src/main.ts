import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueMaterial from "vue-material";
import firebase from "firebase";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

// Export the firebaseConfig From Firebase Console by creating a new app
// and copy the Firebase Web app configuration and paste it into the file named
// firebaseConfig.json
import firebaseConfig from "./firebaseConfig.json";

Vue.config.productionTip = false;

Vue.use(VueMaterial);

firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
