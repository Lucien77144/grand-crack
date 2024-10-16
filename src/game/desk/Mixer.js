import { CookingStation } from "./CookingStation"

export class Mixer extends CookingStation {
	constructor() {
		super()
		this.timeLimit = 5000 // TODO - There should be no "time limit"
		this.action = "mix"
	}
}
