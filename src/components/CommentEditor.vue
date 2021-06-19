<template>
  <md-card>
	  <md-card-header></md-card-header>
	  <md-card-content v-if="status == 'edit'">
		  <md-field>
			  <label>Comment (Support Markdown)</label>
			  <md-textarea v-model="value" />
		  </md-field>
	  </md-card-content>
	  <md-card-content v-else>
		  {{ value }}
	  </md-card-content>
	  <md-card-actions>
		  <md-button class="md-primary">Preview</md-button>
		  <md-button class="md-primary md-raised">Comment</md-button>
	  </md-card-actions>
  </md-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

type EditorStatus = 'edit' | 'preview'

export default Vue.extend({
	name: "CommentEditor",
	props: {
		value: {
			type: String as PropType<string>,
			required: true,
			default: ""
		}
	},
	data: () => {
		return {
			text: "",
			status: 'edit' as EditorStatus,
		}
	}
})
</script>