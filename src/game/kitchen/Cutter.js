import { CookingStation } from "./CookingStation"
import { Rectangle } from "pixi.js"

export class Cutter extends CookingStation {
	currentClicks = 0
	steps = null

	constructor({ ...props }) {
		super({ ...props })
		this.timeLimit = 5000
	}

	startTimer() {
		this.steps = this.sprite.totalFrames

		// TODO! - Replace this by AXIS input
		this.sprite.interactive = true
		this.sprite.buttonMode = true

		this.sprite.on("pointerdown", () => {
			if (this.currentClicks >= this.steps) return

			this.currentClicks++
			this.sprite.gotoAndStop(this.currentClicks)

			if (this.currentClicks === this.steps) this.__success()
		})

		this.timer = setTimeout(() => {
			if (this.currentClicks < this.steps) this.__fail()
		}, this.cookingTime)
	}
}
