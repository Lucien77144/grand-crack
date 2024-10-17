<script setup>
	const stations = [
		{
			name: "cutter",
		},
		{
			name: "mixer",
		},
		{
			name: "baker",
		}
	]
</script>

<template>
	<div class="kitchen-plan">
		<div class="container">
			<div
				v-for="(station, i) in stations"
				:key="i"
				class="cooking-station"
			>
				<p v-html="station.name" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.kitchen-plan {
		bottom: 0;
		height: 8rem;
		left: 0;
		margin: 0 auto;
		position: absolute;
		width: 100%;

		.container {
			display: grid;
			gap: 1rem;
			grid-template-columns: repeat(3, 1fr);
			height: 100%;
			margin: 0 auto;
			width: 70%;
		}

		.cooking-station {
			align-items: center;
			border: 0.05rem solid white;
			border-radius: 1rem;
			color: white;
			display: flex;
			justify-content: center;
			width: 100%;
		}
	}
</style>
