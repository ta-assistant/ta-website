<template>
<layout>
  <div class="container">
  <h1 class="md-title">Exercise 1 Submission</h1>
  <md-progress-bar :md-value="80"></md-progress-bar>
  <div class="menu">
    <div class="submenu">
      <md-button class="md-raised md-primary">Download all submissions</md-button>
      <md-button class="md-raised md-primary">Download scores as CSV</md-button>
      <md-button class="md-raised md-accent">Delete all submissions</md-button>
    </div>
    <div class="submenu"></div>
  </div>
  <md-table>
    <md-table-row>
      <md-table-head >4-Digits ID</md-table-head>
      <md-table-head>Submission</md-table-head>
      <md-table-head>Action</md-table-head>
    </md-table-row>
    <md-table-row>
      <md-table-cell>1234</md-table-cell>
      <md-table-cell>Graded</md-table-cell>
      <md-table-cell>
        <md-button class="md-raised md-primary">View</md-button>
      </md-table-cell>
    </md-table-row>
  </md-table>
  </div>
</layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Layout from "../../layouts/Main.vue"
export default Vue.extend({	
  name: "WorkSubmission",
  components: {
    Layout
  },
})
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