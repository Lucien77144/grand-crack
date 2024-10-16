import PixiApplication from "./pixi/PixiApplication"
import PixiSprite from "./pixi/PixiSprite"
import InputSet from "./InputSet";
import Player from "@/game/player/Player";

export class Game {
	static instance
	isPaused = false
	soundManager = null
	existingIngredientList = {}
	stationsList = []

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
		console.log("Game setup")
	}

	update(dt, t) {
		// console.log("Game update")
		InputSet.update()
		if (this.pixiSprite) {
			this.pixiSprite.update(t)
		}
		if(this.playerA) {
			this.playerA.update(dt,t)
		}
	}

	destroy() {
		console.log("Game destroy")
	}
}


