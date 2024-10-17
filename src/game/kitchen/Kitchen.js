import PixiSprite from "@/game/pixi/PixiSprite"
import { Game } from "@/game/Game"
import { Cutter } from "./Cutter"
import { Mixer } from "./Mixer"
import { Baker } from "./Baker"
import TextureLoader from "@/game/TextureLoader"

const KITCHEN_PLAN_BASE_SIZE = 0.23
const CUTTER_BASE_SIZE = 0.23
const MIXER_BASE_SIZE = 0.23
const BAKER_BASE_SIZE = 0.23

export class Kitchen {
	constructor() {
		this.game = new Game()
		this.canvas = this.game.canvas
		this.size = this.game.size
		this.tl = new TextureLoader()

		this.textureDataKitchen = this.tl.assetArray[ "kitchen" ]
	}

	setup() {
		this.createKitchenPlan()
		this.createCutter()
		this.createMixer()
		this.createBaker()
	}

	addCookingStation(cookingStation) {
		this.game.stationsList.push(cookingStation)
	}

	createKitchenPlan() {
		const size = KITCHEN_PLAN_BASE_SIZE * (this.canvas.offsetWidth * 0.00075)
		const x = this.canvas.offsetWidth / 2
		const y = this.canvas.offsetHeight
		const anchor = [ 0.5, 1 ]
		const zIndex = 1

		this.kitchen = new PixiSprite({ x, y, size, anchor, zIndex }, this.textureDataKitchen)
	}

	createCutter() {
		const size = CUTTER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075)
		const x = this.canvas.offsetWidth / 6.8
		const y = this.canvas.offsetHeight * 0.79

		this.cutter = new Cutter({
			x,
			y,
			size,
			action: "cutter"
		})

		this.addCookingStation(this.cutter)
	}

	createMixer() {
		const size = MIXER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075)
		const x = this.canvas.offsetWidth / 2.9
		const y = this.canvas.offsetHeight * 0.762

		this.mixer = new Mixer({
			x,
			y,
			size,
			action: "mixer"
		})

		this.addCookingStation(this.mixer)
	}

	createBaker() {
		const size = BAKER_BASE_SIZE * (this.canvas.offsetWidth * 0.00076)
		const x = this.canvas.offsetWidth / 1.7
		const y = this.canvas.offsetHeight * 0.72

		this.baker = new Baker({
			x,
			y,
			size,
			action: "baker"
		})

		this.addCookingStation(this.baker)
	}

	update() {}
}
