import { computed, reactive } from "vue"

export const store = reactive({
	isPaused: false,
	isSplashScreen: true,
	players: [
		{
			// TODO! - Ajouter une propriété "recipe" qui donnera l'index de la recette en cours
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
