import { Kitchen } from "@/game/kitchen/Kitchen"
import PixiApplication from "@/game/pixi/PixiApplication"
import InputSet from "./InputSet"
import Player from "@/game/player/Player"
import IngredientManager from "./recipe/IngredientManager"
import recipes from "./recipe/recipes"
import { store } from "@/store"
import SoundManager from "@/game/SoundManager"

export class Game {
	static instance
	isPaused = false
	kitchen = null
	soundManager = null
	existingIngredientList = {}
	stationsList = []
	player1 = null
	player2 = null

	constructor(canvas, size) {
		if (Game.instance) {
			return Game.instance
		}
		Game.instance = this
		this.pixiApplication = new PixiApplication()
		this.canvas = canvas
		this.size = size
	}

	async prepareCanvas(pixiApplication) {
		await pixiApplication.init(this.canvas)
		return Promise.resolve(pixiApplication.canvas)
	}

	addExistingIngredient(ingredient) {
		this.existingIngredientList.push(ingredient)
	}

	setup() {
		console.log("Game setup")

		// Initialize InputSet
		InputSet.emulateKeyboard()
		InputSet.emulateGamePad()
		InputSet.initPlayersInputs()

		this.pixiApplication = new PixiApplication()

		this.prepareCanvas(this.pixiApplication).then(() => {
			this.soundManager = new SoundManager()
			// this.soundManager.startXp("key")

			this.player1 = new Player(1)
			this.player1.addInputsListener()

			this.player2 = new Player(2)
			this.player2.addInputsListener()

			this.kitchen = new Kitchen()
			this.kitchen.setup()

			this.ingredientManager = new IngredientManager(recipes)
			this.ingredientManager.init()
		})
	}

	update(dt, t) {
		if (store.isGameOver) return

		InputSet.update()

		if (this.player1) {
			this.player1.update(dt, t)
		}

		if (this.player2) {
			this.player2.update(dt, t)
		}

		if (this.ingredientManager) {
			this.ingredientManager.update(dt)
		}
	}

	reset() {
		this.player1.reset()
		this.player2.reset()

		// TODO!! - Reset the kitchen, cooking stations, composer
	}

	resize() {
		console.log(this.size)
	}

	destroy() {
		console.log("Game destroy")
	}
}
