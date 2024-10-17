<script setup>
	import { inject, computed } from "vue"

	const props = defineProps({
		player: {
			type: Number,
			required: true,
		},
	})

	const game = inject("game")

	let player1Oxygen = computed(() => game.value ? game?.value?.player1OxygenRef?.value : 100)
	let player2Oxygen = computed(() => game.value ? game?.value?.player2OxygenRef?.value : 100)

	const oxygen = props.player === 1 ? 100 : player2Oxygen
</script>

<template>
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
</template>

<style lang="scss" scoped>
	.oxygen-jauge {
		border-radius: 1rem;
		height: 15rem;
		inset: 0.05rem solid white;
		background-color: #F2DFC8;
		overflow: hidden;
		position: absolute;
		top: 1rem;
		width: 1.2rem;
		border: 0.1rem solid #C2B2A0;

		.progress {
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

		&.player-1 {
			left: 1rem;
		}

		&.player-2 {
			right: 1rem;
		}
	}
</style>
