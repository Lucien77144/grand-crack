import { CookingStation } from "./CookingStation" // Importe la classe CookingStation pour hériter de ses fonctionnalités
import { clamp } from "@/utils/maths" // Importe la fonction clamp pour limiter une valeur à une plage

// Classe Cutter qui représente une station de découpe
export class Cutter extends CookingStation {
	inCutter = false // Indique si un joueur est actuellement dans la station de découpe
	progress = -1 // Progrès de la découpe, commence à -1 pour faciliter la première mise à jour
	currentClicks = 0 // Compteur de clics, utilisé pour le contrôle d'entrée

	constructor({ ...props }) {
		super({ ...props }) // Appelle le constructeur de la classe parente CookingStation
		this.addInputCounterIn() // Ajoute les événements d'entrée pour interagir avec le cutter
	}

	// Fonction appelée lors de l'interaction avec le cutter
	onPressButtonInteract(e) {
		const player = e.id === 1 ? this.game.player1 : this.game.player2 // Identifie le joueur qui interagit
		const ingredient = player.ingredientHold // Obtient l'ingrédient que le joueur tient

		// Vérifie si le joueur et l'ingrédient existent, si l'interaction est possible, et si le cutter est libre
		if (player && ingredient && this.checkCanInteractWithIngredient(player, ingredient) && !this.inMixer) {
			player.updateSpriteFrame(false) // Met à jour le sprite du joueur
			ingredient.setInCooking(true) // Indique que l'ingrédient est en cours de cuisson
			ingredient.setCanMove(false) // Empêche le mouvement de l'ingrédient
			player.onPlayerInteractCounter(false) // Notifie le joueur qu'il interagit
			this.player = player // Définit le joueur courant
			this.ingredient = ingredient // Définit l'ingrédient courant
			this.inCutter = true // Indique que le joueur est dans le cutter
			console.log("dans le cutter") // Log pour le débogage

			// Aligne l'ingrédient avec la station de découpe
			this.ingredient.pixiSprite.sprite.x = this.pixiSprite.sprite.x
			this.ingredient.pixiSprite.sprite.y = this.pixiSprite.sprite.y
			this.ingredient.pixiSprite.sprite.rotation = 0 // Réinitialise la rotation de l'ingrédient
		}
	}

	// Fonction appelée lors de l'appui sur le bouton pour couper l'ingrédient
	onPressButtonCut(e) {
		if (this.inCutter) { // Vérifie si le joueur est dans le cutter
			this.progress += 1 // Incrémente le progrès de la découpe
			// Limite le progrès à l'intervalle valide des images du sprite
			this.progress = clamp(this.progress, 0, this.ingredient.pixiSprite.sprite.totalFrames - 1)
			this.ingredient.pixiSprite.sprite.gotoAndStop(this.progress) // Met à jour le sprite de l'ingrédient pour afficher l'état actuel de la découpe
			const rand = Math.floor(Math.random() * 3) // Génère un nombre aléatoire pour le son de découpe
			this.game.soundManager.playSingleSound(`cutting${rand}`, 0.5) // Joue un son de découpe

			console.log(this.progress + "/" + this.ingredient.pixiSprite.sprite.totalFrames) // Log pour le débogage

			// Vérifie si la découpe est terminée
			if (this.progress === this.ingredient.pixiSprite.sprite.totalFrames - 1) {
				console.log("leaving the station") // Log pour le débogage

				this.ingredient.animOut() // Joue l'animation de sortie de l'ingrédient
				this.player.onPlayerInteractCounter(true) // Notifie le joueur qu'il peut interagir à nouveau
				this.ingredient.onInteractionCounterEnd() // Met à jour l'état d'interaction de l'ingrédient
				this.inCutter = false // Indique que le joueur n'est plus dans le cutter
				this.player = null // Réinitialise le joueur
				this.ingredient = null // Réinitialise l'ingrédient
				this.progress = 0 // Réinitialise le progrès
			}
		}
	}

	// Ajoute des événements d'entrée pour interagir avec le cutter
	addInputCounterIn() {
		const inputSet1 = this.game.player1.inputSet // Obtient le jeu d'entrées du joueur 1
		inputSet1.addEvent("x", this.onPressButtonInteract, this) // Ajoute un événement pour entrer dans le cutter
		inputSet1.addEvent("x", this.onPressButtonCut, this) // Ajoute un événement pour couper l'ingrédient

		const inputSet2 = this.game.player2.inputSet // Obtient le jeu d'entrées du joueur 2
		inputSet2.addEvent("x", this.onPressButtonInteract, this) // Ajoute un événement pour entrer dans le cutter
		inputSet2.addEvent("x", this.onPressButtonCut, this) // Ajoute un événement pour couper l'ingrédient
	}
}
