<template>
  <div class="page-container">
    <md-app class="full-height">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">TA Website</span>
      </md-app-toolbar>
      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0"
          >Navigation</md-toolbar
        >

        <md-list v-for="item in menuItems" :key="item.title">
          <router-link :to="item.routerLink">
            <md-list-item>
              <md-icon>{{ item.icon }}</md-icon>
              <span class="md-list-item-text">{{ item.title }}</span>
            </md-list-item>
          </router-link>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <slot></slot>
      </md-app-content>
    </md-app>
    <dialog-box-component
      :dialogBoxId="'loadingDialogBox'"
      :isCustomDialogBox="true"
    >
      <md-dialog-title>Connecting </md-dialog-title>
      <md-dialog-content>
        Grabing the data from Classroom API and Database
        <md-progress-spinner
          style="vertical-align: middle; margin-left: 10px"
          md-mode="indeterminate"
          :md-diameter="30"
          :md-stroke="3"
        ></md-progress-spinner>
      </md-dialog-content>
    </dialog-box-component>
    <dialog-box-component
      :dialogBoxId="'informDialogBox'"
      :isCustomDialogBox="false"
    >
    </dialog-box-component>
  </div>
</template>

<script>
import firebase from "firebase";
import DialogBoxComponent from "@/components/DialogBox/DialogBoxComponent.vue";
import { DialogBox } from "@/components/DialogBox/DialogBox";

export default {
  name: "Main",
  components: {
    DialogBoxComponent,
  },
  props: {
    callback: {
      type: Function,
    },
  },
  data() {
    return {
      menuVisible: false,
      menuItems: [
        {
          title: "Course",
          icon: "school",
          routerLink: "/course",
        },
        {
          title: "Settings",
          icon: "settings",
          routerLink: "/setting",
        },
      ],
    };
  },
  mounted() {
    const loadingDialog = new DialogBox("loadingDialogBox");
    loadingDialog.show({
      dialogBoxActions: [],
    });
    firebase.auth().onAuthStateChanged((user) => {
      try {
        if (
          !user ||
          !this.$session.exists() ||
          !this.$session.has("authCredential")
        ) {
          console.log("User not signed In");
          this.$router.push({ path: "/signin" });
          return;
        }
      } catch (e) {
        console.log(e);
        this.$router.push({ path: "/signin" });
        return;
      }
      if (typeof this.callback !== "function") {
        loadingDialog.dismiss();
        return;
      }
      console.log(user.uid);
      const credential = this.$session.get("authCredential");
      this.callback(user, credential);
    });
  },
};
</script>

<style>
.page-container {
  height: 100%;
  width: 100%;
}
.full-height {
  height: 100%;
}
</style>
