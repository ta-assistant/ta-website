<template>
  <layout :callback="callbackHandler">
    <p class="md-title">Console Page (Course List)</p>
    <div class="menu">
      <md-button class="ml-0 md-primary md-raised" @click="showLinkCourseDialog"
        ><md-icon>link</md-icon> Link course</md-button
      >
    </div>
    <div class="md-layout" v-if="courses.displayCoursesList.length !== 0">
      <div
        v-for="course in courses.displayCoursesList"
        :key="course.id"
        class="md-layout-item md-medium-size-100 md-large-size-50 mb-4"
      >
        <course-card :course="course" />
      </div>
    </div>
    <div v-else>
      <md-empty-state
        md-rounded
        md-icon="dashboard"
        md-label="Nothing in courses"
        md-description="Try connecting the new one!"
      >
      </md-empty-state>
    </div>
    <link-course-dialog
      :unLinkedCoursesList="courses.unLinkedCoursesList"
      :database="getDatabaseInstance()"
      :firebaseUser="firebaseUser"
      :refreshData="refreshData"
    />
  </layout>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import firebase from "firebase";
import Layout from "../layouts/Main.vue";
import CourseCard from "@/components/CourseViewComponents/CourseCard.vue";
import ClassroomAPI from "@/services/ClassroomAPI/classroomApi";
import { ClassroomApiErrorMessage } from "@/services/ClassroomAPI/errorMessages";
import { oauthCredential } from "@/types/Google/oauthCredential";
import { Course, CourseState } from "@/types/ClassroomAPI/courses";
import { DialogBoxAction } from "@/types/components/DialogBox";
import { TaAssistantDb } from "@/services/Database/TaAssistantDb";
import { DialogActionButtons } from "@/components/DialogBox/DialogActionButtons";
import { DialogBox } from "@/components/DialogBox/DialogBox";
import LinkCourseDialog from "@/components/CourseViewComponents/LinkCourseDialog.vue";

const loadingDialogBox = new DialogBox("loadingDialogBox");
const informDialogBox = new DialogBox("informDialogBox");
const linkCourseDialog = new DialogBox("linkCourseDialogbox");

export default Vue.extend({
  components: {
    Layout,
    CourseCard,
    LinkCourseDialog,
  },
  data() {
    return {
      courses: {
        displayCoursesList: [] as Array<Course>,
        unLinkedCoursesList: [] as Array<Course>,
        fullCoursesList: [] as Array<Course>,
      },
      oauthCredential: {} as oauthCredential,
      firebaseUser: {} as firebase.User,
    };
  },
  methods: {
    callbackHandler(
      firebaseUser: firebase.User,
      oauthCredential: oauthCredential
    ) {
      this.$set(this, "oauthCredential", oauthCredential);
      this.$set(this, "firebaseUser", firebaseUser);
      const firestore = firebase.firestore();
      const classroomApi = new ClassroomAPI(oauthCredential);
      const database = new TaAssistantDb(firestore);
      return classroomApi
        .course()
        .list("me")
        .then((res) => {
          return this.checkClassExistsInDatabase(
            res.data.courses,
            database,
            firebaseUser
          );
        })
        .then(this.setCoursesDisplayData)
        .catch(this.promiseErrorHandler);
    },
    checkClassExistsInDatabase(
      courses: Array<Course>,
      database: TaAssistantDb,
      firebaseUser: firebase.User
    ) {
      this.$set(this.courses, "fullCoursesList", courses);
      const activeCourseList: Array<Course> = [];
      courses.forEach((course) => {
        activeCourseList.push(course) &&
          course.courseState === CourseState.active;
      });

      const promisesArray: Array<Promise<firebase.firestore.DocumentSnapshot>> =
        [];
      activeCourseList.forEach((course) => {
        promisesArray.push(
          database
            .classroom(course.id as string)
            .teacher()
            .get({
              userId: firebaseUser.uid,
            })
        );
      });
      return Promise.all(promisesArray);
    },
    setCoursesDisplayData(promisesResult: any) {
      this.$set(this.courses, "displayCoursesList", []);
      const displayCoursesList: Array<Course> = [];
      const unLinkedCoursesList: Array<Course> = [];
      promisesResult.forEach(
        (document: firebase.firestore.DocumentData, index: number) => {
          const course = this.$data.courses.fullCoursesList[index] as Course;
          if (document.exists) {
            displayCoursesList.push(course);
          } else {
            if (course.courseState === CourseState.active) {
              unLinkedCoursesList.push(course);
            }
          }
        }
      );
      this.$set(this.courses, "displayCoursesList", displayCoursesList);
      this.$set(this.courses, "unLinkedCoursesList", unLinkedCoursesList);
      loadingDialogBox.dismiss();
    },
    promiseErrorHandler(e: any) {
      console.log(e);
      let title: string = "";
      let message: string = "";
      let actions: Array<DialogBoxAction> = [];
      const dialogActionButtons = new DialogActionButtons(
        this.$router,
        informDialogBox
      );

      if (axios.isAxiosError(e)) {
        console.log(e.response?.data);
        title = "Classroom API Error";
        switch (e.response?.status) {
          case 401:
            message = ClassroomApiErrorMessage.invalidOauthAccessToken;
            break;
          case 403:
            message = ClassroomApiErrorMessage.permissionDenined;
            break;
          default:
            message = ClassroomApiErrorMessage.unknownError;
        }
        actions.push(dialogActionButtons.signOutButton());
      } else {
        title = "Database Error";
        message =
          "An error occurred while getting data from the database. Please reload the page.";
        actions.push(dialogActionButtons.dismissButton());
      }

      loadingDialogBox.dismiss({
        dialogBoxId: "loadingDialogBox",
      });
      informDialogBox.show({
        dialogBoxId: "informDialogBox",
        dialogBoxContent: {
          title: title,
          content: message,
        },
        dialogBoxActions: actions,
      });
    },
    getDatabaseInstance() {
      return new TaAssistantDb(firebase.firestore());
    },
    refreshData() {
      return this.callbackHandler(this.firebaseUser, this.oauthCredential);
    },
    showLinkCourseDialog() {
      this.refreshData();
      linkCourseDialog.show({
        config: {
          closeOnEsc: true,
          clickOutsideToClose: true,
        },
        dialogBoxActions: [],
      });
    },
  },
});
</script>

<style lang="postcss">
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
}
.menu {
  text-align: left;
  padding: 0.55rem;
}
.ml-0 {
  margin-left: 0;
}
.mb-4 {
  margin-bottom: 2rem;
}
</style>
