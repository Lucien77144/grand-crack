<script setup>
	import { RouterView } from "vue-router"
	import { onMounted, onBeforeUnmount, provide, shallowRef } from "vue"
	import { useRaf } from "@/composables/useRaf/useRaf"
	import { Game } from "@/game/Game"
	import Desk from "@/components/Desk/Desk.vue"

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
		game.value = new Game()
		game.value.setup()
	})

	onBeforeUnmount(() => {
		game.value.destroy()
	})
</script>

<template>
	<Oxygen :player="1" />
	<Oxygen :player="2" />
	<Desk />
	<!-- <RouterView /> -->
</template>
