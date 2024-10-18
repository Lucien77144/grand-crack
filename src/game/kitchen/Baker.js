import { CookingStation } from "./CookingStation"
import { wait } from "@/utils/async"

export class Baker extends CookingStation {
	inBaker = false
	cookingTime = 10000

	constructor({ ...props }) {
		super({ ...props })
		this.addInputCounterIn()
	}

	async onPressButtonInteract(e) {
		const player = e.id === 1 ? this.game.player1 : this.game.player2
		const ingredient = player.ingredientHold
		if (player && ingredient && this.checkCanInteractWithIngredient(player, ingredient) && !this.inMixer) {
			ingredient.onInteractionCounterIn()
			player.onPlayerInteractCounter(false)
			this.player = player
			this.ingredient = ingredient
			this.inBaker = true

			// Remove the first frame
			const anim = this.pixiSprite.textureData.sheet.animations.baker
			const newAnim = anim.slice(1)

			this.pixiSprite.sprite.textures = newAnim
			this.pixiSprite.sprite.animationSpeed = 0.1
			this.pixiSprite.sprite.play()

			await wait(this.cookingTime)

			this.ingredient.pixiSprite.sprite.gotoAndStop(
				this.ingredient.pixiSprite.sprite.totalFrames - 1
			)

			this.player.onPlayerInteractCounter(true)
			this.ingredient.onInteractionCounterEnd()
			this.inBaker = false
			this.player = null
			this.ingredient = null
			this.progress = 0

			// Reset to default
			this.pixiSprite.sprite.textures = anim
			this.pixiSprite.sprite.gotoAndStop(0)

			this.success()
		}
	}

	addInputCounterIn() {
		const inputSet1 = this.game.player1.inputSet
		inputSet1.addEvent("x", this.onPressButtonInteract, this)

		const inputSet2 = this.game.player2.inputSet
		inputSet2.addEvent("x", this.onPressButtonInteract, this)
	}
}
