<template>
<layout>
    <div class="container">
    <h1 class="md-title text-left">Computer Programming X</h1>
    <div class="menu">
        <md-button class="md-primary md-raised">
            <md-icon>add</md-icon>
            New Work
        </md-button>
        <md-button class="md-primary md-raised">
            <md-icon>campaign</md-icon>
            New Announcement
        </md-button>
    </div>
    </div>
</layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Layout from "../../layouts/Main.vue"
export default Vue.extend({
    components: {
        Layout
    }
})
</script>

<style>
.text-left {
    text-align: left;
}
.menu {
    display: flex;
}
.menu > * {
    margin-right: .5rem;
}
.container {
    padding: 1rem;
}
</style>