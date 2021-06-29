<template>
  <md-dialog :md-active.sync="dialogBox.active">
    <md-dialog-title>Create new work</md-dialog-title>

    <md-tabs md-dynamic-height>
      <md-tab md-label="Link course assignment">
        <md-table>
          <md-table-row>
            <md-table-head>Title</md-table-head>
            <md-table-head md-numeric>ID</md-table-head>
            <md-table-head>Work Type</md-table-head>
            <md-table-head>Creator UserId</md-table-head>
            <md-table-head>State</md-table-head>
            <md-table-head>Action</md-table-head>
          </md-table-row>

          <md-table-row v-for="work in unlinkedWork" :key="work.id">
            <md-table-cell
              ><md-icon v-if="work.associatedWithDeveloper"
                >check_circle
                <md-tooltip md-direction="top"
                  >This work is fully supported the TA Assistant
                  functionality</md-tooltip
                ></md-icon
              >{{ work.title }}</md-table-cell
            >
            <md-table-cell md-numeric>{{ work.id }}</md-table-cell>
            <md-table-cell>{{ work.workType }}</md-table-cell>
            <md-table-cell>{{ work.creatorUserId }}</md-table-cell>
            <md-table-cell>{{ work.state }}</md-table-cell>
            <md-table-cell><md-button>Create</md-button></md-table-cell>
          </md-table-row>
        </md-table>
      </md-tab>

      <md-tab md-label="Create new course assignment">
        <md-field>
          <label>Title</label>
          <md-input></md-input>
          <span class="md-helper-text">Helper text</span>
        </md-field>
      </md-tab>
    </md-tabs>
  </md-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CourseWork } from "@/types/ClassroomAPI/courseWork";

export default Vue.extend({
  name: "CreateNewWorkDialog",
  props: {
    unLinkedWorks: {
      type: Array as PropType<Array<CourseWork>>,
      required: true,
    },
  },
  data() {
    return {
      dialogBox: {
        active: false,
      },
    };
  },
});
</script>
