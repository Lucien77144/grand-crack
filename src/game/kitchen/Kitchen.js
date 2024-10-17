import PixiSprite from "@/game/pixi/PixiSprite"
import { Game } from "@/game/Game"
import { Cutter } from "./Cutter"
import { Mixer } from "./Mixer"
import { Baker } from "./Baker"

const KITCHEN_PLAN_BASE_SIZE = 0.23
const CUTTER_BASE_SIZE = 0.23
const MIXER_BASE_SIZE = 0.23
const BAKER_BASE_SIZE = 0.23

export class Kitchen {
	constructor() {
		this.game = new Game()
		this.canvas = this.game.canvas
		this.size = this.game.size
	}

	async setup() {
		this.createKitchenPlan()
		await this.createCutter()
		await this.createMixer()
		await this.createBaker()
	}

	addCookingStation(cookingStation) {
		this.game.stationsList.push(cookingStation)
	}

	async createKitchenPlan() {
		const size = KITCHEN_PLAN_BASE_SIZE * (this.canvas.offsetWidth * 0.00075)
		const src = "assets/sprites/kitchen.png"
		const x = this.canvas.offsetWidth / 2
		const y = this.canvas.offsetHeight
		const anchor = [ 0.5, 1 ]

		this.kitchen = new PixiSprite({ src, x, y, size, anchor })
		await this.kitchen.init().then((sprite) => {
			this.game.pixiApplication.appendToStage(sprite)
		})
	}

	async createCutter() {
		const size = CUTTER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075)
		const x = this.canvas.offsetWidth / 6.8
		const y = this.canvas.offsetHeight * 0.79

		// TODO! - The cutter has no spritesheet. But we need to place the ingredient sprite shit on it
		this.cutter = new Cutter({
			spritesheet: "assets/sprites/cutter/cutter.png",
			atlasData: "assets/sprites/cutter/cutter.json",
			x,
			y,
			size,
			action: "cutter"
		})

		this.addCookingStation(this.cutter)
	}

	async createMixer() {
		const size = MIXER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075)
		const x = this.canvas.offsetWidth / 2.9
		const y = this.canvas.offsetHeight * 0.76

		this.mixer = new Mixer({
			spritesheet: "assets/sprites/mixer/mixer.png",
			atlasData: "assets/sprites/mixer/mixer.json",
			x,
			y,
			size,
			action: "mixer"
		})

		await this.mixer.initPixiSprite()
		this.addCookingStation(this.mixer)
	}

	async createBaker() {
		const size = BAKER_BASE_SIZE * (this.canvas.offsetWidth * 0.00076)
		const x = this.canvas.offsetWidth / 1.7
		const y = this.canvas.offsetHeight * 0.72

		this.baker = new Baker({
			spritesheet: "assets/sprites/baker/baker.png",
			atlasData: "assets/sprites/baker/baker.json",
			x,
			y,
			size,
			action: "baker"
		})

		await this.baker.initPixiSprite()
		this.addCookingStation(this.baker)
	}

	update() {}
}
