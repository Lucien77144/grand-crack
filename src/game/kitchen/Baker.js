import { CookingStation } from "./CookingStation"
import { wait } from "@/utils/async"

// Classe Baker qui étend CookingStation
export class Baker extends CookingStation {
	inBaker = false
	cookingTime = 3500
	soundPlayed = false

	constructor({ ...props }) {
		super({ ...props })
		this.addInputCounterIn()
	}

	// Méthode pour gérer l'interaction lorsque le bouton est pressé
	async onPressButtonInteract(e) {
		const player = e.id === 1 ? this.game.player1 : this.game.player2 // Détermine quel joueur interagit
		const ingredient = player.ingredientHold // Obtient l'ingrédient tenu par le joueur

		// Vérifie si le joueur et l'ingrédient existent, s'ils peuvent interagir, et si le mélangeur n'est pas utilisé
		if (player && ingredient && this.checkCanInteractWithIngredient(player, ingredient) && !this.inMixer) {
			player.updateSpriteFrame(false) // Met à jour le sprite du joueur pour montrer qu'il interagit
			ingredient.onInteractionCounterIn() // Notifie l'ingrédient qu'il est en interaction
			player.onPlayerInteractCounter(false) // Notifie le joueur qu'il interagit
			this.player = player
			this.ingredient = ingredient
			this.inBaker = true

			// Joue le son de cuisson une seule fois
			if (!this.soundPlayed) {
				this.soundPlayed = true // Marque le son comme joué
				this.game.soundManager.playSingleSound("bake", 1) // Joue le son de cuisson
			}

			// Supprime la première image de l'animation de cuisson
			const anim = this.pixiSprite.textureData.sheet.animations.baker
			const newAnim = anim.slice(1)

			this.pixiSprite.sprite.textures = newAnim
			this.pixiSprite.sprite.animationSpeed = 0.1
			this.pixiSprite.sprite.play()

			await wait(this.cookingTime)

			// Arrête le sprite de l'ingrédient sur le dernier cadre
			// TODO! - Vérifier si c'est utile
			this.ingredient.pixiSprite.sprite.gotoAndStop(
				this.ingredient.pixiSprite.sprite.totalFrames - 1
			)

			// Notifie l'ingrédient et le joueur de la fin de l'interaction
			this.ingredient.animOut()
			this.player.onPlayerInteractCounter(true) // Indique que le joueur peut interagir à nouveau
			this.ingredient.onInteractionCounterEnd() // Indique que l'interaction avec l'ingrédient est terminée

			this.resetBaker()

			this.pixiSprite.sprite.textures = anim
			this.pixiSprite.sprite.gotoAndStop(0)

			// this.success()
		}
	}

	// Méthode pour réinitialiser l'état du four
	resetBaker() {
		this.inBaker = false
		this.player = null
		this.ingredient = null
		this.progress = 0
		this.game.soundManager.stopSingleSound("mixing")
		this.soundPlayed = false
	}

	// Méthode pour ajouter des événements d'entrée pour interagir avec le four
	addInputCounterIn() {
		const inputSet1 = this.game.player1.inputSet
		inputSet1.addEvent("x", this.onPressButtonInteract, this)

		const inputSet2 = this.game.player2.inputSet
		inputSet2.addEvent("x", this.onPressButtonInteract, this)
	}
}
