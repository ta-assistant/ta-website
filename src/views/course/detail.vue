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
      <div class="work-list" v-if="works.displaWorksList.length !== 0">
        <work-progress
          v-for="work in works.displaWorksList"
          :key="work.link"
          :work="work"
        />
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
import { DialogBox, DialogBoxAction } from "@/types/components/DialogBox";
import CreateNewWorkDialog from "@/components/CreateNewWorkDialog.vue";
import ClassroomApi from "@/services/ClassroomAPI/classroomApi";
import { oauthCredential } from "@/types/Google/oauthCredential";
import { TaAssistantDb } from "@/services/Database/TaAssistantDb";
import { CourseWork } from "@/types/ClassroomAPI/courseWork";
import { ClassroomApiErrorMessage } from "@/services/ClassroomAPI/errorMessages";
import { DialogActionButtons } from "@/components/DialogBox/DialogActionButtons";

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
      works: {
        fullWorksList: [],
        displaWorksList: [],
        unlinkedWork: [],
      },

      createNewWorkDialog: {
        active: false,
      },
    };
  },

  methods: {
    callbackHandler(
      firebaseUser: firebase.User,
      authCredential: oauthCredential,
      dialogBox: DialogBox
    ) {
      const firestore = firebase.firestore();
      const classroomApi = new ClassroomApi(authCredential);
      const database = new TaAssistantDb(firestore);
      this.$set(this, "dialogBox", dialogBox);
      const courseId: string = this.$route.params.courseId;
      return classroomApi
        .course(courseId)
        .get()
        .then((res) => {
          // Set CourseName
          this.courseName = res.data.name;
          return classroomApi.course(courseId).courseWork().get();
        })
        .then((res) => {
          return this.getWorksFromDatabase(res, database);
        })
        .then(this.setDataToDisplay)
        .catch(this.promiseErrorHandler);
    },
    getWorksFromDatabase(res: any, database: TaAssistantDb) {
      const promises: Array<Promise<firebase.firestore.DocumentSnapshot>> = [];
      const courseWork: CourseWork = res.data.courseWork;
      this.$set(this.works, "fullWorksList", courseWork);
      res.data.courseWork.forEach((courseWork: CourseWork) => {
        promises.push(database.work(courseWork.id).get());
      });
      return Promise.all(promises);
    },
    setDataToDisplay(
      promisesResult: Array<firebase.firestore.DocumentSnapshot>
    ) {
      const courseWork: Array<CourseWork> = this.$data.works.fullWorksList;
      const dataToDisplay: Array<Work> = [];

      promisesResult.forEach(
        (doc: firebase.firestore.DocumentData, index: number) => {
          const work = courseWork[index];
          if (doc.exists) {
            dataToDisplay.push({
              name: work.title,
              progress: 50,
              link: "/course/" + work.courseId + "/work/" + work.id,
              classroomUrl: work.alternateLink,
              associatedWithDeveloper: work.associatedWithDeveloper,
            });
          } else {
            this.$data.works.unlinkedWork.push(work);
          }
        }
      );
      this.$set(this.works, "displaWorksList", dataToDisplay);
      this.$data.dialogBox.dismiss();
    },
    promiseErrorHandler(e: any) {
      console.log(e);
      let title: string = "";
      let message: string = "";
      let actions: Array<DialogBoxAction> = [];
      const dialogActionButtons = new DialogActionButtons(
        this.$router,
        this.$data.dialogBox,
        "/course"
      );
      if (
        typeof e.response !== "undefined" &&
        typeof e.response.status !== "undefined"
      ) {
        console.log(e.response.data);
        title = "Classroom API Error";
        switch (e.response.status) {
          case 401:
            message = ClassroomApiErrorMessage.invalidOauthAccessToken;
            actions.push(dialogActionButtons.signOutButton());
            break;
          case 404:
            message = ClassroomApiErrorMessage.contentNotFound;
            actions.push(dialogActionButtons.backButton());
            break;
          case 403:
            message = ClassroomApiErrorMessage.permissionDenined;
            actions.push(dialogActionButtons.backButton());
            break;
          default:
            message = ClassroomApiErrorMessage.unknownError;
            actions.push(dialogActionButtons.backButton());
        }
      } else {
        title = "Database Error";
        message =
          "An error occurred while getting data from the database. Please reload the page.";
        actions.push(dialogActionButtons.dismissButton());
      }

      this.$data.dialogBox.dismiss();
      this.$data.dialogBox.show({
        dialogBoxContent: {
          title: {
            value: title,
            isHTML: false,
          },
          content: {
            value: message,
            isHTML: false,
          },
        },
        dialogBoxActions: actions,
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
