<template>
  <layout>
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
    };
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (
        !user ||
        !this.$session.exists() ||
        !this.$session.has("authCredential")
      ) {
        console.log("User not signed In");
        this.$router.push({ path: "/signin" });
      }
      console.log(user.uid);
      this.getCourses(user);
    });
    return true;
  },
  methods: {
    getCourses(firebaseUser) {
      const firestore = firebase.firestore();
      const authCredential = this.$session.get("authCredential");
      const courseList = [];
      return axios({
        method: "GET",
        url: "https://classroom.googleapis.com/v1/courses",
        headers: {
          Authorization: "Bearer " + authCredential.credential.oauthAccessToken,
        },
      })
        .then((res) => {
          const responseCourses = res.data.courses;
          console.log(res);
          for (var courseIndex in responseCourses) {
            const course = responseCourses[courseIndex];
            if (course.courseState === "ACTIVE") {
              courseList.push(course);
            }
          }

          const permissionCheckPromises = [];
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
        })
        .then((firebaseResponse) => {
          this.$set(this, "courses", []);
          var addedId = [];
          var courseIndex = 0;
          var courseCount = 0;
          firebaseResponse.forEach((document) => {
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
        })
        .catch((e) => {
          console.log("Error");
          console.log(e);
          return false;
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
