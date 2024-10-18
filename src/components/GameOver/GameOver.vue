<script setup>
	import { inject, watch, onMounted, onBeforeUnmount } from "vue"
	import { store } from "@/store"

	const game = inject("game")

	let timeout = null

	function onReplayClick() {
		store.isGameOver = false
		game.value.reset()
	}

	onMounted(() => {
		watch(() => game.value, (g) => {
			if (!store.isGameOver) return

			timeout = setTimeout(() => {
				g.player1.inputSet.addEvent("x", () => {
					onReplayClick()
				})
				g.player2.inputSet.addEvent("x", () => {
					onReplayClick()
				})
			}, 100)
		})
	})

	onBeforeUnmount(() => {
		clearTimeout(timeout)
	})
</script>

<template>
	<div class="game-over">
		<div class="leaderboard">
			<img src="/assets/ui/game-over/leaderboard.svg">
		</div>
		<div class="play-again">
			<img src="/assets/ui/game-over/play-again-button.svg">
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
			width: 50rem;
		}

		.play-again {
			cursor: pointer;
			margin-top: 2rem;
			width: 10rem;
		}
	}
</style>
