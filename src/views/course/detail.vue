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
        <div class="work-list">
            <div class="work md-elevation-3 md-layout">
                <p class="md-layout-item md-small-size-30">Exercise 1</p>
                <md-progress-bar class="md-layout-item md-small-size-40" :md-value="40"></md-progress-bar>
                <div class="md-layout-item md-small-size-30">
                    <md-button class="md-primary md-raised">View Work</md-button>
                </div>
            </div>
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
    padding: 0;
}
.menu > * {
    margin-right: .5rem;
    margin-left: 0;
}
.container {
    padding: 1rem;
}
.work-list {
    padding-top: 1rem;
}
.work {
    padding: 1rem;
}
.md-progress-bar {
    align-self: center;
}
</style>