import { CookingStation } from "./CookingStation"

export class Mixer extends CookingStation {
	constructor({ ...props }) {
		super({ ...props })
		this.timeLimit = 5000
	}

	startTimer() {
		// this.sprite.sprite.interactive = true
		// this.sprite.sprite.buttonMode = true
		// this.sprite.sprite.on("pointerdown", () => {
		// 	this.currentClicks++
		// })
	}
}
