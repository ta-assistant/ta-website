<template>
  <div>
    <md-progress-bar :md-value="0"></md-progress-bar>
    <div class="menu">
      <div class="submenu">
        <md-button class="md-raised md-primary"
          >Download all submissions</md-button
        >
        <md-button
          class="md-raised md-primary"
          v-if="isSupportTaFunction"
          @click="bulkActionConfirmDialog"
          >Submit all available score to classroom</md-button
        >
      </div>
      <div class="submenu"></div>
    </div>
    <md-table v-model="searched" md-sort="StudentId" md-sort-order="asc">
      <md-table-toolbar>
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input
            placeholder="Search by studentId..."
            v-model="searchBox"
            @input="searchOnTable"
          />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state md-label="No submission data found">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="StudentId" md-sort-by="StudentId">{{
          item.studentId
        }}</md-table-cell>
        <md-table-cell md-label="State" md-sort-by="State">{{
          item.state
        }}</md-table-cell>
        <md-table-cell md-label="TA-CLI Score" md-sort-by="taScore"
          ><md-icon v-if="Object.keys(item.taScore).length === 0"
            >remove</md-icon
          >
          <md-button
            class="md-icon-button"
            @click="displayTaScore(item.taScore)"
            v-else
          >
            <md-icon>info</md-icon>
          </md-button></md-table-cell
        >
        <md-table-cell
          md-label="Google Classroom score submit"
          md-sort-by="ClassroomScoreSubmit"
        >
          <md-icon v-if="item.classroomScoreSubmit">done</md-icon>
          <md-icon v-else>close</md-icon>
        </md-table-cell>
        <md-table-cell md-label="Actions"
          ><md-icon v-if="Object.keys(item.taScore).length === 0"
            >remove</md-icon
          >
          <router-link v-else :to="item.submissionDetailUrl">
            <md-button class="md-raised md-primary" v-if="item.isValidUserId"
              >View</md-button
            >
          </router-link>
          <md-button
            class="md-raised md-primary"
            v-if="
              Object.keys(item.taScore).length !== 0 &&
              !item.classroomScoreSubmit &&
              isSupportTaFunction &&
              item.taScore.scoredBy === firebaseUser.uid
            "
            @click="submitBulkScoreToClassroom([item])"
          >
            Submit score
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
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
import firebase from "firebase";
import { DialogBox } from "@/components/DialogBox/DialogBox";
import { oauthCredential } from "@/types/Google/oauthCredential";
import ClassroomApi from "@/services/ClassroomAPI/classroomApi";
import { TaAssistantDb } from "@/services/Database/TaAssistantDb";

const taScoreDialog = new DialogBox("taScoreDisplayDialog");
const informDialogBox = new DialogBox("informDialogBox");

const searchByStudentId = (
  items: Array<SubmissionRow>,
  term: string | null
) => {
  if (term) {
    return items.filter((item: SubmissionRow) => item.studentId.includes(term));
  }
  return items;
};

export type SubmissionRow = {
  studentId: string;
  submissionId: string;
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
    firebaseUser: {
      type: Object as PropType<firebase.User>,
      required: true,
    },
    authCredential: {
      type: Object as PropType<oauthCredential>,
      required: true,
    },
    refreshData: {
      type: Function,
      required: true,
    },
  },
  data: () => {
    return {
      searchBox: null,
      searched: [],
      taScoreDialog: {
        data: {},
      },
    };
  },
  watch: {
    submissions: function (newValue, oldValue) {
      this.$data.searched = newValue;
      this.searchOnTable();
    },
  },
  created() {
    this.$data.searched = this.submissions;
    this.searchOnTable();
  },
  methods: {
    searchOnTable() {
      this.$data.searched = searchByStudentId(this.submissions, this.searchBox);
    },
    displayTaScore(taScore: TaScoreData): void {
      this.$set(this.taScoreDialog, "data", taScore);
      taScoreDialog.show({
        config: {
          clickOutsideToClose: true,
          closeOnEsc: true,
        },
      });
    },
    async sendScoreToClassroom(
      studentId: string,
      submissionId: string,
      taScore: TaScoreData
    ) {
      const courseId = this.$route.params.courseId;
      const workId = this.$route.params.workId;

      const firestore = firebase.firestore();
      const classroom = new ClassroomApi(this.authCredential);
      const database = new TaAssistantDb(firestore);

      if (!taScore.scoredBy) {
        throw Error("The TaScore Data is broken." + JSON.stringify(taScore));
      }
      return database
        .work(workId)
        .score(studentId)
        .markAsSubmittedToClassroom(taScore.scoredBy)
        .then(() => {
          return classroom
            .course(courseId)
            .courseWork(workId)
            .studentSubmission(submissionId)
            .patch({
              draftGrade: taScore.score,
            });
        })
        .then(async () => {
          return;
        })
        .catch((e) => {
          throw e;
        });
    },
    bulkActionConfirmDialog() {
      informDialogBox.show({
        dialogBoxContent: {
          title: "Are you sure?",
          content:
            "You are about to submitting the bulk score data to classroom. Are you sure?",
        },
        dialogBoxActions: [
          {
            buttonClass: "md-primary",
            buttonContent: "Yes",
            onClick: () => {
              informDialogBox.dismiss();
              this.submitBulkScoreToClassroom(this.submissions);
            },
          },
          {
            buttonClass: "md-primary",
            buttonContent: "No",
            onClick: () => {
              informDialogBox.dismiss();
            },
          },
        ],
      });
    },
    submitBulkScoreToClassroom(submissions: Array<SubmissionRow>) {
      informDialogBox.show({
        dialogBoxContent: {
          title: "Submitting",
          content: "Submitting the score data to Classroom API",
        },
        dialogBoxActions: [],
      });
      let promisesArray: Array<Promise<void>> = [];
      submissions.forEach((element: SubmissionRow) => {
        if (
          Object.keys(element.taScore).length !== 0 &&
          !element.classroomScoreSubmit &&
          element.taScore.scoredBy === this.firebaseUser.uid
        ) {
          promisesArray.push(
            this.sendScoreToClassroom(
              element.studentId,
              element.submissionId,
              element.taScore
            )
          );
        }
      });
      if (promisesArray.length === 0) {
        informDialogBox.dismiss();
        informDialogBox.show({
          dialogBoxContent: {
            title: "No available score to submit",
            content: "There is no score data available to submit to classroom.",
          },
        });
        return;
      }
      return Promise.all(promisesArray)
        .then(async (result) => {
          await this.refreshData();
          informDialogBox.dismiss();
          informDialogBox.show({
            dialogBoxContent: {
              title: "Success",
              content: `Submitted ${result.length} score(s) data to Classroom API`,
            },
          });
        })
        .catch((e) => {
          informDialogBox.dismiss();
          informDialogBox.show({
            dialogBoxContent: {
              title: "Error",
              content:
                "There are 1 or more error occurred while sending the score data to classroom api",
            },
          });
        });
    },
  },
});
</script>

<style scoped>
.md-table + .md-table {
  margin-top: 16px;
}
</style>
