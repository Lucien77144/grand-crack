import { shallowRef } from "vue"
import { Kitchen } from "@/game/kitchen/Kitchen"
import PixiApplication from "@/game/pixi/PixiApplication"
import { store } from "@/store"

const OXYGEN_DECAY_RATE = 0.02
import InputSet from "./InputSet"
import Player from "@/game/player/Player"
import IngredientManager from "./recipe/IngredientManager"

const recipes = [
	{
		name: "Recipe 1",
		ingredients: [
			{
				name: "sardine",
				texture: "/assets/sprites/ingredients/sardine.png",
				atlasData: "/assets/sprites/ingredients/sardine.json",
				size: .3,
				spawnRate: 2000,
				spawnZone: "zone1",
				canMove: true,
				action: "action1",
				isCooked: false,
				quantity: 1
			},
			{
				name: "mushroom",
				texture: "/assets/sprites/ingredients/mushroom.png",
				atlasData: "/assets/sprites/ingredients/mushroom.json",
				size: .1,
				spawnRate: 3000,
				spawnZone: "zone2",
				canMove: true,
				action: "action2",
				isCooked: false,
				quantity: 2
			}
		]
	}
	// {
	// 	name: "Recipe 2",
	// 	ingredients: [
	// 		{
	// 			name: "ingredient 3",
	// 			texture: "https://pixijs.com/assets/bunny.png",
	// 			spawnRate: 2000,
	// 			spawnZone: "zone3",
	// 			canMove: true,
	// 			action: "action3",
	// 			isCooked: false,
	// 			quantity: 2
	// 		},
	// 		{
	// 			name: "ingredient 4",
	// 			texture: "https://pixijs.com/assets/bunny.png",
	// 			spawnRate: 1000,
	// 			spawnZone: "zone4",
	// 			canMove: true,
	// 			action: "action4",
	// 			isCooked: false,
	// 			quantity: 1
	// 		}
	// 	]
	// }
]

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

		console.log(this.canvas)
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

		this.prepareCanvas(this.pixiApplication).then(async () => {
			this.playerA = new Player(1, "https://pixijs.com/assets/bunny.png")
			await this.playerA.initPixiSprite()
			this.playerA.addInputsListener()

			this.ingredientManager = new IngredientManager(recipes)
			this.ingredientManager.init()

			this.kitchen = new Kitchen()
			await this.kitchen.setup()
		})
	}

	update(dt, t) {
		if (store.isGameOver) return

		InputSet.update()
		if (this.playerA) {
			this.playerA.update(dt, t)
		}

		if (this.ingredientManager) {
			this.ingredientManager.update(dt)
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
