<script setup>
	import { RouterView } from "vue-router"
	import { onMounted, onBeforeUnmount, provide, shallowRef } from "vue"
	import { useRaf } from "@/composables/useRaf/useRaf"

	// Game state
	let game = shallowRef()
	provide("game", game)

	useRaf((dt) => {
		if (!game.value) return
		t += dt
		// game.value.update(ctx, dt, t)
		// game.value.draw(ctx, dt, t)
	})

	onMounted(() => {
		// game.value = new Game()
		// game.value.setup()
	})

	onBeforeUnmount(() => {
		// game.value.destroy()
	})
</script>

<template>
	<RouterView />
</template>
