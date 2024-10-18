import { computed, reactive } from "vue"

export const store = reactive({
	isPaused: false,
	isSplashScreen: true,
	players: [
		{
			id: 1,
			name: "Player 1",
			score: 0,
			action: null,
		},
		{
			id: 2,
			name: "Player 2",
			score: 0,
			action: null,
		}
	],
	isGameOver: false,
})
