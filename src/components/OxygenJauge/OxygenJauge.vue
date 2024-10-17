<script setup>
	import { inject, computed } from "vue"
	import Signal from "@/utils/signal"

	Signal.on(":test", (payload) => {
		console.log(payload)
	})

	const props = defineProps({
		player: {
			type: Number,
			required: true,
		},
	})

	const game = inject("game")

	let player1Oxygen = computed(() => game?.value ? game?.value?.player1?.oxygenRef?.value : 100)
	let player2Oxygen = computed(() => game?.value ? game?.value?.player2?.oxygenRef?.value : 100)
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
					transform: 'scaleY(' + player1Oxygen / 100 + ')',
				}
			"
		/>
	</div>
</template>

<style lang="scss" scoped>
	.oxygen-jauge {
		background-color: #f2dfc8;
		border: 0.1rem solid #c2b2a0;
		border-radius: 1rem;
		height: 15rem;
		inset: 0.05rem solid white;
		overflow: hidden;
		position: absolute;
		top: 1rem;
		width: 1.2rem;

		.progress {
			@include inset(0);

			background:
				linear-gradient(
					to right,
					#7f9bfe 0%,
					#435baa 100%
				);
			border-radius: 1rem;
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
