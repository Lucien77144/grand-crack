import { shallowRef } from "vue"
import { Kitchen } from "@/game/kitchen/Kitchen"
import PixiApplication from "@/game/pixi/PixiApplication"
import { store } from "@/store"

const OXYGEN_DECAY_RATE = 0.02
import InputSet from "./InputSet"
import Player from "@/game/player/Player"

export class Game {
	static instance
	isPaused = false
	kitchen = null
	soundManager = null
	existingIngredientList = {}
	stationsList = []

	// player1OxygenRef = shallowRef(100)
	// player2OxygenRef = shallowRef(100)

	constructor(canvas, size) {
		if (Game.instance) {
			return Game.instance
		}
		Game.instance = this
		this.pixiApplication = new PixiApplication()
		this.canvas = canvas
		this.size = size
	}

	async prepareCanvas(world) {
		await world.init(this.canvas)
		return Promise.resolve(world)
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

		this.kitchen = new Kitchen()
		this.kitchen.setup()
	}

	update(dt, t) {
		if (store.isGameOver) return


		InputSet.update()
		if (this.playerA) {
			this.playerA.update(dt, t)
		}

		// // HACK - Mutate the ref separately and use Math.round to limit the number of computations
		// // TODO - Replace with the proper oxygen var names
		// this.player1OxygenRef.value = Math.round(this.player1Oxygen * 10) / 10
		// this.player2OxygenRef.value = Math.round(this.player2Oxygen * 10) / 10
	}

	reset() {
		// TODO! - Reset the game state
	}

	resize() {
		console.log(this.size)
	}

	destroy() {
		console.log("Game destroy")
	}
}


