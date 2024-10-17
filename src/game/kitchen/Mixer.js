import { CookingStation } from "./CookingStation"
import InputSet from "@/game/InputSet"

export class Mixer extends CookingStation {
	inMixer = false
	nbCP = [ 0, 0, 0, 0 ]
	progress = -1
	targetProgress = 3

	constructor({ ...props }) {
		super({ ...props })
		this.addInputCounterIn()
	}

	joystickEvent(e) {
		if (this.inMixer && this.player && this.ingredient) {
			let xInput = e.position.x
			let yInput = e.position.y
			const normalized = InputSet.normalizeJoystickInput(xInput, yInput)

			xInput = normalized.x
			yInput = normalized.y

			const hasMinXIntensity = this.checkThreshold(e.position.x, .5)
			const hasMinYIntensity = this.checkThreshold(e.position.y, .5)

			console.log(this.checkCP1(xInput, yInput), hasMinYIntensity)
			//Check First checkpoint done
			if (this.checkCP1(xInput, yInput) && hasMinYIntensity) {
				console.log("out")
				this.player.onPlayerInteractCounter(true)
				this.ingredient.onInteractionCounterEnd()
				this.inMixer = false
				this.player = null
				this.ingredient = null
				this.nbCP = [ 0, 0, 0, 0 ]
			}
		}
	}

	checkCP1(x, y) {
		const xValid = !this.checkThreshold(x, .25)
		const yValid = y > 0.9
		return xValid && yValid
	}

	checkCP2(x, y) {
		const xValid = x > 0.9
		const yValid = !this.checkThreshold(y, .25)

		return xValid && yValid
	}

	checkCP3(x, y) {
		const xValid = !this.checkThreshold(x, .25)
		const yValid = y < -0.9

		return xValid && yValid
	}

	checkCP4(x, y) {
		const xValid = x < -0.9
		const yValid = !this.checkThreshold(y, .25)

		return xValid && yValid
	}

	checkThreshold(value, threshold) {
		return Math.abs(value) > threshold
	}

	onPressButtonInteract(e) {
		const player = e.id === 1 ? this.game.player1 : this.game.player2
		const ingredient = player.ingredientHold
		if (player && ingredient && this.checkCanInteractWithIngredient(player, ingredient) && !this.inMixer) {
			ingredient.onInteractionCounterIn()
			player.onPlayerInteractCounter(false)
			this.player = player
			this.ingredient = ingredient
			this.inMixer = true
			console.log("dans le mixer")
		}
	}

	onPressButtonCut(e) {
		if (this.inMixer) {
			//Cutter
			this.progress += 1
			console.log(this.progress)
			if (this.progress === this.targetProgress) {
				console.log("out")
				this.player.onPlayerInteractCounter(true)
				this.ingredient.onInteractionCounterEnd()
				this.inMixer = false
				this.player = null
				this.ingredient = null
				this.progress = 0


				this.ingredient.pixiSprite.sprite.x = this.pixiSprite.sprite.x
			}
		}
	}

	addInputCounterIn() {
		const inputSet1 = this.game.player1.inputSet
		inputSet1.addEvent("i", this.onPressButtonInteract, this)
		inputSet1.addEvent("i", this.onPressButtonCut, this)
		inputSet1.addEventJoystick(this.joystickEvent, this)


		const inputSet2 = this.game.player2.inputSet
		inputSet2.addEvent("i", this.onPressButtonInteract, this)
		inputSet1.addEventJoystick(this.joystickEvent, this)
	}
}
