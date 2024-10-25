import { CookingStation } from "./CookingStation"
import { clamp } from "@/utils/maths"

export class Cutter extends CookingStation {
	inCutter = false
	progress = -1
	currentClicks = 0

	constructor({ ...props }) {
		super({ ...props })
		this.addInputCounterIn()
	}

	onPressButtonInteract(e) {
		const player = e.id === 1 ? this.game.player1 : this.game.player2
		const ingredient = player.ingredientHold

		// Vérifie si le joueur et l'ingrédient existent, si l'interaction est possible, et si le cutter est libre
		if (
			player &&
			ingredient &&
			this.checkCanInteractWithIngredient(player, ingredient) &&
			!this.inMixer
		) {
			player.updateSpriteFrame(false) // Met à jour le sprite du joueur
			ingredient.setInCooking(true) // Indique que l'ingrédient est en cours de cuisson
			ingredient.setCanMove(false) // Empêche le mouvement de l'ingrédient
			player.onPlayerInteractCounter(false) // Notifie le joueur qu'il interagit
			this.player = player // Définit le joueur courant
			this.ingredient = ingredient // Définit l'ingrédient courant
			this.inCutter = true // Indique que le joueur est dans le cutter

			this.ingredient.pixiSprite.sprite.x = this.pixiSprite.sprite.x
			this.ingredient.pixiSprite.sprite.y = this.pixiSprite.sprite.y
			this.ingredient.pixiSprite.sprite.rotation = 0
		}
	}

	// Fonction appelée lors de l'appui sur le bouton pour couper l'ingrédient
	onPressButtonCut(e) {
		if (this.inCutter) {
			if (!this.ingredient?.pixiSprite?.sprite.gotoAndStop) {
				this.onInteractionEnd()
			} else {
				this.progress += 1
				// Limite le progrès à l'intervalle valide des images du sprite
				this.progress = clamp(
					this.progress,
					0,
					this.ingredient.pixiSprite.sprite.totalFrames - 1
				)
				this.ingredient.pixiSprite.sprite.gotoAndStop(this.progress)
				const rand = Math.floor(Math.random() * 3)
				this.game.soundManager.playSingleSound(`cutting`, 0.5)

				// Vérifie si la découpe est terminée
				if (
					this.progress ===
					this.ingredient.pixiSprite.sprite.totalFrames - 1
				) {
					this.onInteractionEnd()
				}
			}
		}
	}

	onInteractionEnd() {
		window.requestAnimationFrame(() =>{
			this.ingredient.animOut()
			this.player.onPlayerInteractCounter(true) // Indique que le joueur peut interagir à nouveau
			this.ingredient.onInteractionCounterEnd("cutter") // Indique que l'interaction avec l'ingrédient est terminée
			this.game.soundManager.playSingleSound(`cutting`, 0.5)
			this.inCutter = false
			this.progress = 0
			this.player = null
			this.ingredient = null
		})
	}

	// Ajoute des événements d'entrée pour interagir avec le cutter
	addInputCounterIn() {
		const inputSet1 = this.game.player1.inputSet
		inputSet1.addEvent("a", this.onPressButtonInteract, this)
		inputSet1.addEvent("a", this.onPressButtonCut, this)

		const inputSet2 = this.game.player2.inputSet
		inputSet2.addEvent("a", this.onPressButtonInteract, this)
		inputSet2.addEvent("a", this.onPressButtonCut, this)
	}
}
