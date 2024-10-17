<script setup>
	import { store } from "@/store"

	function onReplayClick() {
		store.isGameOver = false
	}
</script>

<template>
	<div class="game-over">
		<h1>Game Over</h1>
		<p>T'es éclaté.e mon pote</p>
		<button @click="onReplayClick">
			Rejouer
		</button>
	</div>
</template>

<style lang="scss" scoped>
	.game-over {
		@include inset(0, fixed);

		align-items: center;
		background-color: rgb(0 0 0 / 80%);
		color: white;
		display: none !important; // TODO! - This is for debug
		display: flex;
		flex-direction: column;
		justify-content: center;
		z-index: 2;
	}
</style>
