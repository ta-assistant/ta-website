<template>
  <layout :callback="callbackHandler">
    <div class="container">
      <h1 class="md-title text-left">{{ courseName }}</h1>
      <div class="menu">
        <md-button
          class="md-primary md-raised"
          @click="showCreateNewWorkDialog"
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
    <create-work-dialog
      :unlinkedWork="works.unlinkedWork"
      :classroomCourse="getClassroomCourseInstance()"
      :refreshDataFunction="refreshPageData"
    />
  </layout>
</template>

<script lang="ts">
import Vue from "vue";
import Layout from "../../layouts/Main.vue";
import WorkProgress from "../../components/DetailViewComponents/WorkProgress.vue";
import firebase from "firebase";
import { DialogBoxAction } from "@/types/components/DialogBox";
import ClassroomApi from "@/services/ClassroomAPI/classroomApi";
import { oauthCredential } from "@/types/Google/oauthCredential";
import { TaAssistantDb } from "@/services/Database/TaAssistantDb";
import { CourseWork, CourseWorkState } from "@/types/ClassroomAPI/courseWork";
import { ClassroomApiErrorMessage } from "@/services/ClassroomAPI/errorMessages";
import { DialogActionButtons } from "@/components/DialogBox/DialogActionButtons";
import { DialogBox } from "@/components/DialogBox/DialogBox";
import CreateWorkDialog from "@/components/DetailViewComponents/CreateWorkDialog.vue";
import { AxiosError, AxiosResponse } from "axios";
import { Course } from "@/types/ClassroomAPI/courses";

const loadingDialogBox = new DialogBox("loadingDialogBox");
const informDialogBox = new DialogBox("informDialogBox");
const createWorkDialog = new DialogBox("createNewWorkDialog");

export default Vue.extend({
  components: {
    Layout,
    WorkProgress,
    CreateWorkDialog,
  },
  data() {
    return {
      courseName: "Loading . . .",
      works: {
        fullWorksList: [] as Array<CourseWork>,
        displaWorksList: [] as Array<CourseWork>,
        unlinkedWork: [] as Array<CourseWork>,
      },
      authCredential: {} as oauthCredential,
    };
  },

  methods: {
    callbackHandler(
      firebaseUser: firebase.User | null,
      authCredential: oauthCredential
    ) {
      this.$set(this, "authCredential", authCredential);
      const firestore = firebase.firestore();
      const classroomApi = new ClassroomApi(authCredential);
      const database = new TaAssistantDb(firestore);
      const courseId: string = this.$route.params.courseId;
      return classroomApi
        .course(courseId)
        .get()
        .then((res) => {
          // Set CourseName
          this.courseName = res.data.name;
          return classroomApi
            .course(courseId)
            .courseWork()
            .list([CourseWorkState.published, CourseWorkState.draft]);
        })
        .then((res) => {
          return this.getWorksFromDatabase(res, database);
        })
        .then(this.setDataToDisplay)
        .catch(this.promiseErrorHandler);
    },
    getWorksFromDatabase(res: AxiosResponse, database: TaAssistantDb) {
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
      const dataToDisplay: Array<CourseWork> = [];
      const unlinkedWork: Array<CourseWork> = [];
      promisesResult.forEach(
        (doc: firebase.firestore.DocumentData, index: number) => {
          const work = courseWork[index];
          if (doc.exists) {
            dataToDisplay.push(work);
          } else {
            unlinkedWork.push(work);
          }
        }
      );
      this.$set(this.works, "unlinkedWork", unlinkedWork);
      this.$set(this.works, "displaWorksList", dataToDisplay);
      loadingDialogBox.dismiss();
    },
    refreshPageData(): Promise<void> {
      return this.callbackHandler(
        firebase.auth().currentUser ?? null,
        this.authCredential
      );
    },
    promiseErrorHandler(e: AxiosError) {
      console.log(e);
      let title: string = "";
      let message: string = "";
      let actions: Array<DialogBoxAction> = [];
      const dialogActionButtons = new DialogActionButtons(
        this.$router,
        informDialogBox,
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
          case 403:
            message = ClassroomApiErrorMessage.permissionDenined;
            actions.push(dialogActionButtons.backButton());
            break;
          case 404:
            message = ClassroomApiErrorMessage.contentNotFound;
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

      loadingDialogBox.dismiss();
      informDialogBox.show({
        dialogBoxContent: {
          title: title,
          content: message,
        },
        dialogBoxActions: actions,
      });
    },
    getClassroomCourseInstance() {
      const courseId: string = this.$route.params.courseId;
      return new ClassroomApi(this.authCredential).course(courseId);
    },
    showCreateNewWorkDialog() {
      this.refreshPageData();
      createWorkDialog.show({
        config: {
          clickOutsideToClose: true,
        },
        dialogBoxActions: [],
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
