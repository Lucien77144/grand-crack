import { shallowRef } from "vue"
import { KitchenPlan } from "./kitchen-plan/KitchenPlan"
import PixiApplication from "@/game/pixi/PixiApplication"
import { store } from "@/store"

export class Game {
	static instance
	isPaused = false
	kitchenPlan = null
	soundManager = null
	existingIngredientList = {}
	stationsList = []

	// player1OxygenRef = shallowRef(100)
	// player2OxygenRef = shallowRef(100)

	constructor(canvasWrapper) {
		if (Game.instance) {
			return Game.instance
		}
		Game.instance = this
		this.canvasWrapper = canvasWrapper
		this.pixiApplication = new PixiApplication()
	}

	async prepareCanvas(world) {
		await world.init(this.canvasWrapper)
		return Promise.resolve(world)
	}

	addExistingIngredient(ingredient) {
		this.existingIngredientList.push(ingredient)
	}

	setup() {
		console.log("Game setup")

		this.kitchenPlan = new KitchenPlan()
		this.kitchenPlan.setup()
	}

	update(dt, t) {
		if (store.isGameOver) return

		if (this.pixiSprite) this.pixiSprite.update(t)

		// // HACK - Mutate the ref separately and use Math.round to limit the number of computations
		// // TODO - Replace with the proper oxygen var names
		// this.player1OxygenRef.value = Math.round(this.player1Oxygen * 10) / 10
		// this.player2OxygenRef.value = Math.round(this.player2Oxygen * 10) / 10
	}

	reset() {
		// TODO! - Reset the game state
	}

	destroy() {
		console.log("Game destroy")
	}
}


