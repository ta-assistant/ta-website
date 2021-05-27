<template>
  <div class="page-container">
    <md-app class="full-height">
        <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">TA Website</span>
        </md-app-toolbar>
      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">Navigation</md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">Inbox</span>
          </md-list-item>

          <md-list-item>
            <md-icon>send</md-icon>
            <span class="md-list-item-text">Sent Mail</span>
          </md-list-item>

          <md-list-item>
            <md-icon>delete</md-icon>
            <span class="md-list-item-text">Trash</span>
          </md-list-item>

          <md-list-item>
            <md-icon>error</md-icon>
            <span class="md-list-item-text">Spam</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

        <md-app-content>
            <slot></slot>
        </md-app-content>
    </md-app>
  </div>
</template>

<script>
export default {
    name: "Main",
    data() {
        return {
            menuVisible: false
        }
    }
}
</script>

<style>
.page-container {
    height: 100%;
    width: 100%;
}
.full-height {
    height: 100%;
}
</style>