<template>
  <layout :credentialCheckCallback="callbackHandler">
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
import axios from "axios";
import { DialogBoxAction } from "@/types/components/DialogBox";

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
      dialogBox: () => {},
    };
  },
  methods: {
    callbackHandler(
      firebaseUser: firebase.User,
      authCredential: any,
      dialogBox: any
    ) {
      this.$set(this, "dialogBox", dialogBox);
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
          this.$data.dialogBox.dismissDialogBox();
        })
        .catch((e) => {
          return this.promiseErrorHandler(e, courseId, workId);
        });
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

    promiseErrorHandler(e: any, courseId: string, workId: string) {
      console.log(e);
      let message = "";
      let action: Array<DialogBoxAction> = [];
      if (e.message === "Request failed with status code 401") {
        // Session timeout.
        message =
          "Failed to send request to Classroom API. Please sign-in again";
        action = [
          {
            buttonContent: {
              value: "Sign-out",
              isHTML: false,
            },
            buttonClass: "md-primary",
            onClick: () => {
              this.$data.dialogBox.dismissDialogBox();
              this.$router.push({
                path: "/signIn",
              });
            },
          },
        ];
      } else {
        action = [
          {
            buttonContent: {
              value: "Back to works",
              isHTML: false,
            },
            buttonClass: "md-primary",
            onClick: () => {
              this.$data.dialogBox.dismissDialogBox();
              this.$router.push({
                path: "/course/" + courseId + "/work/" + workId,
              });
            },
          },
        ];
        if (e.message === "Request failed with status code 403") {
          // User isn't an teacher or have no permission;
          message =
            "You don't have permission to access current course's works on Google Classroom.";
        } else {
          message =
            "An error occurred while getting the data from ClassroomAPI and Database";
        }
      }
      this.$data.dialogBox.dismissDialogBox();
      this.$data.dialogBox.showDialogBox({
        dialogBoxContent: {
          title: {
            value: "Error",
            isHTML: false,
          },
          content: {
            value: message,
            isHTML: false,
          },
        },
        dialogBoxActions: action,
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
