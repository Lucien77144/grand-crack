import * as PIXI from "pixi.js"
import {ZoomBlurFilter} from "pixi-filters";

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
		await this.app.init({ resizeTo: window, }).then(() => {
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
		})

		 this.app.stage.filters = [filter ]

		const update = () => {

			filter.strength = (Math.sin(Date.now() * 0.0001) + 0.5) * 0.1
			requestAnimationFrame(update)
		}
		update()


	}

	appendToStage(elt) {
		this.app.stage.addChild(elt)
	}
}
