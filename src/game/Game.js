import PixiApplication from "./pixi/PixiApplication";
import {watch} from "vue"
import PixiSprite from "./pixi/PixiSprite";

export class Game {
	isPaused = false
	soundManager = null
	existingIngredientList = {}
	stationsList = []

	constructor(canvasWrapper){
		this.canvasWrapper = canvasWrapper;
	}

	async initApplication(world){
		await world.init(this.canvasWrapper)
		return Promise.resolve(world)
	}

	addCookingStation(cookingStation){
		this.stationsList.push(cookingStation)
	}

	addExistingIngredient(ingredient){
		this.existingIngredientList.push(ingredient)
	}

	setup() {
		this.pixiApplication = new PixiApplication(this.canvasWrapper)
		this.initApplication(this.pixiApplication).then(async () => {

			// Objects
			this.pixiSprite = new PixiSprite("https://pixijs.com/assets/bunny.png")
			await this.pixiSprite.init().then((sprite) => {
				this.pixiApplication.appendToStage(sprite)
			})

		})
		console.log("Game setup")
	}

	update(dt,t) {
		console.log("Game update")
		if(this.pixiSprite){
			this.pixiSprite.update(t)
        }
	}

	destroy() {
		console.log("Game destroy")
	}
}


