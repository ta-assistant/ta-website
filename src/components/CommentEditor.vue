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
		  <div v-html="renderedText"></div>
	  </md-card-content>
	  <md-card-actions>
		  <md-button @click="statusButtonAction" class="md-primary">{{statusButtonText}}</md-button>
		  <md-button class="md-primary md-raised">Comment</md-button>
	  </md-card-actions>
  </md-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import markdown from "../utils/markdown"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator"
import "highlight.js/styles/atom-one-dark.css";

type EditorStatus = 'edit' | 'preview'

@Component({
	props: {
		value: {
			type: String as PropType<string>,
			required: true,
			default: ""
		}
	}
})
export default class CommentEditor extends Vue{
	@Prop({
		type: String as PropType<string>,
		required: true,
		default: ""
	}) 
	value!: string
	text = ""
	status = "edit" as EditorStatus
	get statusButtonText() {
		return this.status === 'edit' ? 'Preview' : 'Edit'
	}
	get renderedText() {
		return markdown.render(this.value)
	}
	statusButtonAction()  {
		if (this.status === 'edit') {
			this.status = 'preview'
		} else {
			this.status = 'edit'
		}
	}
}


</script>