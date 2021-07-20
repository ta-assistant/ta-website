<template>
  <dialog-box-component
    :dialogBoxId="'createNewWorkDialog'"
    :isCustomDialogBox="true"
  >
    <md-dialog-title> Create the new work </md-dialog-title>
    <md-tabs md-dynamic-height>
      <md-tab md-label="Create new work">
        <md-dialog-content>
          <form class="md-layout">
            <md-field :class="workTitleFieldClass">
              <label>Work Title</label>
              <md-input v-model="createWorkInfo.title"></md-input>
              <span class="md-error">This field can't be empty</span>
            </md-field>
            <md-field>
              <label for="movie">Course work type</label>
              <md-select v-model="createWorkInfo.workType">
                <md-option value="ASSIGNMENT">Assignment</md-option>
                <md-option value="SHORT_ANSWER_QUESTION"
                  >Short answer question</md-option
                >
                <md-option value="MULTIPLE_CHOICE_QUESTION"
                  >Multiple chouse question</md-option
                >
              </md-select>
            </md-field>
          </form>
          <md-switch
            class="md-primary"
            v-model="createWorkInfo.acknowledgeAssociatedWithDeveloper"
          >
            You acknowledge that creating the work from TA Assistant console
            will <b>enable the `associatedWithDeveloper` config</b> for this
            work which will
            <b
              >allow it to be modified (including the scoring data) via the
              Classroom API</b
            >.
          </md-switch>
          <div
            style="padding-top: 10px"
            v-if="!createWorkInfo.acknowledgeAssociatedWithDeveloper"
          >
            <md-icon style="color: #ffb30f">info</md-icon>
            If you don't want to turn this config on, Please go to Google
            Classroom and create the new work there, Then come back here again
            to link the created work.
          </div>
          <div style="padding-top: 10px">
            <md-icon>info</md-icon>
            After you create the work, It will be assigned as
            <b>DRAFT state</b> and you can still edit this work's details on
            Google Classroom.
          </div>
          <md-button
            class="md-raised md-primary"
            :disabled="!createWorkInfo.acknowledgeAssociatedWithDeveloper"
            @click="createWork"
          >
            Create
          </md-button>
        </md-dialog-content>
      </md-tab>
      <md-tab md-label="Link the work">
        <md-table
          md-sort="title"
          md-sort-order="asc"
          v-model="unlinkedWork"
          md-fixed-header
        >
          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="ID" md-sort-by="id">{{
              item.id
            }}</md-table-cell>
            <md-table-cell md-label="Title" md-sort-by="title">
              {{ item.title }}
            </md-table-cell>
            <md-table-cell md-label="State" md-sort-by="state">
              {{ item.state }}
            </md-table-cell>
            <md-table-cell md-label="Associated with Developer">
              <p class="md-layout-item md-large-size-30 md-small-size-100">
                <md-icon v-if="item.associatedWithDeveloper"
                  >check_circle
                  <md-tooltip md-direction="top"
                    >This work is fully supported the TA Assistant
                    functionality</md-tooltip
                  ></md-icon
                >
                <md-icon v-else>not_interested</md-icon>
              </p>
            </md-table-cell>
            <md-table-cell md-label="Actions">
              <md-button class="md-raised md-primary" @click="linkWork(item)"
                >Link the assignment</md-button
              >
              <md-button
                class="md-raised md-primary"
                @click="openUrl(item.alternateLink)"
                v-if="!isUndefined(item.alternateLink)"
                >View in google classroom</md-button
              >
            </md-table-cell>
          </md-table-row>
        </md-table>
      </md-tab>
    </md-tabs>
  </dialog-box-component>
</template>

<script lang="ts">
import { CourseWork } from "@/types/ClassroomAPI/courseWork";
import { DialogBox } from "@/components/DialogBox/DialogBox";
import DialogBoxComponent from "@/components/DialogBox/DialogBoxComponent.vue";
import Vue from "vue";
import { PropType } from "vue/types/umd";
import { CourseManager } from "@/services/ClassroomAPI/api/course";
import { AxiosResponse } from "axios";
import firebase from "firebase";
import { TaAssistantDb } from "@/services/Database/TaAssistantDb";

const createWorkDialog = new DialogBox("createNewWorkDialog");
const informDialogBox = new DialogBox("informDialogBox");

export default Vue.extend({
  name: "CreateWorkDialog",
  components: {
    DialogBoxComponent,
  },
  props: {
    unlinkedWork: {
      type: Array as PropType<Array<CourseWork>>,
      required: true,
    },
    classroomCourse: {
      type: Object as PropType<CourseManager>,
      required: true,
    },
    refreshDataFunction: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      workTitleFieldClass: "",
      createWorkInfo: {
        title: null,
        workType: "ASSIGNMENT",
        acknowledgeAssociatedWithDeveloper: false,
      },
    };
  },
  methods: {
    isUndefined(data: any) {
      return typeof data === "undefined";
    },
    openUrl(url: string) {
      console.log(url);
      window.open(url, "_blank");
    },
    createWork(): Promise<void> {
      this.workTitleFieldClass = "";
      if (this.createWorkInfo.title === null) {
        this.workTitleFieldClass = "md-invalid";
        throw Error("The work title can't be empty");
      }
      createWorkDialog.dismiss();
      informDialogBox.show({
        dialogBoxContent: {
          title: "Creating your work",
          content: "Hang on while we are creating your work!",
        },
        dialogBoxActions: [],
      });
      const config: CourseWork = {
        title: this.createWorkInfo.title ?? "",
        workType: this.createWorkInfo.workType,
      };
      let workId: string;
      return this.classroomCourse
        .courseWork()
        .create(config)
        .then((res: AxiosResponse) => {
          console.log(res.data);
          const course: CourseWork = res.data;
          workId = course.id ?? "Unknown";
          return this.createWorkInDatabase(
            this.classroomCourse.courseId,
            course.id ?? null
          );
        })
        .then(async () => {
          await this.refreshDataFunction();
          informDialogBox.dismiss();
          informDialogBox.show({
            dialogBoxContent: {
              title: "Done!",
              content:
                "Your work has been created in Google Classroom and TA Assistant System. \nYour workId is: " +
                workId,
            },
          });
        })
        .catch((e: any) => {
          this.promiseErrorHandler(e);
        });
    },
    linkWork(config: CourseWork): Promise<void> {
      createWorkDialog.dismiss();
      informDialogBox.show({
        dialogBoxContent: {
          title: "Linking your work",
          content: "Hang on while we are linking your work!",
        },
        dialogBoxActions: [],
      });
      return this.createWorkInDatabase(
        config.courseId as string,
        config.id as string
      ).then(async () => {
        await this.refreshDataFunction();
        informDialogBox.dismiss();
        informDialogBox.show({
          dialogBoxContent: {
            title: "Done!",
            content:
              "Your work on Google Classroom has been linked to TA Assistant Platform. \nYour workId is: " +
              config.id,
          },
        });
      });
    },
    createWorkInDatabase(classroomId: string | null, workId: string | null) {
      if (classroomId === null || workId === null) {
        throw Error("ClassroomId and workId can't be null");
      }
      const firestore = firebase.firestore();
      const database = new TaAssistantDb(firestore);
      return database.work().create(classroomId, workId);
    },
    promiseErrorHandler(e: any): void {
      informDialogBox.dismiss();
      informDialogBox.show({
        dialogBoxContent: {
          title: "Error",
          content:
            "an error occurred while creating your new work, Please try again",
        },
      });
      console.log("error");
      console.log(e);
    },
  },
});
</script>

<style scoped>
.md-switch {
  display: flex;
}
</style>
