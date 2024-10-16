<script setup>
	const stations = [
		{
			name: "cutter",
			icon: "",
		},
		{
			name: "mixer",
			icon: "",
		},
		{
			name: "baker",
			icon: ""
		}
	]
</script>

<template>
	<div class="desk">
		<div class="container">
			<div
				v-for="(station, i) in stations"
				:key="i"
				class="cooking-station"
			>
				<!-- <img
					:src="station.icon"
					alt=""
				> -->
				<p v-html="station.name" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.desk {
		border: 1px solid black;
		bottom: 0;
		height: 300px;
		left: 0;
		position: absolute;
		width: 100%;

		.container {
			display: grid;
			gap: 2rem;
			grid-template-columns: repeat(3, 1fr);
			height: 100%;
			padding: 2rem;
			width: 100%;
		}

		.cooking-station {
			align-items: center;
			border: 1px solid black;
			display: flex;
			justify-content: center;
			width: 100%;
		}
	}
</style>
