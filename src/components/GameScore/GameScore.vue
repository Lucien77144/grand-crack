<script setup>
	import { store } from "@/store"
	const score = defineProps([ "player" ])

	const getFillValue = (score) => {
		const fillLength = 6 - score.toString().length
		return "0".repeat(fillLength)
	}
</script>

<template>
	<div class="game-score__wrapper" :class="['player-' + player]">
		<div class="game-score">
			<p class="score__number">
				{{ getFillValue(store.players[player - 1].score)
				}}{{ store.players[player - 1].score }}
			</p>
			<!-- <img class="score__bg" src="/assets/img/score.png" alt=""> -->
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.game-score {
		align-items: center;
		color: #ffa21f;
		display: flex;
		font-family: DigitalNumbers, sans-serif;
		font-size: 2rem;
		height: 4rem;
		opacity: 0.75;

		&__wrapper {
			bottom: 5.4rem;
			position: fixed;
			width: 11rem;

			&.player-1 {
				left: 3.25rem;
				transform: rotateX(14deg) rotateY(-4deg);
			}

			&.player-2 {
				right: 2.75rem;
				transform: rotateX(-4deg) rotateY(-4deg);
			}
		}

		.score__number {
			letter-spacing: -0.15em;
			padding-right: 2rem;
			position: relative;
			text-align: end;
			text-wrap: nowrap;
			width: 100%;
			z-index: 1;

			&::after {
				content: "€";
				font-family: Combo, sans-serif;
				font-size: 0.5em;
				position: absolute;
				right: 1.25em;
				top: 25%;
				transform: translateY(-50%);
			}
		}
	}

	.score__bg {
		height: auto;
		left: 0;
		position: absolute;
		top: 0;
	}
</style>
