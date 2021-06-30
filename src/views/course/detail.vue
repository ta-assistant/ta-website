<template>
  <layout :credentialCheckCallback="callbackHandler">
    <div class="container">
      <h1 class="md-title text-left">{{ courseName }}</h1>
      <div class="menu">
        <md-button
          class="md-primary md-raised"
          @click="createNewWorkDialog.active = true"
        >
          <md-icon>add</md-icon>
          New Work
        </md-button>
        <md-button class="md-primary md-raised">
          <md-icon>campaign</md-icon>
          New Announcement
        </md-button>
      </div>
      <div class="work-list" v-if="works.length !== 0">
        <work-progress v-for="work in works" :key="work.link" :work="work" />
      </div>
      <div v-else>
        <md-empty-state
          md-rounded
          md-icon="assignment"
          md-label="Nothing in works"
          md-description="Try connecting the new one!"
        >
        </md-empty-state>
      </div>
    </div>
  </layout>
</template>

<script lang="ts">
import Vue from "vue";
import Layout from "../../layouts/Main.vue";
import WorkProgress, { Work } from "../../components/WorkProgress.vue";
import firebase from "firebase";
import axios from "axios";
import { DialogBoxAction } from "@/types/components/DialogBox";
import CreateNewWorkDialog from "@/components/CreateNewWorkDialog.vue";
export default Vue.extend({
  components: {
    Layout,
    WorkProgress,
    CreateNewWorkDialog,
  },
  data() {
    return {
      courseName: "Loading . . .",
      dialogBox: () => {},
      works: [],
      unlinkedWork: [],
      createNewWorkDialog: {
        active: false,
      },
    };
  },

  methods: {
    callbackHandler(
      firebaseUser: firebase.User,
      authCredential: any,
      dialogBox: any
    ) {
      const firestore = firebase.firestore();
      this.$set(this, "dialogBox", dialogBox);
      const courseId: string = this.$route.params.courseId;
      return this.getCourseName(courseId, authCredential.credential)
        .then((res) => {
          console.log(res);
          this.courseName = res.data.name;
          return this.getCourseWorks(courseId, authCredential.credential);
        })
        .then((res) => {
          return this.getWorksFromDatabase(res, firestore);
        })
        .then(this.setDataToDisplay)
        .catch(this.promiseErrorHandler);
    },
    getCourseName(courseId: string, credential: any) {
      return axios({
        method: "GET",
        url: "https://classroom.googleapis.com/v1/courses/" + courseId,
        headers: {
          Authorization: "Bearer " + credential.oauthAccessToken,
        },
      });
    },
    getCourseWorks(courseId: string, credential: any) {
      return axios({
        method: "GET",
        url:
          "https://classroom.googleapis.com/v1/courses/" +
          courseId +
          "/courseWork",
        headers: {
          Authorization: "Bearer " + credential.oauthAccessToken,
        },
      });
    },
    getWorksFromDatabase(res: any, firestore: firebase.firestore.Firestore) {
      console.log(res);
      const promises: Array<Promise<any>> = [];
      promises.push(res.data.courseWork);
      res.data.courseWork.forEach((courseWork: any) => {
        promises.push(firestore.collection("Works").doc(courseWork.id).get());
      });
      return Promise.all(promises);
    },
    setDataToDisplay(promisesResult: Array<any>) {
      const courseWork: Array<any> = promisesResult.shift();
      const dataToDisplay: Array<Work> = [];
      promisesResult.forEach(
        (doc: firebase.firestore.DocumentSnapshot, index: number) => {
          const work = courseWork[index];
          if (doc.exists) {
            dataToDisplay.push({
              name: work.title,
              progress: 0,
              link: "/course/" + work.courseId + "/work/" + work.id,
              classroomUrl: work.alternateLink,
              associatedWithDeveloper: work.associatedWithDeveloper,
            });
          } else {
            this.$data.unlinkedWork.push(work);
          }
        }
      );
      this.$set(this, "works", dataToDisplay);
      this.$data.dialogBox.dismiss();
    },
    promiseErrorHandler(e: any) {
      console.log(e);
      let message = "";
      let action: Array<DialogBoxAction> = [];
      if (e.message === "Request failed with status code 401") {
        // Session timeout.
        message =
          "Failed to send request to Classroom API. Please sign-in again";
        action = [
          {
            buttonContent: {
              value: "Sign-out",
              isHTML: false,
            },
            buttonClass: "md-primary",
            onClick: () => {
              this.$data.dialogBox.dismiss();
              this.$router.push({
                path: "/signIn",
              });
            },
          },
        ];
      } else {
        action = [
          {
            buttonContent: {
              value: "Back to courses",
              isHTML: false,
            },
            buttonClass: "md-primary",
            onClick: () => {
              this.$data.dialogBox.dismiss();
              this.$router.push({
                path: "/course",
              });
            },
          },
        ];
        if (e.message === "Request failed with status code 403") {
          // User isn't an teacher or have no permission;
          message =
            "You don't have permission to access current course's works on Google Classroom.";
        } else {
          message =
            "An error occurred while getting the data from ClassroomAPI and Database";
        }
      }
      this.$data.dialogBox.dismiss();
      this.$data.dialogBox.show({
        dialogBoxContent: {
          title: {
            value: "Error",
            isHTML: false,
          },
          content: {
            value: message,
            isHTML: false,
          },
        },
        dialogBoxActions: action,
      });
    },
  },
});
</script>

<style>
.text-left {
  text-align: left;
}
.menu {
  display: flex;
  padding: 0.55rem;
}
.menu > * {
  margin-right: 0.5rem;
  margin-left: 0;
}
.container {
  padding: 1rem;
}
.work-list {
  padding-top: 1rem;
}
.work-list > * {
  margin-bottom: 1rem;
}
.md-progress-bar {
  align-self: center;
}
</style>
