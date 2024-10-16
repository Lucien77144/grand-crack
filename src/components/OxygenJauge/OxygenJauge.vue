<script setup>
	import { inject } from "vue"

	const props = defineProps({
		player: {
			type: Number,
			required: true,
		},
	})

	const game = inject("game")
	console.log(game.value)
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
					transform: 'scaleY(' + progress / 100 + ')',
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
			background-color: red;
			height: 100%;

			// @include inset(0, absolute);

			// background-color: red;

			// height: 100%;
			// width: 100%;
			transform-origin: bottom;
			width: 100%;
		}

		&.player-1 {
			left: 1rem;
		}

		&.player-2 {
			right: 1rem;
		}
	}
</style>
