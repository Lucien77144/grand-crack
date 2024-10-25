import { computed, reactive } from "vue"

export const store = reactive({
	isGameStarted: false,
	isSplashScreen: true,
	isIntroVideo: false,
	isTutorial1: false,
	isTutorial2: false,
	isTutorial3: false,
	holdedItems: [],
	players: [
		{
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
