<script setup>
	import { inject, computed } from "vue"
	import Signal from "@/utils/signal"
	import oxygenIcon from "/assets/ui/oxygen/oxygen-icon.svg"

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
						transform: 'scaleY(' + player1Oxygen / 100 + ')',
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
			background-color: #f2dfc8;
			border: 0.1rem solid #c2b2a0;
			border-radius: 1rem;
			display: block;
			height: 15rem;
			margin: 0 auto;
			overflow: hidden;
			position: relative;
			top: 1rem;
			width: 1.2rem;

			.progress {
				background:
					linear-gradient(
						to right,
						#7f9bfe 0%,
						#435baa 100%
					);
				border-radius: 1rem;
				position: absolute;
				transform-origin: bottom;
				transition: transform 0s;
				@include inset(0);
			}
		}

		.oxygen-icon {
			display: block;
			height: auto;
			margin: 0 auto;
			margin-top: 0.5rem;
			position: relative;
			width: 1.5rem;
		}
	}
</style>
