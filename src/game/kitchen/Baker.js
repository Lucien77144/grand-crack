import { CookingStation } from "./CookingStation"

export class Baker extends CookingStation {
	cookingTime = 10000
	overcookTreshold = 5000

	constructor({ ...props }) {
		super({ ...props })
		this.timeLimit = 5000
	}

	// startTimer() {
	// 	this.timer = setTimeout(() => {
	// 		this.fail()
	// 	}, this.cookingTime + this.overcookTreshold)
	// }
}
