<script setup>
	import { inject, watch, onMounted, onBeforeUnmount } from "vue"
	import { store } from "@/store"
</script>

<template>
	<div class="game-over">
		<div class="leaderboard">
			<img class="over__img" src="/assets/ui/game-over/gameover.png">
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.game-over {
		@include inset(0, fixed);

		align-items: center;
		background-color: rgb(0 0 0 / 80%);
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

		.leaderboard {
			width: 50vw;
		}

		.over__img {
			animation: appear 1s forwards;
		}
	}

	@keyframes appear {
		0% {
			opacity: 0;
			transform: translate(15%, 100%) rotate(15deg);
		}

		25% {
			opacity: 1;
		}

		100% {
			transform: translate(0%, 22%) rotate(3deg) scale(1.15);
		}
	}
</style>
