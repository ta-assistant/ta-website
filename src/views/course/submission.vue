<template>
  <layout :credentialCheckCallback="callbackHandler">
    <div class="container">
      <h1 class="md-title">
        {{ work.title }}
        <md-icon v-if="work.associatedWithDeveloper"
          >check_circle
          <md-tooltip md-direction="top"
            >This work is fully supported the TA Assistant
            functionality</md-tooltip
          ></md-icon
        >
      </h1>
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
            v-for="submission in submissions.displaySubmissionsList"
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
import { DialogBox, DialogBoxAction } from "@/types/components/DialogBox";
import { StudentSubmission } from "@/types/ClassroomAPI/submission";
import ClassroomApi from "@/services/ClassroomAPI/classroomApi";
import { oauthCredential } from "@/types/Google/oauthCredential";
import { TaAssistantDb } from "@/services/Database/TaAssistantDb";
import { DialogActionButtons } from "@/components/DialogBox/DialogActionButtons";
import { ClassroomApiErrorMessage } from "@/services/ClassroomAPI/errorMessages";
import { AxiosResponse } from "axios";

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
      work: {
        title: "Loading. . .",
      },
      dialogBox: () => {},
      submissions: {
        fullSubmissionsList: [],
        displaySubmissionsList: [],
      },
      students: {
        classroomUserIdToStudetnId: {},
      },
    };
  },
  methods: {
    callbackHandler(
      firebaseUser: firebase.User,
      authCredential: oauthCredential,
      dialogBox: DialogBox
    ) {
      const firestore = firebase.firestore();
      this.$set(this, "dialogBox", dialogBox);
      const classroomApi = new ClassroomApi(authCredential);
      const database = new TaAssistantDb(firestore);

      const courseId = this.$route.params.courseId;
      const workId = this.$route.params.workId;
      return classroomApi
        .course(courseId)
        .courseWork(workId)
        .get()
        .then((res: AxiosResponse) => {
          // Set the work name
          this.$data.work = res.data;
          this.$data.work.title += " Submission";
          return classroomApi
            .course(courseId)
            .courseWork(workId)
            .studentSubmission()
            .list();
        })
        .then((res: AxiosResponse) => {
          const studentSubmissions: Array<StudentSubmission> =
            res.data.studentSubmissions;
          this.$set(
            this.submissions,
            "fullSubmissionsList",
            studentSubmissions
          );
          return database.classroom(courseId).student().list();
        })
        .then((querySnap: firebase.firestore.QuerySnapshot) => {
          // Create the object to convert from classroomUserId to studentId
          const classroomUserIdToStudentId: AnyJsonObj = {};
          querySnap.forEach((doc) => {
            classroomUserIdToStudentId[doc.data().classroomUserId] =
              doc.data().studentId;
          });
          this.$set(
            this.students,
            "classroomUserIdToStudetnId",
            classroomUserIdToStudentId
          );
          return database.work(workId).score().list();
        })
        .then(this.setDataToDisplay)
        .catch((e) => {
          this.promiseErrorHandler(e, courseId);
        });
    },
    setDataToDisplay(querySnapshot: firebase.firestore.QuerySnapshot) {
      const courseId = this.$route.params.courseId;
      const workId = this.$route.params.workId;
      const studentSubmissions: Array<StudentSubmission> =
        this.$data.submissions.fullSubmissionsList;
      const userIdToStudentIdJson: AnyJsonObj =
        this.$data.students.classroomUserIdToStudetnId;

      const studentIdToTaCliScore: AnyJsonObj = {};
      querySnapshot.forEach((doc) => {
        studentIdToTaCliScore[doc.id] = doc.data();
      });

      const dataToDisplay: Array<submissionRow> = [];
      studentSubmissions.forEach((submission) => {
        let studentId = userIdToStudentIdJson[submission.userId];
        let isValidUserId: boolean = true;
        let taCliScore: AnyJsonObj = {};
        let classroomScoreSubmit: boolean = false;
        if (typeof userIdToStudentIdJson[submission.userId] === "undefined") {
          studentId = "[StudentId Not found] " + submission.userId;
          isValidUserId = false;
        }
        if (typeof studentIdToTaCliScore[studentId] !== "undefined") {
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
      this.$set(this.submissions, "displaySubmissionsList", dataToDisplay);
      this.$data.dialogBox.dismiss();
    },
    promiseErrorHandler(e: any, courseId: string) {
      console.log(e);
      let title: string = "";
      let message: string = "";
      let actions: Array<DialogBoxAction> = [];
      const dialogActionButtons = new DialogActionButtons(
        this.$router,
        this.$data.dialogBox,
        "/course"
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

      this.$data.dialogBox.dismiss();
      this.$data.dialogBox.show({
        dialogBoxContent: {
          title: {
            value: title,
            isHTML: false,
          },
          content: {
            value: message,
            isHTML: false,
          },
        },
        dialogBoxActions: actions,
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
