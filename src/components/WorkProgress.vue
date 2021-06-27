<template>
  <div class="work md-elevation-3 md-layout">
    <p class="md-layout-item md-large-size-30 md-small-size-100">
      {{ work.name }}
    </p>
    <md-progress-bar
      class="md-layout-item md-large-size-40 md-small-size-100"
      :md-value="work.progress"
    ></md-progress-bar>
    <div class="md-layout-item md-large-size-30 md-small-size-100">
      <router-link :to="work.link">
        <md-button class="md-primary md-raised">View Work</md-button>
      </router-link>
      <md-button
        class="md-primary md-raised"
        @click="openUrl(work.classroomUrl)"
        >View in Google Classroom</md-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
export type Work = {
  name: string;
  progress: number;
  link: string;
  classroomUrl: string;
};
export default Vue.extend({
  name: "WorkProgress",
  props: {
    work: {
      type: Object as PropType<Work>,
      required: true,
    },
  },
  methods: {
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
