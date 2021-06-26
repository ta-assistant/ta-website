<template>
  <layout :credentialCheckCallback="callbackHandler">
    <p class="md-title">Console Page (Course List)</p>
    <div class="menu">
      <md-button class="ml-0 md-primary md-raised"
        ><md-icon>add</md-icon>New Class</md-button
      >
    </div>
    <div class="md-layout" v-if="courses.length !== 0">
      <div
        v-for="course in courses"
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

<script>
import firebase from "firebase";
import Layout from "../layouts/Main.vue";
import CourseCard from "@/components/CourseCard.vue";
import axios from "axios";

export default {
  components: {
    Layout,
    CourseCard,
  },
  data() {
    return {
      courses: [],
      dialogBox: {},
    };
  },
  methods: {
    callbackHandler(firebaseUser, authCredential, dialogBox) {
      const firestore = firebase.firestore();
      this.$set(this, "dialogBox", dialogBox);
      return this.getCoursesFromClassroomApi(authCredential.credential)
        .then((res) => {
          return this.generatePermissionCheckPromises(
            res,
            firestore,
            firebaseUser
          );
        })
        .then(this.setCourseData)
        .catch(this.promiseErrorHandler);
    },
    getCoursesFromClassroomApi(credential) {
      return axios({
        method: "GET",
        url: "https://classroom.googleapis.com/v1/courses",
        headers: {
          Authorization: "Bearer " + credential.oauthAccessToken,
        },
      });
    },
    generatePermissionCheckPromises(res, firestore, firebaseUser) {
      console.log(res.data);
      const responseCourses = res.data.courses;
      const courseList = [];
      console.log(res);
      for (var courseIndex in responseCourses) {
        const course = responseCourses[courseIndex];
        if (course.courseState === "ACTIVE") {
          courseList.push(course);
        }
      }

      const permissionCheckPromises = [];
      permissionCheckPromises.push(courseList);
      for (var courseIndex in courseList) {
        const course = courseList[courseIndex];
        permissionCheckPromises.push(
          firestore
            .collection("Classrooms")
            .doc(course.id.toString())
            .collection("teachers")
            .doc(firebaseUser.uid)
            .get()
        );
        permissionCheckPromises.push(
          firestore
            .collection("Classrooms")
            .doc(course.id)
            .collection("students")
            .doc(firebaseUser.uid)
            .get()
        );
      }
      return Promise.all(permissionCheckPromises);
    },
    setCourseData(promisesResult) {
      const courseList = promisesResult.shift();
      this.$set(this, "courses", []);
      var addedId = [];
      var courseIndex = 0;
      var courseCount = 0;
      promisesResult.forEach((document) => {
        if (document.exists) {
          const courseData = courseList[courseIndex];
          const dataToPush = {
            name: courseData.name,
            description: courseData.descriptionHeading,
            id: courseData.id,
          };
          if (!addedId.includes(courseData.id)) {
            this.courses.push(dataToPush);
            addedId.push(courseData.id);
          }
        }
        courseCount += 1;
        if (courseCount == 2) {
          courseIndex += 1;
          courseCount = 0;
        }
      });
      this.$data.dialogBox.dismissDialogBox();
    },
    promiseErrorHandler(e) {
      console.log(e);
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
};
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
