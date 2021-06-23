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
            <work-progress v-for="work in works" :key="work.link" :work="work" />
        </div>
    </div>
</layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Layout from "../../layouts/Main.vue"
import WorkProgress, {Work} from "../../components/WorkProgress.vue"
export default Vue.extend({
    components: {
        Layout,
        WorkProgress
    },
    data() {
        return {
            works: [
                {
                    name: "Exercise I",
                    progress: 20,
                    link: "4802"
                },
                {
                    name: "Extra Homework 88",
                    progress: "40",
                    link: "2389lrstikdi"
                }
            ]
        }
    }
})
</script>

<style>
.text-left {
    text-align: left;
}
.menu {
    display: flex;
    padding: .55rem;
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
.work-list > * {
    margin-bottom: 1rem;
}
.md-progress-bar {
    align-self: center;
}
</style>