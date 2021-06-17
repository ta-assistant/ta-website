<template>
  <md-card>
    <md-card-header>
      <div class="md-title">Pontakorn Peasaeng</div>
    </md-card-header>
    <md-card-content>
      <markdown-it-vue class="md-body" :content="comment"></markdown-it-vue>
    </md-card-content>
  </md-card>	
</template>

<script lang="ts">
import Vue from 'vue'
import markdownItVue from "markdown-it-vue"
import 'markdown-it-vue/dist/markdown-it-vue.css'
export default Vue.extend({
  name: "Comment",
  components: {
    markdownItVue
  },
  data: () => {
    return {
      comment: "This is markdown *b* **mine**"
    }
  },
})
</script>