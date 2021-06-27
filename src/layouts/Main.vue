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

        <md-list>
          <md-list-item>
            <md-icon>school</md-icon>
            <span class="md-list-item-text">Course</span>
          </md-list-item>

          <md-list-item>
            <md-icon>account_circle</md-icon>
            <span class="md-list-item-text">Profile</span>
          </md-list-item>

          <md-list-item>
            <md-icon>settings</md-icon>
            <span class="md-list-item-text">Setting</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <slot></slot>
      </md-app-content>
    </md-app>
    <dialog-box ref="dialogBox"> </dialog-box>
  </div>
</template>

<script>
import firebase from "firebase";
import DialogBox from "@/components/DialogBox.vue";

export default {
  name: "Main",
  components: {
    DialogBox,
  },
  props: {
    credentialCheckCallback: {
      type: Function,
    },
  },
  data() {
    return {
      menuVisible: false,
    };
  },
  mounted() {
    this.$refs.dialogBox.showDialogBox({
      dialogBoxContent: {
        title: {
          value: "Loading",
          isHTML: false,
        },
        content: {
          value: "Retrieving the data from Classroom API and Database",
          isHTML: false,
        },
      },
      config: {},
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
      if (typeof this.credentialCheckCallback !== "function") {
        this.$refs.dialogBox.dismissDialogBox();
        return;
      }
      console.log(user.uid);
      const credential = this.$session.get("authCredential");
      this.credentialCheckCallback(user, credential, this.$refs.dialogBox);
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
