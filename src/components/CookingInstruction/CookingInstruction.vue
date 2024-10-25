<script setup>
	import { store } from "@/store"
	import InstructionPlayer from "./InstructionPlayer/InstructionPlayer.vue"

	const getCutterPlayer = () => {
		return store.holdedItems.find((e) => e.action === "cutter")?.player
	}

	const getMixerPlayer = () => {
		return store.holdedItems.find((e) => e.action === "mixer")?.player
	}

	const getBakerPlayer = () => {
		return store.holdedItems.find((e) => e.action === "baker")?.player
	}
</script>

<template>
	<div class="instruction-container">
		<div v-if="getCutterPlayer()" class="instruction instruction-cutter">
			<InstructionPlayer :player="getCutterPlayer()" />
			<img src="/assets/img/break.png" alt="">
		</div>
		<div v-if="getMixerPlayer()" class="instruction instruction-mixer">
			<InstructionPlayer :player="getMixerPlayer()" />
			<img src="/assets/img/mix.png" alt="">
		</div>
		<div v-if="getBakerPlayer()" class="instruction instruction-baker">
			<InstructionPlayer :player="getBakerPlayer()" />
			<img src="/assets/img/heat.png" alt="">
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.instruction {
		animation: appear 0.5s ease-in-out forwards;
		bottom: 0.25rem;
		position: absolute;
		transform: translate(-50%, -50%);

		img {
			mix-blend-mode: luminosity;
			width: 15vw;
		}

		&-cutter {
			left: 25%;
		}

		&-mixer {
			left: 42.5%;
		}

		&-baker {
			left: 60%;
		}
	}

	@keyframes appear {
		0% {
			opacity: 0;
			transform: translateY(100%);
		}

		100% {
			opacity: 0.9;
			transform: translateY(0);
		}
	}
</style>
