<template>
  <layout :callback="callbackHandler">
    <div class="container">
      <h1 class="md-title">Student Submission</h1>
      <div class="md-layout w-half">
        <div class="md-layout-item md-size-30">Student ID</div>
        <div class="md-layout-item md-size-70">
          {{ studentInfo.studentId }}
        </div>
        <div class="md-layout-item md-size-30">State</div>
        <div class="md-layout-item md-size-70">
          {{ submission.fullSubmissionData.state }}
        </div>
        <div class="md-layout-item md-size-30">TA-CLI Score</div>
        <div class="md-layout-item md-size-70">
          {{ taCliScore }}
        </div>
        <div class="md-layout-item md-size-30">
          Google Classroom Score submission
        </div>
        <div class="md-layout-item md-size-70">
          <md-icon v-if="classroomScoreSubmit && classroomScoreSubmit !== '-'"
            >done</md-icon
          >
          <md-icon v-else>close </md-icon>
        </div>
      </div>
      <div>
        <md-button
          class="p-0 md-primary md-raised"
          @click="submitScoreToClassroom()"
          >Submit Score to Google Classroom</md-button
        >
      </div>
      <h1 class="md-title">Scoring</h1>
      <form>
        <md-field>
          <label for="score">Score</label>
          <md-input
            name="score"
            type="number"
            id="score"
            placeholder="Score: Out of 8000"
          ></md-input>
        </md-field>
        <md-button class="md-primary md-raised">Submit Score</md-button>
      </form>
      <h1 class="md-title">Comments</h1>
      <div class="comments">
        <comment-editor v-model="currentComment" />
        <comment />
      </div>
    </div>
  </layout>
</template>

<script lang="ts">
import axios, { AxiosError, AxiosResponse } from "axios";
import { DialogBoxAction } from "@/types/components/DialogBox";
import { DialogBox } from "@/components/DialogBox/DialogBox";
import { DialogActionButtons } from "@/components/DialogBox/DialogActionButtons";
import { ClassroomApiErrorMessage } from "@/services/ClassroomAPI/errorMessages";
import { oauthCredential } from "@/types/Google/oauthCredential";
import { TaAssistantDb } from "@/services/Database/TaAssistantDb";
import { StudentSubmission } from "@/types/ClassroomAPI/submission";
import Vue from "vue";
import Layout from "../../layouts/Main.vue";
import Comment from "../../components/Comment.vue";
import CommentEditor from "../../components/CommentEditor.vue";
import firebase from "firebase";
import ClassroomApi from "@/services/ClassroomAPI/classroomApi";

const loadingDialogBox = new DialogBox("loadingDialogBox");
const informDialogBox = new DialogBox("informDialogBox");

export default Vue.extend({
  name: "WorkDetail",
  components: {
    Layout,
    Comment,
    CommentEditor,
  },
  data: () => {
    return {
      taCliScore: {},
      classroomScoreSubmit: false,
      currentComment: "",
      submission: {
        fullSubmissionData: {} as StudentSubmission,
        scoreFromDatabase: {},
      },
      studentInfo: {},
    };
  },
  methods: {
    callbackHandler(
      firebaseUser: firebase.User,
      oauthCredential: oauthCredential
    ) {
      const courseId = this.$route.params.courseId;
      const workId = this.$route.params.workId;
      const submissionId = this.$route.params.submissionId;
      const firestore = firebase.firestore();

      const classroomApi = new ClassroomApi(oauthCredential);
      const database = new TaAssistantDb(firestore);

      return classroomApi
        .course(courseId)
        .courseWork(workId)
        .studentSubmission(submissionId)
        .get()
        .then((res: AxiosResponse) => {
          this.$set(this.submission, "fullSubmissionData", res.data);
          return database
            .classroom(this.submission.fullSubmissionData.courseId)
            .student()
            .search({
              classroomUserId: this.submission.fullSubmissionData.userId,
            });
        })
        .then((queryResult) => {
          if (queryResult.size !== 1) {
            console.log(queryResult);
            throw Error(
              `classroomUserId not found or found more than 1 (Found ${queryResult.size})`
            );
          }

          this.$set(this, "studentInfo", queryResult.docs[0].data());
          this.$set(this.studentInfo, "userId", queryResult.docs[0].id);
          return database
            .work(workId)
            .score(this.$data.studentInfo.studentId)
            .get();
        })
        .then((docSnap) => {
          if (!docSnap.exists) {
            throw Error("No score data found in Database");
          }
          this.$data.taCliScore = docSnap.data();
          this.$data.classroomScoreSubmit =
            docSnap.data()?.classroomScoreSubmit ?? false;
          loadingDialogBox.dismiss();
        })
        .catch(this.promiseErrorHandler);
    },

    promiseErrorHandler(
      e: AxiosError | firebase.firestore.FirestoreError
    ): void {
      console.log(e);
      const courseId = this.$route.params.courseId;
      const workId = this.$route.params.workId;

      let title: string = "";
      let message: string = "";
      let actions: Array<DialogBoxAction> = [];
      const dialogActionButtons = new DialogActionButtons(
        this.$router,
        informDialogBox,
        "/course/" + courseId + "/work/" + workId
      );
      if (axios.isAxiosError(e)) {
        console.log(e.response?.data);
        title = "Classroom API Error";
        switch (e.response?.status) {
          case 401:
            message = ClassroomApiErrorMessage.invalidOauthAccessToken;
            actions.push(dialogActionButtons.signOutButton());
            break;
          case 403:
            message = ClassroomApiErrorMessage.permissionDenined;
            actions.push(dialogActionButtons.backButton());
            break;
          case 404:
            message = ClassroomApiErrorMessage.contentNotFound;
            actions.push(dialogActionButtons.backButton());
            break;
          default:
            message = ClassroomApiErrorMessage.unknownError;
            actions.push(dialogActionButtons.backButton());
        }
      } else {
        title = "Database Error";
        if (e.message === "No score data found in Database") {
          message = "The score data was not found in database.";
          actions.push(dialogActionButtons.backButton());
        } else {
          message =
            "An error occurred while getting data from the database. Please reload the page.";
          actions.push(dialogActionButtons.dismissButton());
        }
      }

      loadingDialogBox.dismiss();
      informDialogBox.show({
        dialogBoxContent: {
          title: title,
          content: message,
        },
        dialogBoxActions: actions,
      });
    },
  },
});
</script>

<style>
.container {
  padding: 1rem;
}
.w-half {
  width: 50%;
}
.p-0 {
  margin: 0;
}
</style>
