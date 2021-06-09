<template>
<layout>
    <div class="container">
        <h1 class="md-title">Student Submission</h1>
        <div class="md-layout w-half">
            <div class="md-layout-item md-size-30">
                Student ID
            </div>
            <div class="md-layout-item md-size-70">
                6945623423
            </div>
            <div class="md-layout-item md-size-30">
                Submission Status
            </div>
            <div class="md-layout-item md-size-70">
                Submitted
            </div>
            <div class="md-layout-item md-size-30">
                Grading Status
            </div>
            <div class="md-layout-item md-size-70">
                Graded
            </div>
            <div class="md-layout-item md-size-30">
                Score
            </div>
            <div class="md-layout-item md-size-70">
                8000 / 8000
            </div>
        </div>
        <div>
            <md-button class="p-0 md-primary md-raised">Download Submitted file</md-button>
        </div>
        <h1 class="md-title">Scoring</h1>
        <form>
            <md-field>
                <label for="score">Score</label>
                <md-input name="score" type="number" id="score" placeholder="Score: Out of 8000"></md-input>
            </md-field>
            <md-button class="md-primary md-raised">Submit Score</md-button>
        </form>
        <h1 class="md-title">Comments</h1>
        <div class="comments">

        </div>
    </div>
</layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Layout from "../../layouts/Main.vue"
export default Vue.extend({
    name: "WorkDetail",
    components: {
        Layout
    }
})
</script>

<style >
.container {
    padding: 1rem;
}
.w-half {
    width: 50%;
}
.p-0 {
    margin: 0;
}
</style>