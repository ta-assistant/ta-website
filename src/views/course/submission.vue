<template>
  <layout :callback="callbackHandler">
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
      <submission-table
        :submissions="submissions.displaySubmissionsList"
        :isSupportTaFunction="work.associatedWithDeveloper"
      />
    </div>
  </layout>
</template>

<script lang="ts">
import Vue from "vue";
import Layout from "../../layouts/Main.vue";
import firebase from "firebase";
import axios, { AxiosError, AxiosResponse } from "axios";
import ClassroomApi from "@/services/ClassroomAPI/classroomApi";
import { TaAssistantDb } from "@/services/Database/TaAssistantDb";
import { ClassroomApiErrorMessage } from "@/services/ClassroomAPI/errorMessages";
import { DialogActionButtons } from "@/components/DialogBox/DialogActionButtons";
import { DialogBox } from "@/components/DialogBox/DialogBox";
import SubmissionTable, {
  SubmissionRow,
} from "@/components/SubmissionTable.vue";
import { DialogBoxAction } from "@/types/components/DialogBox";
import { StudentSubmission } from "@/types/ClassroomAPI/submission";
import { oauthCredential } from "@/types/Google/oauthCredential";
import { TaScoreData } from "@/types/TA/ScoreData";

const loadingDialogBox = new DialogBox("loadingDialogBox");
const informDialogBox = new DialogBox("informDialogBox");

type AnyJsonObj = {
  [key: string]: any;
};

export default Vue.extend({
  name: "WorkSubmission",
  components: {
    Layout,
    SubmissionTable,
  },
  data() {
    return {
      work: {
        title: "Loading. . .",
        associatedWithDeveloper: false,
      },
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
      authCredential: oauthCredential
    ) {
      const firestore = firebase.firestore();
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
          this.$set(this, "work", res.data);
          this.$data.work.title += " Submission";
          this.$set(
            this.work,
            "associatedWithDeveloper",
            this.$data.work.associatedWithDeveloper ?? false
          );
          return classroomApi
            .course(courseId)
            .courseWork(workId)
            .studentSubmission()
            .list();
        })
        .then((res: AxiosResponse) => {
          const studentSubmissions: Array<StudentSubmission> =
            res.data.studentSubmissions ?? [];
          this.$set(
            this.submissions,
            "fullSubmissionsList",
            studentSubmissions
          );
          const promisesArray: Array<
            Promise<firebase.firestore.QuerySnapshot>
          > = [];
          studentSubmissions.forEach((submission: StudentSubmission) => {
            promisesArray.push(
              database.users().search({
                classroomUserId: submission.userId,
              })
            );
          });
          return Promise.all(promisesArray);
        })
        .then((querySnapArray: Array<firebase.firestore.QuerySnapshot>) => {
          // Create the object to convert from classroomUserId to studentId
          const classroomUserIdToStudentId: AnyJsonObj = {};
          querySnapArray.forEach((querySnap) => {
            if (querySnap.size === 1) {
              const doc = querySnap.docs[0];
              classroomUserIdToStudentId[doc.data().classroomUserId] =
                doc.data().studentId;
            }
          });
          this.$set(
            this.students,
            "classroomUserIdToStudetnId",
            classroomUserIdToStudentId
          );
          return database.work(workId).score().list();
        })
        .then(this.setDataToDisplay)
        .catch(this.promiseErrorHandler);
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

      const dataToDisplay: Array<SubmissionRow> = [];
      studentSubmissions.forEach((submission) => {
        let studentId = userIdToStudentIdJson[submission.userId];
        let isValidUserId: boolean = true;
        let classroomScoreSubmit: boolean = false;
        let taScore: TaScoreData = {};
        if (typeof userIdToStudentIdJson[submission.userId] === "undefined") {
          studentId = "[StudentId Not found] " + submission.userId;
          isValidUserId = false;
        }
        if (typeof studentIdToTaCliScore[studentId] !== "undefined") {
          taScore = studentIdToTaCliScore[studentId] as TaScoreData;
          classroomScoreSubmit =
            studentIdToTaCliScore[studentId].classroomScoreSubmit ?? false;
        }
        dataToDisplay.push({
          studentId: studentId,
          isValidUserId: isValidUserId,
          state: submission.state,
          taScore: taScore,
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
      loadingDialogBox.dismiss();
    },
    promiseErrorHandler(e: AxiosError | firebase.firestore.FirestoreError) {
      console.log(e);
      const courseId = this.$route.params.courseId;

      let title: string = "";
      let message: string = "";
      let actions: Array<DialogBoxAction> = [];
      const dialogActionButtons = new DialogActionButtons(
        this.$router,
        informDialogBox,
        "/course/" + courseId
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
