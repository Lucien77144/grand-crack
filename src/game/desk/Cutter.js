import { CookingStation } from "./CookingStation"

export class Cutter extends CookingStation {
	interval = 5000
	currentStep = 0
	steps = 5 // TODO - Steps number could be assigned to the Ingredient instead ?

	constructor() {
		super()
		this.timeLimit = 5000
		this.action = "cut"
	}
}
