<script setup>
	import { RouterView } from "vue-router"
	import { onMounted, onBeforeUnmount, provide, shallowRef, watch } from "vue"
	import { useRaf } from "@/composables/useRaf/useRaf"
	import { useSize } from "@/composables/useSize/useSize"
	import { Game } from "@/game/Game"
	import KitchenPlan from "@/components/KitchenPlan/KitchenPlan.vue"
	import OxygenJauge from "@/components/OxygenJauge/OxygenJauge.vue"
	import GameOver from "@/components/GameOver/GameOver.vue"
	import { store } from "@/store"

	const $$canvas = shallowRef()

	const isKitchenPlanVisible = shallowRef(true)

	const { size } = useSize({ ref: $$canvas, cb: resize })

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
		game.value = new Game($$canvas.value, size)
		game.value.setup()

		watch([ () => size ], resize)
	})

	watch(() => store.isGameOver, (v) => {
		if (v) return
		game.value.reset()
	})

	onBeforeUnmount(() => {
		game.value.destroy()
	})

	function resize() {
		if (!game.value || !$$canvas.value) return
		game.value.resize(size)

		const screenWidth = window.innerWidth
		const fontSize = screenWidth / 64
		document.documentElement.style.fontSize = `${ fontSize }px`
	}
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
		<div ref="$$canvas" />
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
