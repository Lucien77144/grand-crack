import * as PIXI from "pixi.js"
import {ZoomBlurFilter} from "pixi-filters";
import Axis from "axis-api";
import {lerp} from "@/utils/maths";

export default class PixiApplication {
	static instance

	constructor() {
		if (PixiApplication.instance) {
			return PixiApplication.instance
		}
		PixiApplication.instance = this
		console.log("init")
	}

	async init(wrapper, color = "#000") {
		this.app = new PIXI.Application()
		await this.app.init({resizeTo: window,}).then(() => {
			wrapper.appendChild(this.app.canvas)
			this.canvas = this.app.canvas
		})

		await PIXI.Assets.load("/assets/img/office.webp");
		// change background with an image /assets/img/office.webp
		const assets = PIXI.Assets.get("/assets/img/office.webp")
		// get ratio of image
		const ratio = assets.width / assets.height
		const slide = new PIXI.Sprite(assets)
		slide.width = window.innerWidth * ratio
		slide.height = window.innerHeight
		slide.x = window.innerWidth / 2 - slide.width / 2
		this.app.stage.addChild(slide)


		// create custom filter


		const filter = new ZoomBlurFilter({
			strength: 0.01,
			center: {x: window.innerWidth / 2, y: window.innerHeight / 2},
		})

		this.app.stage.filters = [filter]
		let targetStrength = 0

		const buttonA = Axis.buttonManager.getButton("w", 1) // Récupère le bouton en fonction de la touche et de l'ID du joueur.
		buttonA.addEventListener("keydown", () => {
			targetStrength = 0
		})
		const buttonB = Axis.buttonManager.getButton("w", 2) // Récupère le bouton en fonction de la touche et de l'ID du joueur.
		buttonB.addEventListener("keydown", () => {
			targetStrength = 0
		})
		let latestTime = 0
		const update = () => {

			const currentTime = performance.now()
			const delta = currentTime - latestTime
			targetStrength += 0.00001 * delta
			filter.strength = lerp(filter.strength, targetStrength, 0.001 * delta)
			latestTime = currentTime
			requestAnimationFrame(update)
		}
		update()


	}

	appendToStage(elt) {
		this.app.stage.addChild(elt)
	}
}
