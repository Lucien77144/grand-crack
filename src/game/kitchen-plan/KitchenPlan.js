import PixiSprite from "@/game/pixi/PixiSprite"
import { Game } from "@/game/Game"
import { Cutter } from "./Cutter"
import { Mixer } from "./Mixer"
import { Baker } from "./Baker"

const KITCHEN_PLAN_BASE_SIZE = 0.7
const CUTTER_BASE_SIZE = 0.2
const MIXER_BASE_SIZE = 0.2
const BAKER_BASE_SIZE = 0.2

export class KitchenPlan {
	constructor() {
		this.game = new Game()
		this.canvasWrapper = this.game.canvasWrapper
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
		const size = (this.canvasWrapper.offsetWidth) * KITCHEN_PLAN_BASE_SIZE
		const texture = "assets/sprites/kitchen-plan.png"
		const x = this.canvasWrapper.offsetWidth / 2
		const y = this.canvasWrapper.offsetHeight - (size / 11)

		this.kitchenPlan = new PixiSprite(texture, x, y, size)
		await this.kitchenPlan.init().then((sprite) => {
			this.game.pixiApplication.appendToStage(sprite)
		})
	}

	async createCutter() {
		const size = this.canvasWrapper.offsetWidth * CUTTER_BASE_SIZE
		const x = this.canvasWrapper.offsetWidth / 2
		const y = this.canvasWrapper.offsetHeight - (size / 5)

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
		const size = this.canvasWrapper.offsetWidth * MIXER_BASE_SIZE
		const x = this.canvasWrapper.offsetWidth / 2
		const y = this.canvasWrapper.offsetHeight - (size / 5)

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
		const size = this.canvasWrapper.offsetWidth * BAKER_BASE_SIZE
		const x = this.canvasWrapper.offsetWidth / 2
		const y = this.canvasWrapper.offsetHeight - (size / 5)

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
