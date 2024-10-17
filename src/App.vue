<script setup>
	import { RouterView } from "vue-router"
	import { onMounted, onBeforeUnmount, provide, shallowRef, watch } from "vue"
	import { useRaf } from "@/composables/useRaf/useRaf"
	import { Game } from "@/game/Game"
	import KitchenPlan from "@/components/KitchenPlan/KitchenPlan.vue"
	import OxygenJauge from "@/components/OxygenJauge/OxygenJauge.vue"
	import GameOver from "@/components/GameOver/GameOver.vue"
	import { store } from "@/store"

	const $$canvasWrapper = shallowRef()

	const isKitchenPlanVisible = shallowRef(true)

	// Game state
	let game = shallowRef()
	let t = 0
	provide("game", game)

	useRaf((dt) => {
		if (!game.value) return
		t += dt
		game.value.update(dt, t)
	})

	onMounted(() => {
		game.value = new Game($$canvasWrapper.value)
		game.value.setup()
	})

	watch(() => store.isGameOver, (v) => {
		if (v) return
		game.value.reset()
	})

	onBeforeUnmount(() => {
		game.value.destroy()
	})
</script>

<template>
	<!-- <RouterView /> -->
	<main class="site-wrapper">
		<button class="debug-button" @click="isKitchenPlanVisible = !isKitchenPlanVisible">
			Toggle Kitchen Plan DOM
		</button>
		<GameOver v-if="store.isGameOver" />
		<OxygenJauge :player="1" />
		<OxygenJauge :player="2" />
		<KitchenPlan v-if="isKitchenPlanVisible" />
		<div ref="$$canvasWrapper" />
		<div class="background">
			<img src="/assets/img/background.jpg" alt="background">
		</div>
	</main>
</template>

<style lang="scss" scoped>
	.site-wrapper {
		height: 100%;
		position: relative;
		width: 100%;

		.debug-button {
			background-color: white;
			border: 0.1rem solid white;
			left: 50%;
			position: absolute;
			top: 1rem;
			transform: translateX(-50%);
			z-index: 1;
		}

		.background {
			@include inset(0, fixed);

			z-index: -1;
		}
	}
</style>
