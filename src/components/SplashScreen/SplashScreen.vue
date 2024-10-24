<script setup>
	import { inject, watch, onBeforeUnmount } from "vue"
	import { store } from "@/store"
</script>

<template>
	<div class="splash-screen">
		<div class="logo">
			<img src="/assets/ui/splash-screen/logo.png">
		</div>
		<div class="start-button">
			<img src="/assets/ui/splash-screen/start-button.svg">
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.splash-screen {
		@include inset(0, fixed);

		align-items: center;
		background: rgb(0 0 0 / 82%);
		color: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.5s;
		z-index: 2;

		&.is-visible {
			opacity: 1;
			pointer-events: all;
		}

		.logo {
			width: 30rem;
		}

		.start-button {
			cursor: pointer;
			margin-top: 2rem;
			width: 10rem;
		}
	}
</style>
