<template>
  <md-card>
    <md-card-header>
      <div class="md-title">{{ course.name }}</div>
      <div class="md-subhead">{{ course.description }}</div>
    </md-card-header>
    <md-card-media>
      <img src="assets/map.png" alt="demo here" />
    </md-card-media>
    <md-card-actions>
      <md-button :to="`/course/${course.id}`" class="md-primary md-raised"
        >View work</md-button
      >
    </md-card-actions>
  </md-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Course } from "@/types/ClassroomAPI/courses";

export default Vue.extend({
  props: {
    course: {
      type: Object as PropType<Course>,
      required: true,
    },
  },
});
</script>

<style scoped>
.underline {
  text-decoration: underline;
}
.md-card {
  text-align: center;
}
</style>
