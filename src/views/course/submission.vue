<template>
  <layout :credentialCheckCallback="callbackHandler">
    <div class="container">
      <h1 class="md-title">{{ workName }}</h1>
      <md-progress-bar :md-value="80"></md-progress-bar>
      <div class="menu">
        <div class="submenu">
          <md-button class="md-raised md-primary"
            >Download all submissions</md-button
          >
          <md-button class="md-raised md-primary"
            >Download scores as CSV</md-button
          >
          <md-button class="md-raised md-accent"
            >Delete all submissions</md-button
          >
        </div>
        <div class="submenu"></div>
      </div>
      <div v-if="submissions.length !== 0">
        <md-table>
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
            <md-table-cell>{{ submission.taCliScore }}</md-table-cell>
            <md-table-cell>
              <md-icon v-if="submission.classroomScoreSubmit">done</md-icon>
              <md-icon v-else>close </md-icon>
            </md-table-cell>
            <md-table-cell>
              <router-link :to="submission.submissionDetailUrl">
                <md-button
                  class="md-raised md-primary"
                  v-if="submission.isValidUserId"
                  >View</md-button
                >
              </router-link>
            </md-table-cell>
          </md-table-row>
        </md-table>
      </div>
      <div v-else>
        <md-empty-state
          md-rounded
          md-icon="assignment"
          md-label="No one was assigned in this work"
          md-description="Check it in the Google Classroom"
        >
        </md-empty-state>
      </div>
    </div>
  </layout>
</template>

<script lang="ts">
import Vue from "vue";
import Layout from "../../layouts/Main.vue";
import firebase from "firebase";
import axios from "axios";
import { DialogBoxActionObject } from "@/components/DialogBox.vue";

export type ClassroomStudentSubmission = {
  courseId: string;
  courseWorkId: string;
  id: string;
  userId: string;
  creationTime: string;
  updateTime: string;
  state: string;
  late: boolean;
  draftGrade: number;
  assignedGrade: number;
  alternateLink: string;
  courseWorkType: string;
  associatedWithDeveloper: boolean;
  submissionHistory: Array<any>;
};

type submissionRow = {
  studentId: string;
  state: string;
  taCliScore: AnyJsonObj;
  classroomScoreSubmit: boolean;
  submissionDetailUrl: string;
  isValidUserId: boolean;
};

interface AnyJsonObj {
  [key: string]: any;
}

export default Vue.extend({
  name: "WorkSubmission",
  components: {
    Layout,
  },
  data() {
    return {
      workName: "Loading . . .",
      dialogBox: () => {},
      submissions: [],
    };
  },
  methods: {
    callbackHandler(
      firebaseUser: firebase.User,
      authCredential: any,
      dialogBox: any
    ) {
      const firestore = firebase.firestore();
      this.$set(this, "dialogBox", dialogBox);
      const courseId: string = this.$route.params.courseId;
      const workId: string = this.$route.params.workId;
      return this.getWorkDetails(courseId, workId, authCredential.credential)
        .then((res: any) => {
          // Set the work name
          this.$data.workName = res.data.title + " Submission";
          return this.getSubmissionFromClassroomApi(
            courseId,
            workId,
            authCredential.credential
          );
        })
        .then((res: any) => {
          const studentSubmissions: Array<ClassroomStudentSubmission> =
            res.data.studentSubmissions;
          return this.getStudentsFromDatabase(
            courseId,
            studentSubmissions,
            firestore
          );
        })
        .then((promisesResult: Array<any>) => {
          const studentSubmissions: Array<ClassroomStudentSubmission> =
            promisesResult.shift();
          const firestoreResult: Array<firebase.firestore.DocumentData> =
            promisesResult.shift();
          // Create the object to convert from classroomUserId to studentId
          const userIdToStudentIdJson: AnyJsonObj = {};
          firestoreResult.forEach((doc) => {
            userIdToStudentIdJson[doc.data().classroomUserId] =
              doc.data().studentId;
          });
          return this.getScoreFromDatabase(
            workId,
            studentSubmissions,
            userIdToStudentIdJson,
            firestore
          );
        })
        .then((promisesResult: Array<any>) => {
          return this.setDataToDisplay(promisesResult, courseId, workId);
        })
        .catch((e) => {
          this.promiseErrorHandler(e, courseId);
        });
    },

    getWorkDetails(courseId: string, workId: string, credential: any) {
      return axios({
        method: "GET",
        url:
          "https://classroom.googleapis.com/v1/courses/" +
          courseId +
          "/courseWork/" +
          workId,
        headers: {
          Authorization: "Bearer " + credential.oauthAccessToken,
        },
      });
    },
    getSubmissionFromClassroomApi(
      courseId: string,
      workId: string,
      credential: any
    ) {
      return axios({
        method: "GET",
        url:
          "https://classroom.googleapis.com/v1/courses/" +
          courseId +
          "/courseWork/" +
          workId +
          "/studentSubmissions",
        headers: {
          Authorization: "Bearer " + credential.oauthAccessToken,
        },
      });
    },
    getStudentsFromDatabase(
      courseId: string,
      studentSubmission: Array<any>,
      firestore: firebase.firestore.Firestore
    ) {
      const promises: Array<any> = [
        studentSubmission,
        firestore
          .collection("Classrooms")
          .doc(courseId)
          .collection("students")
          .get(),
      ];
      return Promise.all(promises);
    },
    getScoreFromDatabase(
      workId: string,
      studentSubmission: Array<ClassroomStudentSubmission>,
      userIdToStudentIdJson: any,
      firestore: firebase.firestore.Firestore
    ) {
      const promises: Array<any> = [
        studentSubmission,
        userIdToStudentIdJson,
        firestore.collection("Works").doc(workId).collection("scores").get(),
      ];
      return Promise.all(promises);
    },
    setDataToDisplay(
      promisesResult: Array<any>,
      courseId: string,
      workId: string
    ) {
      const studentSubmissions: Array<ClassroomStudentSubmission> =
        promisesResult.shift();
      const userIdToStudentIdJson: AnyJsonObj = promisesResult.shift();
      const firestoreResult: Array<firebase.firestore.DocumentData> =
        promisesResult.shift();

      const studentIdToTaCliScore: AnyJsonObj = {};
      firestoreResult.forEach((doc) => {
        studentIdToTaCliScore[doc.id] = doc.data();
      });

      const dataToDisplay: Array<submissionRow> = [];
      studentSubmissions.forEach((submission) => {
        let studentId = userIdToStudentIdJson[submission.userId];
        let isValidUserId: boolean = true;
        let taCliScore: AnyJsonObj = {};
        let classroomScoreSubmit: boolean = false;
        if (
          !Object.prototype.hasOwnProperty.call(
            userIdToStudentIdJson,
            submission.userId
          )
        ) {
          studentId = "[StudentId Not found] " + submission.userId;
          isValidUserId = false;
        }
        if (
          Object.prototype.hasOwnProperty.call(studentIdToTaCliScore, studentId)
        ) {
          taCliScore = studentIdToTaCliScore[studentId];
          classroomScoreSubmit =
            studentIdToTaCliScore[studentId].classroomScoreSubmit ?? false;
        }
        dataToDisplay.push({
          studentId: studentId,
          isValidUserId: isValidUserId,
          state: submission.state,
          taCliScore: taCliScore,
          classroomScoreSubmit: classroomScoreSubmit,
          submissionDetailUrl:
            "/course/" +
            courseId +
            "/work/" +
            workId +
            "/submission/" +
            submission.id,
        });
      });
      this.$set(this, "submissions", dataToDisplay);
      this.$data.dialogBox.dismissDialogBox();
    },
    promiseErrorHandler(e: any, courseId: string) {
      console.log(e);
      let message = "";
      let action: Array<DialogBoxActionObject> = [];
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
                path: "/course/" + courseId,
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

<style scoped>
.container {
  padding: 1rem;
}
.menu {
  padding: 1rem 0;
  justify-content: space-between;
}
.menu button {
  margin: 0;
}
.submenu {
  flex: 1;
  display: flex;
  flex-flow: row-wrap;
  justify-content: space-between;
}
</style>
