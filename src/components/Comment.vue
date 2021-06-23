<template>
  <md-card>
    <md-card-header>
      <div class="md-title">Pontakorn Peasaeng</div>
    </md-card-header>
    <md-card-content>
      <div v-html="htmlComment"></div>
    </md-card-content>
  </md-card>	
</template>

<script lang="ts">
import Vue from 'vue'
import markdown from "../utils/markdown"
export default Vue.extend({
  name: "Comment",
  data: () => {
    return {
      comment: "This is not fine. **Remember**"
    }
  },
  computed: {
    htmlComment() {
      return markdown.render(this.comment)
    }
  }
})
</script>