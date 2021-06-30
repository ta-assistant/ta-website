<template>
  <md-dialog
    :md-active.sync="dialogBox.active"
    :md-close-on-esc="dialogBox.config.closeOnEsc"
    :md-click-outside-to-close="dialogBox.config.clickOutsideToClose"
    :md-fullscreen="dialogBox.config.fullscreen"
  >
    <md-dialog-title
      v-if="dialogBox.dialogBoxContent.title.isHTML"
      v-html="dialogBox.dialogBoxContent.title.value"
    >
    </md-dialog-title>
    <md-dialog-title v-else>{{
      dialogBox.dialogBoxContent.title.value
    }}</md-dialog-title>

    <md-dialog-content
      v-if="dialogBox.dialogBoxContent.content.isHTML"
      v-html="dialogBox.dialogBoxContent.content.value"
    ></md-dialog-content>
    <md-dialog-content v-else>
      {{ dialogBox.dialogBoxContent.content.value }}
    </md-dialog-content>

    <md-dialog-actions v-if="dialogBox.dialogBoxActions.length !== 0">
      <div
        v-for="action in dialogBox.dialogBoxActions"
        :key="dialogBox.dialogBoxActions.indexOf(action)"
      >
        <md-button :class="action.buttonClass" @click="action.onClick">
          <div
            v-if="action.buttonContent.isHTML"
            v-html="action.buttonContent.value"
          ></div>
          <div v-else>
            {{ action.buttonContent.value }}
          </div>
        </md-button>
      </div>
    </md-dialog-actions>
  </md-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { DialogConfig } from "@/types/components/DialogBox";

export default Vue.extend({
  name: "DialogBox",
  data(): object {
    return {
      dialogBox: {
        active: false,
        config: {
          closeOnEsc: false,
          clickOutsideToClose: false,
          fullscreen: false,
        },
        dialogBoxContent: {
          title: {
            value: "",
            isHTML: false,
          },
          content: {
            value: "",
            isHTML: false,
          },
        },
        dialogBoxActions: [
          {
            buttonContent: {
              value: "Close",
              isHTML: false,
            },
            buttonClass: "md-primary",
            onClick: (): void => {
              this.$data.dialogBox.active = false;
            },
          },
        ],
      },
    };
  },
  methods: {
    showDialogBox(dialogConfig: DialogConfig): void {
      this.$data.dialogBox.active = false;

      // Set dialogBox Config
      if (typeof dialogConfig.config === "undefined") {
        dialogConfig.config = {
          closeOnEsc: false,
          clickOutsideToClose: false,
          fullscreen: false,
        };
      }
      this.$data.dialogBox.config.closeOnEse =
        dialogConfig.config.closeOnEsc ?? false;
      this.$data.dialogBox.config.clickOutsideToClose =
        dialogConfig.config.clickOutsideToClose ?? false;
      this.$data.dialogBox.config.fullscreen =
        dialogConfig.config.fullscreen ?? false;

      // Set dialogBox Content
      if (typeof dialogConfig.dialogBoxContent?.title === "undefined") {
        dialogConfig.dialogBoxContent.title = {
          value: "",
          isHTML: false,
        };
      }
      if (typeof dialogConfig.dialogBoxContent.content === "undefined") {
        dialogConfig.dialogBoxContent.content = {
          value: "",
          isHTML: false,
        };
      }
      this.$set(
        this.$data.dialogBox.dialogBoxContent,
        "title",
        dialogConfig.dialogBoxContent.title
      );
      this.$set(
        this.$data.dialogBox.dialogBoxContent,
        "content",
        dialogConfig.dialogBoxContent.content
      );

      // Set dialogBox Action buttons
      this.$set(
        this.$data.dialogBox,
        "dialogBoxActions",
        dialogConfig.dialogBoxActions ?? [
          {
            buttonContent: {
              value: "Close",
              isHTML: false,
            },
            buttonClass: "md-primary",
            onClick: (): void => {
              this.$data.dialogBox.active = false;
            },
          },
        ]
      );

      this.$data.dialogBox.active = true;
    },
    dismissDialogBox(): void {
      this.$data.dialogBox.active = false;
    },
  },
});
</script>
