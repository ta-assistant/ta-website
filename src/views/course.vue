<template>
  <layout>
    <p class="md-title">Console Page (Course List)</p>
    <div class="menu">
      <md-button class="md-primary md-raised"><md-icon>add</md-icon>New Class</md-button>
    </div>
    <div class="md-layout">
      <div v-for="course in courses" :key="course.id" class="md-layout-item">
        <course-card  :course="course" />
      </div>
    </div>
  </layout>
</template>

<script>
import firebase from "firebase";
import Layout from "../layouts/Main.vue"
import CourseCard from '@/components/CourseCard.vue';

export default {
  components: {
    Layout,
    CourseCard
  },
  data() {
    return {
      courses: [
        {
          name: "Computer Programming X",
          teacher: "Jotaro Kujo",
          id: "23edkrsetdk"
        },
        {
          name: "Discrete Math III",
          teacher: "Steve and Alex",
          id: "23890ywkt"
        }
      ]
    }
  }
  // mounted() {
  //   firebase.auth().onauthstatechanged((user) => {
  //     if (!user) {
  //       console.log("not signed in");
  //       this.$router.push({ path: "/signin" });
  //     }
  //     console.log(user.tojson());
  //   });
  // },
};
</script>

<style lang="postcss">
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
}
.menu {
  padding: 1rem;
  text-align: left;
}
</style>