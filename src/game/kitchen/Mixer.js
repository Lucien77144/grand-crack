import { CookingStation } from "./CookingStation"

export class Mixer extends CookingStation {
	constructor({ ...props }) {
		super({ ...props })
		this.timeLimit = 5000
	}
}
