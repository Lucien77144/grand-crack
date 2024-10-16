import { CookingStation } from "./CookingStation"

export class Baker extends CookingStation {
	cookingTime = 10000 // TODO - Adjust this value
	overcookTreshold = 5000 // TODO - Adjust this value

	constructor() {
		super()
		this.timeLimit = 5000
		this.action = "bake"
	}
}
