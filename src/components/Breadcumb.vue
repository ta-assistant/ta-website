<template>
	<div class="breadcumb">
		{{ text }}
		rrsdd
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop} from 'vue-property-decorator'
import { Route, RouteRecord } from 'vue-router'
@Component
export default class Breadcumb extends Vue {
	@Prop() route!: Route
	get text() {
		const matched = this.route.matched.slice()
		let links: RouteRecord[] = []
		matched.forEach(route => {
			console.log(route)
			links.push(route)
		})
		return links
	}	
}
</script>