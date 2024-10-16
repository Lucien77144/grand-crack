import { computed, reactive } from "vue"

export const store = reactive({
	isPaused: false,
	players: [
		{
			id: 1,
			name: "Player 1",
			score: 0,
		},
		{
			id: 2,
			name: "Player 2",
			score: 0,
		}
	],
})
