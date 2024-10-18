<script setup>
	import { store } from "@/store"
	const score = defineProps([ "player" ])
</script>

<template>
	<div
		class="game-score"
		:class="['player-' + player]"
	>
		<p v-html="store.players[player - 1].score" />
	</div>
</template>

<style lang="scss" scoped>
	.game-score {
		font-size: 4rem;
		color: white;
		position: absolute;
		top: 0;
		transition: opacity 0.5s;

		&.player-1 {
			left: 10rem;
		}

		&.player-2 {
			right: 10rem;
		}
	}
</style>
