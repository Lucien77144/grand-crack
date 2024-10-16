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
				class="cooking-station"
				v-for="(station, i) in stations"
				:key="i"
			>
				<img
					:src="station.icon"
					alt=""
				>
				<p v-html="station.name"></p>
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
			border: 1px solid blue;
			display: flex;
			height: 100%;
			justify-content: space-evenly;
			padding: 2rem;
			width: 100%;
		}

		.cooking-station {
			// ...
		}
	}
</style>
