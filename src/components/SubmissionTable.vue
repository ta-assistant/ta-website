<template>
  <div>
    <md-table v-if="submissions.length !== 0">
      <md-table-row>
        <md-table-head>Student ID</md-table-head>
        <md-table-head>State</md-table-head>
        <md-table-head>TA-CLI Score</md-table-head>
        <md-table-head>Google Classroom score submit</md-table-head>
        <md-table-head>Actions</md-table-head>
      </md-table-row>
      <md-table-row
        v-for="submission in submissions"
        :key="submission.studentId"
      >
        <md-table-cell>{{ submission.studentId }}</md-table-cell>
        <md-table-cell>{{ submission.state }}</md-table-cell>
        <md-table-cell>
          <md-icon v-if="Object.keys(submission.taScore).length === 0"
            >remove</md-icon
          >
          <md-button
            class="md-icon-button"
            @click="displayTaScore(submission.taScore)"
            v-else
          >
            <md-icon>info</md-icon>
          </md-button>
        </md-table-cell>
        <md-table-cell>
          <md-icon v-if="submission.classroomScoreSubmit">done</md-icon>
          <md-icon v-else>close </md-icon>
        </md-table-cell>
        <md-table-cell>
          <md-icon v-if="Object.keys(submission.taScore).length === 0"
            >remove</md-icon
          >
          <router-link v-else :to="submission.submissionDetailUrl">
            <md-button
              class="md-raised md-primary"
              v-if="submission.isValidUserId"
              >View</md-button
            >
          </router-link>
          <md-button
            class="md-raised md-primary"
            v-if="
              Object.keys(submission.taScore).length !== 0 &&
              !submission.classroomScoreSubmit &&
              isSupportTaFunction
            "
          >
            Submit score
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-empty-state
      md-rounded
      md-icon="assignment"
      md-label="No one was assigned in this work"
      md-description="Check it in the Google Classroom"
      v-else
    >
    </md-empty-state>

    <dialog-box-component
      :dialogBoxId="'taScoreDisplayDialog'"
      :isCustomDialogBox="true"
    >
      <md-dialog-title> TA-CLI Score Report </md-dialog-title>

      <md-table>
        <md-table-row>
          <md-table-head>Property</md-table-head>
          <md-table-head>Value</md-table-head>
        </md-table-row>
        <md-table-row
          v-for="objKey in Object.keys(taScoreDialog.data)"
          :key="objKey"
          md-dynamic-height
        >
          <md-table-cell>{{ objKey }}</md-table-cell>
          <md-table-cell>{{ taScoreDialog.data[objKey] }}</md-table-cell>
        </md-table-row>
      </md-table>
    </dialog-box-component>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { TaScoreData } from "@/types/TA/ScoreData";
import DialogBoxComponent from "@/components/DialogBox/DialogBoxComponent.vue";
import { DialogBox } from "@/components/DialogBox/DialogBox";

const taScoreDialog = new DialogBox("taScoreDisplayDialog");

export type SubmissionRow = {
  studentId: string;
  state: string;
  taScore: TaScoreData;
  classroomScoreSubmit: boolean;
  submissionDetailUrl: string;
  isValidUserId: boolean;
};

export default Vue.extend({
  name: "SubmissionTable",
  components: {
    DialogBoxComponent,
  },
  props: {
    submissions: {
      type: Array as PropType<Array<SubmissionRow>>,
      required: true,
    },
    isSupportTaFunction: {
      type: Boolean,
      required: true,
    },
  },
  data: () => {
    return {
      taScoreDialog: {
        data: {},
      },
    };
  },
  methods: {
    displayTaScore(taScore: TaScoreData): void {
      this.$set(this.taScoreDialog, "data", taScore);
      taScoreDialog.show({
        config: {
          clickOutsideToClose: true,
          closeOnEsc: true,
        },
      });
    },
  },
});
</script>
