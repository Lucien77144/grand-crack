<script setup>
	import { store } from "@/store"
	const score = defineProps([ "player" ])
</script>

<template>
	<div class="game-score__wrapper">
		<div class="game-score" :class="['player-' + player]">
			<p v-html="store.players[player - 1].score" />
			<img class="score__bg" src="/assets/img/score.png" alt="">
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.game-score {
		align-items: center;
		color: white;
		display: flex;
		font-family: DigitalNumbers, sans-serif;
		font-size: 2rem;
		transition: opacity 0.5s;

		&__wrapper {
			position: absolute;
			top: 0;
		}

		p {
			position: relative;
			z-index: 1;
		}

		&.player-1 {
			left: 10rem;
		}

		&.player-2 {
			right: 10rem;
		}
	}

	.score__bg {
		height: auto;
		left: 0;
		position: absolute;
		top: 0;
		width: 8rem;
	}
</style>
