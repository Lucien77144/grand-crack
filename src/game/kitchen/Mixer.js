import { CookingStation } from "./CookingStation"
import InputSet from "@/game/InputSet"

export class Mixer extends CookingStation {
	// Propriétés de la classe
	inMixer = false
	checkpoints = [ 0, 0, 0, 0 ] // Points de contrôle pour suivre le progrès
	progress = 0 // Progrès de l'utilisateur dans le mélange
	nbRevolution = 4 // Nombre de tours requis
	lastCheckPoint = 4 // Dernier point de contrôle atteint
	soundPlayed = false
	thresholdIntensity = 0.5 // Intensité minimale pour les joysticks

	constructor({ ...props }) {
		super({ ...props })
		this.addInputCounterIn()
	}

	// Méthode pour gérer les événements du joystick
	joystickEvent(e) {
		if (this.inMixer && this.player && this.ingredient) {
			let xInput = e.position.x
			let yInput = e.position.y

			if (!this.soundPlayed) {
				this.soundPlayed = true
				this.game.soundManager.playSingleSound("mixing", 1) // Joue le son de mélange
			}

			// Vérifie si les intensités d'entrée dépassent le seuil
			const hasMinXIntensity = this.checkThreshold(e.position.x, 0.5)
			const hasMinYIntensity = this.checkThreshold(e.position.y, 0.5)

			const idx = this.progress % 4 // Calcule l'index du checkpoint

			// Vérifie chaque point de contrôle dans l'ordre
			if (this.checkCP1(xInput, yInput) && hasMinYIntensity) {
				if (idx === 0 && this.lastCheckPoint === 4) {
					this.progress++
					this.checkpoints[ idx ]++
					this.pixiSprite.sprite.gotoAndStop(1) // Change l'animation
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

			// Vérifie si tous les checkpoints sont complétés
			if (this.checkpoints.every(elt => elt >= this.nbRevolution)) {
				this.player.onPlayerInteractCounter(true) // Réinitialise le compteur d'interaction du joueur
				this.ingredient.onInteractionCounterEnd("mixer") // Termine l'interaction avec l'ingrédient

				// Met à jour l'animation de l'ingrédient
				this.ingredient.pixiSprite.sprite.gotoAndStop(
					this.ingredient.pixiSprite.sprite.totalFrames - 1
				)
				this.ingredient.animOut()

				this.game.soundManager.stopSingleSound("mixing") // Arrête le son de mélange
				this.soundPlayed = false

				this.resetMixer() // Réinitialise l'état du mixer

				// Réinitialise l'animation par défaut
				this.pixiSprite.sprite.textures = this.ogAnim
				this.pixiSprite.sprite.gotoAndStop(0)

				// this.success() // Appelle la méthode de succès
			}
		}
	}

	// Méthode pour réinitialiser l'état du mixer
	resetMixer() {
		this.inMixer = false
		this.player = null
		this.ingredient = null
		this.progress = 0
		this.lastCheckPoint = 4
		this.checkpoints = [ 0, 0, 0, 0 ] // Réinitialise les checkpoints
	}

	// Méthodes pour vérifier les points de contrôle
	checkCP1(x, y) {
		const xValid = !this.checkThreshold(x, 0.25)
		const yValid = y > this.thresholdIntensity
		return xValid && yValid
	}

	checkCP2(x, y) {
		const xValid = x > this.thresholdIntensity
		const yValid = !this.checkThreshold(y, 0.25)
		return xValid && yValid
	}

	checkCP3(x, y) {
		const xValid = !this.checkThreshold(x, 0.25)
		const yValid = y < -this.thresholdIntensity
		return xValid && yValid
	}

	checkCP4(x, y) {
		const xValid = x < -this.thresholdIntensity
		const yValid = !this.checkThreshold(y, 0.25)
		return xValid && yValid
	}

	// Vérifie si une valeur dépasse un seuil donné
	checkThreshold(value, threshold) {
		return Math.abs(value) > threshold
	}

	// Méthode pour gérer l'interaction avec le joueur et le comptoir
	onPressButtonInteract(e) {
		const player = e.id === 1 ? this.game.player1 : this.game.player2
		const ingredient = player.ingredientHold
		if (player && ingredient && this.checkCanInteractWithIngredient(player, ingredient) && !this.inMixer) {
			ingredient.onInteractionCounterIn() // Commence le compteur d'interaction de l'ingrédient
			player.onPlayerInteractCounter(false) // Démarre le compteur d'interaction du joueur
			player.updateSpriteFrame(false) // Met à jour le sprite du joueur

			this.player = player
			this.ingredient = ingredient
			this.inMixer = true

			// Supprime la première image de l'animation
			this.ogAnim = this.pixiSprite.textureData.sheet.animations.mixer
			const newAnim = this.ogAnim.slice(1) // Crée une nouvelle animation sans la première image

			this.pixiSprite.sprite.textures = newAnim // Applique la nouvelle animation
		}
	}

	// Ajoute les événements d'entrée pour les joueurs
	addInputCounterIn() {
		const inputSet1 = this.game.player1.inputSet
		inputSet1.addEvent("a", this.onPressButtonInteract, this)
		inputSet1.addEventJoystick(this.joystickEvent, this)

		const inputSet2 = this.game.player2.inputSet
		inputSet2.addEvent("a", this.onPressButtonInteract, this)
		inputSet2.addEventJoystick(this.joystickEvent, this)
	}
}
