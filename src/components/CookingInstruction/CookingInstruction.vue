<script setup>
	import { ref, computed } from "vue"
	import Signal from "@/utils/signal"

	const player1Action = ref(null)
	const player2Action = ref(null)

	Signal.on(":actionPlayer1", (payload) => {
		player1Action.value = payload
	})

	Signal.on(":actionPlayer2", (payload) => {
		player2Action.value = payload
	})

	const props = defineProps({
		player: {
			type: Number,
			required: true,
		},
	})

	const action = computed(() => props.player === 1 ? player1Action.value : player2Action.value)

	const actionImage = computed(() => {
		if (!action.value) return null

		return new URL(`/assets/ui/instructions/${ action.value }.svg`, import.meta.url).href
	})
</script>

<template>
	<div
		class="instruction-container"
		:class="'player-' + player"
	>
		<img v-if="actionImage" :src="actionImage" alt="Instruction">

		<div>
			<p v-if="action === 'cutter'">
				Click on at the right pace to cut
			</p>
			<p v-else-if="action === 'mixer'">
				Use your joystick to mix mix
			</p>
			<p v-else-if="action === 'baker'">
				Baking...
			</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.instruction-container {
	position: absolute;
	bottom: 1rem;

	&.player-1 {
		left: 1rem;
	}

	&.player-2 {
		right: 1rem;
	}

	p {
		color: white;
	}
}
</style>
