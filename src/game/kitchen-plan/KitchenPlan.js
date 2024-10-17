import PixiSprite from "@/game/pixi/PixiSprite"
import { Game } from "@/game/Game"
import { Cutter } from "./Cutter"
import { Mixer } from "./Mixer"
import { Baker } from "./Baker"

const KITCHEN_PLAN_BASE_SIZE = 0.7
const CUTTER_BASE_SIZE = 0.23
const MIXER_BASE_SIZE = 0.3
const BAKER_BASE_SIZE = 0.26

export class KitchenPlan {
	constructor() {
		this.game = new Game()
		this.canvas = this.game.canvas
		this.size = this.game.size
	}

	setup() {
		this.game.prepareCanvas(this.game.pixiApplication).then(async () => {
			await this.createKitchenPlan()
			await this.createCutter()
			await this.createMixer()
			await this.createBaker()
		})
	}

	async createKitchenPlan() {
		const size = (this.canvas.offsetWidth) * KITCHEN_PLAN_BASE_SIZE
		const texture = "assets/sprites/kitchen-plan.png"
		const x = this.canvas.offsetWidth / 2
		const y = this.canvas.offsetHeight - (size / 11)

		console.log("KitchenPlan created")

		this.kitchenPlan = new PixiSprite(texture, x, y, size)
		await this.kitchenPlan.init().then((sprite) => {
			this.game.pixiApplication.appendToStage(sprite)
		})
	}

	async createCutter() {
		const size = this.canvas.offsetWidth * CUTTER_BASE_SIZE
		const x = this.canvas.offsetWidth / 3.73
		const y = this.canvas.offsetHeight * 0.9

		this.cutter = new Cutter({
			texture: "assets/sprites/cutter.png",
			x,
			y,
			size,
		})
		this.addCookingStation(this.cutter)
		await this.cutter.initPixiSprite()
	}

	async createMixer() {
		const size = this.canvas.offsetWidth * MIXER_BASE_SIZE
		const x = this.canvas.offsetWidth / 2
		const y = this.canvas.offsetHeight * 0.89

		this.mixer = new Mixer({
			texture: "assets/sprites/mixer.png",
			x,
			y,
			size
		})

		this.addCookingStation(this.mixer)
		await this.mixer.initPixiSprite()
	}

	async createBaker() {
		const size = this.canvas.offsetWidth * BAKER_BASE_SIZE
		const x = this.canvas.offsetWidth / 1.38
		const y = this.canvas.offsetHeight * 0.87

		this.baker = new Baker({
			texture: "assets/sprites/baker.png",
			x,
			y,
			size
		})

		this.addCookingStation(this.baker)
		await this.baker.initPixiSprite()
	}

	addCookingStation(cookingStation) {
		this.game.stationsList.push(cookingStation)
	}

	update() {}
}
