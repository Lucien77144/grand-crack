<script setup>
	import { store } from "@/store"
	import { defineProps } from "vue"
	import TaskContainer from "./components/TaskContainer/TaskContainer.vue"
	import TaskPlayer from "./components/TaskPlayer/TaskPlayer.vue"
	import TaskIngredient from "./components/TaskIngredient/TaskIngredient.vue"

	const props = defineProps({
		textures: {
			type: Object,
			required: true,
		},
	})
</script>

<template>
	<div
		v-if="!store.isGameOver && store.isGameStarted"
		class="task__container"
	>
		<div class="task__wrapper">
			<div
				v-for="task in store.recipesList"
				:key="task.name"
				class="task"
			>
				<div class="task__header">
					<h1 class="task__title">
						{{ task.name }}
					</h1>
					<div class="task__player">
						<TaskPlayer :player="task.player" />
					</div>
					<div class="task__bg">
						<TaskContainer color="green" />
					</div>
					<div class="task__img">
						<img :src="task.cover" alt="">
					</div>
				</div>
				<div class="task__footer">
					<TaskIngredient :ingredients="task.ingredients" color="green" />
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" src="./TaskManager.scss" scoped></style>
