import { CookingStation } from "./CookingStation"

export class Cutter extends CookingStation {
	currentClicks = 0
	amount = 5

	constructor({ ...props }) {
		super({ ...props })
		this.timeLimit = 5000
		this.action = "cut"
	}

	startTimer() {
		// TODO! - Replace this by AXIS input
		this.sprite.interactive = true
		this.sprite.buttonMode = true

		this.sprite.on("pointerdown", () => {
			if (this.currentClicks >= this.amount) return

			this.currentClicks++
			this.sprite.gotoAndStop(this.currentClicks)

			if (this.currentClicks === this.amount) this.__success()
		})

		this.timer = setTimeout(() => {
			if (this.currentClicks < this.amount) this.__fail()
		}, this.cookingTime)
	}
}
