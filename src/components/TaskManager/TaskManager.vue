<script setup>
	import { store } from "@/store"
</script>

<template>
	<div class="task__container">
		<div v-for="task in store.recipesList" :key="task.name" class="task">
			<div class="task__header">
				<h1 class="task__title">
					{{ task.name }}
				</h1>
			</div>
			ceci est une task
		</div>
	</div>
</template>

<style lang="scss" src="./TaskManager.scss" scoped></style>
