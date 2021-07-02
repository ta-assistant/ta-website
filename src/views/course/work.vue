<template>
  <layout :callback="callbackHandler">
    <div class="container">
      <h1 class="md-title">Student Submission</h1>
      <div class="md-layout w-half">
        <div class="md-layout-item md-size-30">Student ID</div>
        <div class="md-layout-item md-size-70">
          {{ studentId }}
        </div>
        <div class="md-layout-item md-size-30">State</div>
        <div class="md-layout-item md-size-70">
          {{ state }}
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
import Vue from "vue";
import Layout from "../../layouts/Main.vue";
import Comment from "../../components/Comment.vue";
import CommentEditor from "../../components/CommentEditor.vue";
import firebase from "firebase";
import axios, { AxiosError } from "axios";
import { DialogBoxAction } from "@/types/components/DialogBox";
import { DialogBox } from "@/components/DialogBox/DialogBox";
import { DialogActionButtons } from "@/components/DialogBox/DialogActionButtons";
import { ClassroomApiErrorMessage } from "@/services/ClassroomAPI/errorMessages";

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
      studentId: "",
      state: "",
      taCliScore: {},
      classroomScoreSubmit: false,
      currentComment: "",
      authCredential: {},
    };
  },
  methods: {
    callbackHandler(firebaseUser: firebase.User, authCredential: any) {
      const courseId = this.$route.params.courseId;
      const workId = this.$route.params.workId;
      const submissionId = this.$route.params.submissionId;
      let classroomUserId = "";
      let studentId = "";
      this.$set(this, "authCredential", authCredential);
      const firestore = firebase.firestore();
      return this.getSubmissionStateFromClassroomApi(
        courseId,
        workId,
        submissionId,
        authCredential.credential
      )
        .then((res) => {
          classroomUserId = res.data.userId;
          this.$data.state = res.data.state;
          return this.getUserFromDatabase(courseId, classroomUserId, firestore);
        })
        .then((queryResult) => {
          console.log(queryResult.docs[0].data());
          studentId = queryResult.docs[0].data().studentId;
          this.$data.studentId = studentId;
          return this.getScoreFromDatabase(workId, studentId, firestore);
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
    getSubmissionStateFromClassroomApi(
      courseId: string,
      workId: string,
      submissionId: string,
      credential: any
    ) {
      return axios({
        method: "GET",
        url: `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${workId}/studentSubmissions/${submissionId}`,
        headers: {
          Authorization: "Bearer " + credential.oauthAccessToken,
        },
      });
    },
    getUserFromDatabase(
      courseId: string,
      classroomUserId: string,
      firestore: firebase.firestore.Firestore
    ) {
      return firestore
        .collection("Classrooms")
        .doc(courseId)
        .collection("students")
        .where("classroomUserId", "==", classroomUserId)
        .get();
    },
    getScoreFromDatabase(
      workId: string,
      studentId: string,
      firestore: firebase.firestore.Firestore
    ) {
      return firestore
        .collection("Works")
        .doc(workId)
        .collection("scores")
        .doc(studentId)
        .get();
    },

    submitScoreToClassroom() {
      const courseId = this.$route.params.courseId;
      const workId = this.$route.params.workId;
      const submissionId = this.$route.params.submissionId;
      console.log(this.$data.authCredential.credential.oauthAccessToken);
      return axios({
        method: "PATCH",
        url: `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${workId}/studentSubmissions/${submissionId}`,
        headers: {
          Authorization:
            "Bearer " + this.$data.authCredential.credential.oauthAccessToken,
        },
        params: {
          updateMask: "assignedGrade:100",
        },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log("Error");
          console.log(e);
        });
    },

    promiseErrorHandler(e: AxiosError): void {
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
      if (
        typeof e.response !== "undefined" &&
        typeof e.response.status !== "undefined"
      ) {
        console.log(e.response.data);
        title = "Classroom API Error";
        switch (e.response.status) {
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
        message =
          "An error occurred while getting data from the database. Please reload the page.";
        actions.push(dialogActionButtons.dismissButton());
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
