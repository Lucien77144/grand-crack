import PixiApplication from "./pixi/PixiApplication"
import { shallowRef } from "vue"
import { store } from "@/store"

const OXYGEN_DECAY_RATE = 0.02
import InputSet from "./InputSet";
import Player from "@/game/player/Player";

export class Game {
	static instance
	isPaused = false
	soundManager = null
	existingIngredientList = {}
	stationsList = []

	// TODO! - Put this inside a Player class
	player1Oxygen = 100
	player2Oxygen = 100

	player1OxygenRef = shallowRef(100)
	player2OxygenRef = shallowRef(100)

	constructor(canvasWrapper) {
		if(Game.instance){
			return Game.instance
		}

		Game.instance = this
		this.canvasWrapper = canvasWrapper
	}

	async initApplication(world) {
		await world.init(this.canvasWrapper)
		return Promise.resolve(world)
	}

	addCookingStation(cookingStation) {
		this.stationsList.push(cookingStation)
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

		this.initApplication(this.pixiApplication).then(async () => {
			// Objects
			this.playerA = new Player(1,"https://pixijs.com/assets/bunny.png")
			await this.playerA.initPixiSprite()
			this.playerA.addInputsListener()
		})

		// TODO! - Replace this later with AXIS inputs
		document.addEventListener("click", () => {
			if (this.player1Oxygen >= 100) return
			this.player1Oxygen += 2
		})

		document.addEventListener("contextmenu", (e) => {
			e.preventDefault()
			if (this.player2Oxygen >= 100) return
			this.player2Oxygen += 2
		})
	}

	update(dt, t) {
		if (store.isGameOver) return


		InputSet.update()
		if(this.playerA) {
			this.playerA.update(dt,t)
		}

		// TODO! - Handle this in a Player class later
		if (this.player1Oxygen < 0 || this.player2Oxygen < 0) {
			console.log("Game over")
			store.isGameOver = true
			return
		}

		this.player1Oxygen -= OXYGEN_DECAY_RATE
		this.player2Oxygen -= OXYGEN_DECAY_RATE

		// HACK - Mutate the ref separately and use Math.round to limit the number of computations
		this.player1OxygenRef.value = Math.round(this.player1Oxygen * 10) / 10
		this.player2OxygenRef.value = Math.round(this.player2Oxygen * 10) / 10
	}

	reset() {
		this.player1Oxygen = 100
		this.player2Oxygen = 100
		this.player1OxygenRef.value = 100
		this.player2OxygenRef.value = 100
	}

	destroy() {
		console.log("Game destroy")
	}
}


