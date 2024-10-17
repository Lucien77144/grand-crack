<script setup>
	import { onMounted, onBeforeUnmount, provide, shallowRef, watch } from "vue"
	import { useRaf } from "@/composables/useRaf/useRaf"
	import { useSize } from "@/composables/useSize/useSize"
	import { Game } from "@/game/Game"
	import Kitchen from "@/components/Kitchen/Kitchen.vue"
	import OxygenJauge from "@/components/OxygenJauge/OxygenJauge.vue"
	import GameOver from "@/components/GameOver/GameOver.vue"
	import { store } from "@/store"
	import TextureLoader from "@/game/TextureLoader"
	import Signal from "@/utils/signal"

	onMounted(() => {
		Signal.emit(":test", "Hello")

		console.log(Signal)
	})

	const $$canvas = shallowRef()
	const $$video = shallowRef()

	const isKitchenVisible = shallowRef(false)

	const { size } = useSize({ ref: $$canvas, cb: resize })

	// Game state
	let game = shallowRef()
	let textureLoader = shallowRef()
	let t = 0
	provide("game", game)

	useRaf((dt) => {
		if (!game.value) return
		t += dt
		game.value.update(dt, t)
	})

	onMounted(() => {
		$$video.value.play()

		// Create a texture loader
		textureLoader.value = new TextureLoader()
		textureLoader.value.loadTexture().then(() => {
			// Create game
			game.value = new Game($$canvas.value, size)
			game.value.setup()
		})

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

		// Resize canvas
		game.value.resize(size)

		// Resize UI
		const screenWidth = window.innerWidth
		const fontSize = screenWidth / 64
		document.documentElement.style.fontSize = `${ fontSize }px`
	}
</script>

<template>
	<main class="site-wrapper">
		<button class="debug-button" @click="isKitchenVisible = !isKitchenVisible">
			Toggle Kitchen DOM
		</button>
		<GameOver v-if="store.isGameOver" />
		<OxygenJauge :player="1" />
		<OxygenJauge :player="2" />
		<Kitchen v-if="isKitchenVisible" />
		<div ref="$$canvas" />
		<div class="background">
			<video
				ref="$$video"
				src="/assets/video/background.mp4"
				muted
				loop
			/>
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
