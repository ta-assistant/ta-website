import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueMaterial from "vue-material";
// TODO: Uncomment these code after the export from template is completed
// import firebase from "firebase";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

// Export the firebaseConfig From Firebase Console by creating a new app
// and copy the Firebase Web app configuration and paste it into the file named
// firebaseConfig.json
// TODO: Uncomment these code after the export from template is completed
// import firebaseConfig from "./firebaseConfig.json";

Vue.config.productionTip = false;

Vue.use(VueMaterial);

// TODO: Uncomment these code after the export from template is completed
// firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
