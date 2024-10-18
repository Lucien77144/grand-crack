<script setup>
	import { inject, computed, onMounted, shallowRef } from "vue"
	import { useRaf } from "@/composables/useRaf/useRaf"
	import { store } from "@/store"
	import Signal from "@/utils/signal"
	import oxygenIcon from "/assets/ui/oxygen/oxygen-icon.svg"

	const props = defineProps({
		player: {
			type: Number,
			required: true,
		},
	})

	const game = inject("game")

	const oxygen = shallowRef()

	useRaf((dt) => {
		if (
			store.isGameOver
			|| !game.value
			|| !game?.value[ `player${ props.player }` ]?.oxygen
		) return
		const realOxygen = game?.value[ `player${ props.player }` ]?.oxygen
		oxygen.value = Math.round(realOxygen * 10) / 10

		if ((Math.floor(realOxygen * 10) / 10) < 1) {
			return store.isGameOver = true
		}
	})
</script>

<template>
	<div
		class="oxygen-container"
		:class="['player-' + player, { 'is-visible': !store.isSplashScreen }]"
	>
		<div
			class="oxygen-jauge"
		>
			<div
				class="progress"
				:style="
					{ transform: 'translateY(' + (100 - oxygen) + '%)' }
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
		opacity: 0;
		transition: opacity 0.5s;

		&.is-visible {
			opacity: 1;
		}

		&.player-1 {
			left: 1rem;
		}

		&.player-2 {
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
