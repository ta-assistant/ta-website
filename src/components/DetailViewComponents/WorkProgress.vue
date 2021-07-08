<template>
  <div class="work md-elevation-3 md-layout">
    <p class="md-layout-item md-large-size-30 md-small-size-100">
      <md-icon v-if="work.associatedWithDeveloper"
        >check_circle
        <md-tooltip md-direction="top"
          >This work is fully supported the TA Assistant
          functionality</md-tooltip
        ></md-icon
      >
      {{ work.title }}
    </p>
    <div class="work md-layout-item md-large-size-40 md-small-size-100">
      ID: {{ work.id }} , State: {{ work.state }}
    </div>
    <div
      class="md-layout-item md-large-size-30 md-small-size-100"
      v-if="work.state !== 'DRAFT'"
    >
      <router-link :to="`/course/${work.courseId}/work/${work.id}`">
        <md-button class="md-primary md-raised">View Work</md-button>
      </router-link>
      <md-button
        class="md-primary md-raised"
        @click="openUrl(work.alternateLink)"
        v-if="!isUndefined(work.alternateLink)"
        >View in Google Classroom</md-button
      >
    </div>
    <div class="work md-layout-item md-large-size-30 md-small-size-100" v-else>
      -- No action --
    </div>
  </div>
</template>

<script lang="ts">
import { CourseWork } from "@/types/ClassroomAPI/courseWork";
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "WorkProgress",
  props: {
    work: {
      type: Object as PropType<CourseWork>,
      required: true,
    },
  },
  methods: {
    isUndefined(data: any) {
      return typeof data === "undefined";
    },
    openUrl(url: string) {
      window.open(url, "_blank");
    },
  },
});
</script>

<style scoped>
.work {
  padding: 1rem;
  text-align: center;
}
.md-progress-bar {
  align-self: center;
}
</style>
