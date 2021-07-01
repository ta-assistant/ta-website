<template>
  <md-dialog
    :md-active.sync="dialogBox.active"
    :md-close-on-esc="dialogBox.dialogConfig.config.closeOnEsc"
    :md-click-outside-to-close="
      dialogBox.dialogConfig.config.clickOutsideToClose
    "
    :md-fullscreen="dialogBox.dialogConfig.config.fullscreen"
  >
    <md-dialog-title v-if="!isCustomDialogBox">{{
      dialogBox.dialogConfig.dialogBoxContent.title
    }}</md-dialog-title>

    <md-dialog-content v-if="!isCustomDialogBox">
      {{ dialogBox.dialogConfig.dialogBoxContent.content }}
    </md-dialog-content>

    <slot v-else></slot>

    <md-dialog-actions
      v-if="dialogBox.dialogConfig.dialogBoxActions.length !== 0"
    >
      <div
        v-for="action in dialogBox.dialogConfig.dialogBoxActions"
        :key="dialogBox.dialogConfig.dialogBoxActions.indexOf(action)"
      >
        <md-button :class="action.buttonClass" @click="action.onClick">
          <div>
            {{ action.buttonContent }}
          </div>
        </md-button>
      </div>
    </md-dialog-actions>
  </md-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { DialogConfig } from "@/types/components/DialogBox";
import DialogBoxEventBus, {
  DialogEvent,
  DialogEventResponse,
} from "./DialogBoxEventBus";

export default Vue.extend({
  name: "DialogBoxComponent",
  props: {
    dialogBoxId: {
      type: String,
      required: true,
    },
    isCustomDialogBox: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogBox: {
        active: false,
        dialogConfig: {
          config: {
            closeOnEsc: false,
            clickOutsideToClose: false,
            fullscreen: false,
          },
          dialogBoxContent: {
            title: "",
            content: "",
          },
          dialogBoxActions: [
            {
              buttonContent: "close",
              buttonClass: "md-primary",
              onClick: (): void => {
                this.$data.dialogBox.active = false;
              },
            },
          ],
        },
      },
    };
  },
  mounted() {
    DialogBoxEventBus.$on(DialogEvent.show, (dialogConfig: DialogConfig) => {
      if (dialogConfig.dialogBoxId !== this.dialogBoxId) {
        return;
      }
      if (
        !this.isCustomDialogBox &&
        typeof dialogConfig.dialogBoxContent === "undefined"
      ) {
        DialogBoxEventBus.$emit(`RESPONSE-${this.dialogBoxId}`, {
          success: false,
          message:
            "dialogBoxContent must be specified since " +
            this.dialogBoxId +
            " dialog is not a customDialog",
        });
      }
      this.dialogBox.active = false;
      this.$set(this.dialogBox, "dialogConfig", dialogConfig);
      this.dialogBox.active = true;
      DialogBoxEventBus.$emit(`RESPONSE-${this.dialogBoxId}`, {
        success: true,
      });
    });
    DialogBoxEventBus.$on(DialogEvent.dismiss, (config: DialogConfig) => {
      if (config.dialogBoxId !== this.dialogBoxId) {
        return;
      }
      this.$data.dialogBox.active = false;
      DialogBoxEventBus.$emit(`RESPONSE-${this.dialogBoxId}`, {
        success: true,
      });
    });
  },
});
</script>
