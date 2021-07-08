<template>
  <dialogbox-component
    :dialogBoxId="'linkCourseDialogbox'"
    :isCustomDialogBox="true"
  >
    <md-dialog-title> Link the new course </md-dialog-title>
    <md-table
      md-sort="name"
      md-sort-order="asc"
      v-model="unLinkedCoursesList"
      md-fixed-header
      v-if="unLinkedCoursesList.length !== 0"
    >
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="ID" md-sort-by="id">{{
          item.id
        }}</md-table-cell>
        <md-table-cell md-label="Name" md-sort-by="name">
          {{ item.name }}
        </md-table-cell>
        <md-table-cell md-label="State" md-sort-by="state">
          {{ item.courseState }}
        </md-table-cell>
        <md-table-cell md-label="Actions">
          <md-button class="md-raised md-primary" @click="linkCourse(item)"
            >Link course</md-button
          >
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-empty-state
      md-rounded
      md-icon="dashboard"
      md-label="No course can be linked"
      md-description="Try connecting the new one on Google Classroom!"
      v-else
    />
  </dialogbox-component>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import DialogboxComponent from "@/components/DialogBox/DialogBoxComponent.vue";
import { Course } from "@/types/ClassroomAPI/courses";
import { TaAssistantDb } from "@/services/Database/TaAssistantDb";
import firebase from "firebase";
import { DialogBox } from "../DialogBox/DialogBox";

const informDialogBox = new DialogBox("informDialogBox");
const linkCourseDialogbox = new DialogBox("linkCourseDialogbox");

export default Vue.extend({
  name: "LinkCourseDialog",
  components: {
    DialogboxComponent,
  },
  props: {
    unLinkedCoursesList: {
      type: Array as PropType<Course>,
      required: true,
    },
    database: {
      type: Object as PropType<TaAssistantDb>,
      required: true,
    },
    firebaseUser: {
      type: Object as PropType<firebase.User>,
      required: true,
    },
    refreshData: {
      type: Function,
      required: true,
    },
  },
  methods: {
    linkCourse(course: Course) {
      linkCourseDialogbox.dismiss();
      informDialogBox.show({
        dialogBoxContent: {
          title: "Linking the course",
          content: "Hang on while we linking your new course!",
        },
        dialogBoxActions: [],
      });
      this.database
        .classroom()
        .create(course, this.firebaseUser.uid)
        .then(async () => {
          await this.refreshData();
          informDialogBox.dismiss();
          informDialogBox.show({
            dialogBoxContent: {
              title: "Success",
              content: "Successfully to link your new course",
            },
          });
        })
        .catch((e) => {
          console.log(e);
          informDialogBox.dismiss();
          informDialogBox.show({
            dialogBoxContent: {
              title: "Error",
              content: "Something went wrong while we linking your course",
            },
          });
        });
    },
  },
});
</script>
