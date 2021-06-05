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

<style>
.container {
    padding: 1rem;
}
.w-half {
    width: 50%;
}
</style>