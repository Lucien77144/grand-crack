import { Application } from "pixi.js"

export default class PixiApplication {
	static instance
	constructor() {
		if (PixiApplication.instance) {
			return PixiApplication.instance
		}
		PixiApplication.instance = this
		console.log("init")
	}

	async init(wrapper, color = "#da0000") {
		this.app = new Application()
		await this.app.init({ backgroundAlpha: 0, resizeTo: window }).then(() => {
			wrapper.appendChild(this.app.canvas)
			this.canvas = this.app.canvas
		})
	}

	appendToStage(elt) {
		this.app.stage.addChild(elt)
	}
}
