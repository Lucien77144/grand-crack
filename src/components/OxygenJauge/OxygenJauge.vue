<script setup>
	import { inject, computed } from "vue"

	const props = defineProps({
		player: {
			type: Number,
			required: true,
		},
	})

	const game = inject("game")

	let player1Oxygen = computed(() => game.value ? game.value.player1OxygenRef.value : 100)
	let player2Oxygen = computed(() => game.value ? game.value.player2OxygenRef.value : 100)

	const oxygen = props.player === 1 ? player1Oxygen : player2Oxygen
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
		border: 1px solid black;
		border-radius: 1rem;
		height: 15rem;
		overflow: hidden;
		position: absolute;
		top: 1rem;
		width: 1.5rem;

		.progress {
			@include inset(0);

			background-color: red;
			transform-origin: bottom;
			transition: transform 0s;
		}

		&.player-1 {
			left: 1rem;
		}

		&.player-2 {
			right: 1rem;
		}
	}
</style>
