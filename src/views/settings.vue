<template>
	<Layout>
		<div class="container">
			<h1 class="md-title">Settings</h1>
			<p>userId: {{userId}}</p>
			<p>studentId: {{studentId}}</p>
			<p class="warning">Please remember to keep your API key secret.</p>
			<p>apiKey: {{apiKey}}</p>
			<md-button class="md-primary md-raised m-0">Get API Key</md-button>
		</div>
	</Layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Layout from "@/layouts/Main.vue"
import Component from "vue-class-component"
@Component({
	components: {
		Layout
	}
})
export default class Settings extends Vue {
	// TODO: Find a way to fetch this from API. Good luck.
	userId: string = "1234"
	studentId: string = "4321"
	apiKey: string = "rseitnersntse"
	
	getApiKey() {
		// TODO: Add method to retrieve API Key
	}
}
</script>

<style>
.warning {
	text-transform: uppercase;
	color: #ff0000;
}
.m-0 {
	margin: 0;
}
.container {
	padding: 0 2rem;
}
</style>