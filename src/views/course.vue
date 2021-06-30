<template>
  <layout :credentialCheckCallback="callbackHandler">
    <p class="md-title">Console Page (Course List)</p>
    <div class="menu">
      <md-button class="ml-0 md-primary md-raised"
        ><md-icon>add</md-icon>New Class</md-button
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
  </layout>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase";
import Layout from "../layouts/Main.vue";
import CourseCard from "@/components/CourseCard.vue";
import ClassroomAPI from "@/services/ClassroomAPI/classroomApi";
import { ClassroomApiErrorMessage } from "@/services/ClassroomAPI/errorMessages";
import { oauthCredential } from "@/types/Google/oauthCredential";
import { Course, CourseState } from "@/types/ClassroomAPI/courses";
import { DialogBox, DialogBoxAction } from "@/types/components/DialogBox";
import { TaAssistantDb } from "@/services/Database/TaAssistantDb";
import { DialogActionButtons } from "@/components/DialogBox/DialogActionButtons";

export default Vue.extend({
  components: {
    Layout,
    CourseCard,
  },
  data() {
    return {
      courses: {
        displayCoursesList: [],
        fullCoursesList: [],
      },
      dialogBox: () => {},
    };
  },
  methods: {
    callbackHandler(
      firebaseUser: firebase.User,
      oauthCredential: oauthCredential,
      dialogBox: DialogBox
    ) {
      const firestore = firebase.firestore();
      const classroomApi = new ClassroomAPI(oauthCredential);
      const database = new TaAssistantDb(firestore);
      this.$set(this, "dialogBox", dialogBox);
      return classroomApi
        .course()
        .list()
        .then((res) => {
          console.log(res);
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
          course.courseState === CourseState.ACTIVE;
      });

      const promisesArray: Array<Promise<firebase.firestore.DocumentSnapshot>> =
        [];
      activeCourseList.forEach((course) => {
        promisesArray.push(
          database.classroom(course.id.toString()).teacher().get({
            userId: firebaseUser.uid,
          })
        );
      });
      return Promise.all(promisesArray);
    },
    setCoursesDisplayData(promisesResult: any) {
      this.$set(this.courses, "displayCourses", []);
      promisesResult.forEach(
        (document: firebase.firestore.DocumentData, index: number) => {
          if (document.exists) {
            const course = this.$data.courses.fullCoursesList[index];
            this.$data.courses.displayCoursesList.push(course);
          }
        }
      );
      this.$data.dialogBox.dismiss();
    },
    promiseErrorHandler(e: any) {
      console.log(e);
      let title: string = "";
      let message: string = "";
      let actions: Array<DialogBoxAction> = [];
      const dialogActionButtons = new DialogActionButtons(
        this.$router,
        this.$data.dialogBox
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
