import { CookingStation } from "./CookingStation"
import InputSet from "@/game/InputSet"

export class Mixer extends CookingStation {
	inMixer = false
	checkpoints = [ 0, 0, 0, 0 ]
	progress = 0
	nbRevolution = 4
	lastCheckPoint = 4
	soundPlayed = false
	thresholdIntensity = 0.5

	constructor({ ...props }) {
		super({ ...props })
		this.addInputCounterIn()
	}

	joystickEvent(e) {
		if (this.inMixer && this.player && this.ingredient) {
			let xInput = e.position.x
			let yInput = e.position.y

			if (!this.soundPlayed) {
				this.soundPlayed = true
				this.game.soundManager.playSingleSound("mixing", 1)
			}

			const hasMinXIntensity = this.checkThreshold(e.position.x, .5)
			const hasMinYIntensity = this.checkThreshold(e.position.y, .5)

			const idx = this.progress % 4

			//Check First checkpoint done
			if (this.checkCP1(xInput, yInput) && hasMinYIntensity) {
				if (idx === 0 && this.lastCheckPoint === 4) {
					this.progress++
					this.checkpoints[ idx ]++
					this.pixiSprite.sprite.gotoAndStop(1)
				}
				this.lastCheckPoint = 1
			} else if (this.checkCP2(xInput, yInput) && hasMinXIntensity) {
				if (idx === 1 && this.lastCheckPoint === 1) {
					this.progress++
					this.checkpoints[ idx ]++
					this.pixiSprite.sprite.gotoAndStop(2)
				}
				this.lastCheckPoint = 2
			} else if (this.checkCP3(xInput, yInput) && hasMinYIntensity) {
				if (idx === 2 && this.lastCheckPoint === 2) {
					this.progress++
					this.checkpoints[ idx ]++
					this.pixiSprite.sprite.gotoAndStop(3)
				}
				this.lastCheckPoint = 3
			} else if (this.checkCP4(xInput, yInput) && hasMinXIntensity) {
				if (idx === 3 && this.lastCheckPoint === 3) {
					this.progress++
					this.checkpoints[ idx ]++
					this.pixiSprite.sprite.gotoAndStop(4)
				}
				this.lastCheckPoint = 4
			}

			if (this.checkpoints.every(elt => elt >= this.nbRevolution)) {

				this.player.onPlayerInteractCounter(true)
				this.ingredient.onInteractionCounterEnd()

				this.ingredient.pixiSprite.sprite.gotoAndStop(
					this.ingredient.pixiSprite.sprite.totalFrames - 1
				)
				this.ingredient.animOut()

				this.game.soundManager.stopSingleSound("mixing")
				this.soundPlayed = false

				this.resetMixer()

				// Reset to default
				this.pixiSprite.sprite.textures = this.ogAnim
				this.pixiSprite.sprite.gotoAndStop(0)

				this.success()
			}
		}
	}

	resetMixer(){
		this.inMixer = false
		this.player = null
		this.ingredient = null
		this.progress = 0
		this.lastCheckPoint = 4
		this.checkpoints = [ 0, 0, 0, 0 ]
	}

	checkCP1(x, y) {
		const xValid = !this.checkThreshold(x, .25)
		const yValid = y > this.thresholdIntensity
		return xValid && yValid
	}

	checkCP2(x, y) {
		const xValid = x > this.thresholdIntensity
		const yValid = !this.checkThreshold(y, .25)

		return xValid && yValid
	}

	checkCP3(x, y) {
		const xValid = !this.checkThreshold(x, .25)
		const yValid = y < -this.thresholdIntensity

		return xValid && yValid
	}

	checkCP4(x, y) {
		const xValid = x < -this.thresholdIntensity
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
			player.updateSpriteFrame(false)

			this.player = player
			this.ingredient = ingredient
			this.inMixer = true
			console.log("dans le mixer")

			// Remove the first frame
			this.ogAnim = this.pixiSprite.textureData.sheet.animations.mixer
			const newAnim = this.ogAnim.slice(1)

			this.pixiSprite.sprite.textures = newAnim
		}
	}

	addInputCounterIn() {
		const inputSet1 = this.game.player1.inputSet
		inputSet1.addEvent("x", this.onPressButtonInteract, this)
		inputSet1.addEventJoystick(this.joystickEvent, this)


		const inputSet2 = this.game.player2.inputSet
		inputSet2.addEvent("x", this.onPressButtonInteract, this)
		inputSet2.addEventJoystick(this.joystickEvent, this)
	}
}
