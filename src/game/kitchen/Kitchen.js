import PixiSprite from "@/game/pixi/PixiSprite"
import { Game } from "@/game/Game"
import { Cutter } from "./Cutter"
import { Mixer } from "./Mixer"
import { Baker } from "./Baker"

const KITCHEN_PLAN_BASE_SIZE = 0.23
const CUTTER_BASE_SIZE = 0.23
const MIXER_BASE_SIZE = 0.3
const BAKER_BASE_SIZE = 0.26

export class Kitchen {
	constructor() {
		this.game = new Game()
		this.canvas = this.game.canvas
		this.size = this.game.size
	}

	setup() {
		this.createKitchenPlan()
		this.createCutter()
		// await this.createMixer()
		// await this.createBaker()
	}

	addCookingStation(cookingStation) {
		this.game.stationsList.push(cookingStation)
	}

	async createKitchenPlan() {
		const size = KITCHEN_PLAN_BASE_SIZE
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
		const size = this.canvas.offsetWidth * CUTTER_BASE_SIZE
		const x = this.canvas.offsetWidth / 6.5
		const y = this.canvas.offsetHeight * 0.8

		this.cutter = new Cutter({
			spritesheet: "assets/sprites/cutter/cutter.png",
			atlasData: "assets/sprites/cutter/cutter.json",
			x,
			y,
			size,
		})
		await this.cutter.initPixiSprite()
		this.cutter.startTimer()
		this.addCookingStation(this.cutter)
	}

	// async createMixer() {
	// 	const size = this.canvas.offsetWidth * MIXER_BASE_SIZE
	// 	const x = this.canvas.offsetWidth / 2
	// 	const y = this.canvas.offsetHeight * 0.89

	// 	this.mixer = new Mixer({
	// 		texture: "assets/sprites/mixer.png",
	// 		x,
	// 		y,
	// 		size
	// 	})

	// 	await this.mixer.initPixiSprite()
	// 	this.mixer.startTimer()
	// 	this.addCookingStation(this.mixer)
	// }

	// async createBaker() {
	// 	const size = this.canvas.offsetWidth * BAKER_BASE_SIZE
	// 	const x = this.canvas.offsetWidth / 1.38
	// 	const y = this.canvas.offsetHeight * 0.87

	// 	this.baker = new Baker({
	// 		texture: "assets/sprites/baker.png",
	// 		x,
	// 		y,
	// 		size
	// 	})

	// 	await this.baker.initPixiSprite()
	// 	this.baker.startTimer()
	// 	this.addCookingStation(this.baker)
	// }

	update() {}
}
