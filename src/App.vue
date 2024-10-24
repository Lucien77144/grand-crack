<script setup>
	import { onMounted, onBeforeUnmount, provide, shallowRef, watch } from "vue"
	import { useRaf } from "@/composables/useRaf/useRaf"
	import { useSize } from "@/composables/useSize/useSize"
	import { Game } from "@/game/Game"
	import GameOver from "@/components/GameOver/GameOver.vue"
	import CookingInstruction from "@/components/CookingInstruction/CookingInstruction.vue"
	import TextureLoader from "@/game/TextureLoader"
	import Signal from "@/utils/signal"
	import SplashScreen from "@/components/SplashScreen/SplashScreen.vue"
	import TaskManager from "@/components/TaskManager/TaskManager.vue"
	import SoundManager from "@/game/SoundManager"
	import GameScore from "@/components/GameScore/GameScore.vue"
	import { store } from "@/store"

	const $$canvas = shallowRef()
	const $$video = shallowRef()

	const { size } = useSize({ ref: $$canvas, cb: resize })

	// Game state
	let game = shallowRef()
	let textureLoader = shallowRef()
	const textures = shallowRef()
	let soundManager = shallowRef()
	let t = 0
	provide("game", game)

	const isPanic = shallowRef(false)

	useRaf((dt) => {
		if (!game.value) return
		t += dt
		game.value.update(dt, t)

		if (!game?.value?.player1?.oxygen || !game?.value?.player2?.oxygen) {
			return
		}

		if (
			game?.value?.player1?.oxygen <= 40 ||
			game?.value?.player2?.oxygen <= 40
		) {
			isPanic.value = true
		} else {
			isPanic.value = false
		}
	})

	onMounted(() => {
		// $$video.value.play()

		// Create a texture loader
		textureLoader.value = new TextureLoader()
		textureLoader.value.loadTexture().then((e) => {
			textures.value = e
			// Create game
			soundManager.value = new SoundManager()
			game.value = new Game($$canvas.value, size)
			game.value.setup()
		})

		watch([ () => size ], resize)

		watch(
			() => store.players[ 0 ].action,
			(action) => {
				Signal.emit(":actionPlayer1", action)
			}
		)

		watch(
			() => store.players[ 1 ].action,
			(action) => {
				Signal.emit(":actionPlayer2", action)
			}
		)
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
		<TaskManager :textures="textures" />
		<div
			class="overlay"
			:class="{
				'is-panic': isPanic,
			}"
		/>
		<GameScore :player="1" />
		<GameScore :player="2" />
		<SplashScreen
			:class="{
				'is-visible': store.isSplashScreen,
			}"
		/>
		<GameOver
			:class="{
				'is-visible': store.isGameOver,
			}"
		/>
		<div ref="$$canvas" />
		<div class="bumper-left">
			<img src="/assets/img/base.png">
			<img src="/assets/img/coke.png">
		</div>
		<div class="bumper-right">
			<img src="/assets/img/base.png">
			<img src="/assets/img/coke.png">
		</div>
		<!-- <CookingInstruction :player="1" />
		<CookingInstruction :player="2" /> -->
	</main>
</template>

<style lang="scss" scoped>
	.bumper-left,
	.bumper-right {
		bottom: 3rem;
		left: 40px;
		position: absolute;
		width: 15rem;

		img {
			height: auto;
			left: -50px;
			position: absolute;
			top: 0;
			width: 100%;
		}

		img:nth-child(1) {
			//width: 100px;
		}

		img:nth-child(2) {
			//transition: clip-path 1s;
			//clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
			clip-path: inset(0 0 0 0);
			left: 20%;
			top: 0.75rem;
			width: 60%;
		}
	}

	.bumper-right {
		left: auto;
		right: 40px;
		transform: scaleX(-1);
	}

	.site-wrapper {
		height: 100%;
		position: relative;
		width: 100%;

		.overlay {
			background-color: rgb(255 0 0 / 0%);
			z-index: 1;
			@include inset(0, fixed);

			&::after {
				@include inset(0, absolute);

				background:
					radial-gradient(
						circle,
						rgb(255 0 0 / 0%) 0%,
						rgb(255 0 0 / 25%) 50%,
						rgb(255 0 0 / 50%) 100%
					);
				content: "";
				opacity: 0;
				transition: opacity 5s cubic-bezier(0.215, 0.61, 0.355, 1);
			}

			&.is-panic {
				&::after {
					opacity: 1;
				}
			}
		}

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
