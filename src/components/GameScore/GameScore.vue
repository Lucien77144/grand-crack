<script setup>
	const score = defineProps([ "score" ])
</script>

<template>
	<div class="game-score">
		<p v-html="score" />
	</div>
</template>
