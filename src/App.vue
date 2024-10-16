<script setup>
	import { RouterView } from "vue-router"
	import { onMounted, onBeforeUnmount, provide, shallowRef } from "vue"
	import { useRaf } from "@/composables/useRaf/useRaf"
	import { Game } from "@/game/Game"

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
	<RouterView />
</template>
