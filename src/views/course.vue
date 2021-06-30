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
import { oauthCredential } from "@/types/Google/oauthCredential";
import { Course, CourseState } from "@/types/ClassroomAPI/courses";

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
      dialogBox: any
    ) {
      const firestore = firebase.firestore();
      const classroomApi = new ClassroomAPI(oauthCredential);
      this.$set(this, "dialogBox", dialogBox);
      return classroomApi.courses
        .get()
        .then((res) => {
          console.log(res);
          return this.checkClassExistsInDatabase(
            res.data.courses,
            firestore,
            firebaseUser
          );
        })
        .then(this.setCoursesDisplayData)
        .catch(this.promiseErrorHandler);
    },
    checkClassExistsInDatabase(
      courses: Array<Course>,
      firestore: firebase.firestore.Firestore,
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
          firestore
            .collection("Classrooms")
            .doc(course.id.toString())
            .collection("teachers")
            .doc(firebaseUser.uid)
            .get()
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
      this.$data.dialogBox.dismissDialogBox();
    },
    promiseErrorHandler(e: any) {
      console.log(JSON.stringify(e));
      console.log(e.data);
      let message = "";
      if (e.message === "Request failed with status code 401") {
        // Session timeout.
        message =
          "Failed to send request to Classroom API. Please sign-in again";
      } else {
        message =
          "An error occurred while getting the data from ClassroomAPI and Database";
      }
      this.$data.dialogBox.dismissDialogBox();
      this.$data.dialogBox.showDialogBox({
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
        dialogBoxActions: [
          {
            buttonContent: {
              value: "Sign-out",
              isHTML: false,
            },
            buttonClass: "md-primary",
            onClick: () => {
              this.$data.dialogBox.dismissDialogBox();
              this.$router.push({
                path: "/signIn",
              });
            },
          },
        ],
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
