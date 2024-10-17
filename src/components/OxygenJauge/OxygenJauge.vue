<script setup>
	import { inject, computed } from "vue"
	import oxygenIcon from "/assets/ui/oxygen/oxygen-icon.svg"

	const props = defineProps({
		player: {
			type: Number,
			required: true,
		},
	})

	const game = inject("game")

	let player1Oxygen = computed(() => game.value ? game?.value?.player1OxygenRef?.value : 100)
	let player2Oxygen = computed(() => game.value ? game?.value?.player2OxygenRef?.value : 100)

	const oxygen = props.player === 1 ? player1Oxygen : player2Oxygen
</script>

<template>
	<div
		class="oxygen-container"
	>
		<div
			class="oxygen-jauge"
			:class="
				'player-' + player
			"
		>
			<div
				class="progress"
				:style="
					{
						transform: 'scaleY(' + oxygen / 100 + ')',
					}
				"
			/>
		</div>

		<img
			class="oxygen-icon"
			:src="oxygenIcon"
			:alt="'Oxygène du joueur ' + player"
		>
	</div>
</template>

<style lang="scss" scoped>
	.oxygen-container {
		position: absolute;
		top: 1rem;

		&:has(.player-1) {
			left: 1rem;
		}

		&:has(.player-2) {
			right: 1rem;
		}

		.oxygen-jauge {
			border-radius: 1rem;
			height: 15rem;
			background-color: #F2DFC8;
			overflow: hidden;
			position: relative;
			display: block;
			top: 1rem;
			width: 1.2rem;
			margin: 0 auto;
			border: 0.1rem solid #C2B2A0;

			.progress {
				position: absolute;
				@include inset(0);
				background: linear-gradient(
					to right,
					#7F9BFE 0%,
					#435BAA 100%
				);
				transform-origin: bottom;
				transition: transform 0s;
				border-radius: 1rem;
			}
		}

		.oxygen-icon {
			position: relative;
			display: block;
			height: auto;
			margin: 0 auto;
			margin-top: 0.5rem;
			width:	1.5rem
		}
	}
</style>
