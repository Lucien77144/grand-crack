import { CookingStation } from "./CookingStation" // Importe la classe CookingStation, dont Baker hérite
import { wait } from "@/utils/async" // Importe une fonction utilitaire pour gérer des délais asynchrones

// Classe Baker qui étend CookingStation
export class Baker extends CookingStation {
	inBaker = false // Indique si un joueur est actuellement en train de cuire
	cookingTime = 3500 // Durée de cuisson en millisecondes
	soundPlayed = false // Indique si le son de cuisson a déjà été joué

	constructor({ ...props }) {
		super({ ...props }) // Appelle le constructeur de la classe parente
		this.addInputCounterIn() // Ajoute des événements d'entrée pour interagir avec le four
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
			this.player = player // Stocke le joueur dans l'instance
			this.ingredient = ingredient // Stocke l'ingrédient dans l'instance
			this.inBaker = true // Indique qu'un joueur est en train de cuire

			// Joue le son de cuisson une seule fois
			if(!this.soundPlayed){
				this.soundPlayed = true // Marque le son comme joué
				this.game.soundManager.playSingleSound("bake",1) // Joue le son de cuisson
				console.log("in") // Log pour le débogage
			}

			// Supprime la première image de l'animation de cuisson
			const anim = this.pixiSprite.textureData.sheet.animations.baker // Récupère l'animation de cuisson
			const newAnim = anim.slice(1) // Crée une nouvelle animation en supprimant le premier cadre

			this.pixiSprite.sprite.textures = newAnim // Met à jour les textures du sprite
			this.pixiSprite.sprite.animationSpeed = 0.1 // Définit la vitesse de l'animation
			this.pixiSprite.sprite.play() // Joue l'animation

			await wait(this.cookingTime) // Attend que le temps de cuisson soit écoulé

			// Arrête le sprite de l'ingrédient sur le dernier cadre
			this.ingredient.pixiSprite.sprite.gotoAndStop(
				this.ingredient.pixiSprite.sprite.totalFrames - 1
			)

			// Notifie l'ingrédient et le joueur de la fin de l'interaction
			this.ingredient.animOut()
			this.player.onPlayerInteractCounter(true) // Indique que le joueur peut interagir à nouveau
			this.ingredient.onInteractionCounterEnd() // Indique que l'interaction avec l'ingrédient est terminée

			this.resetBaker() // Réinitialise l'état du four

			// Remet les textures du sprite à leur état par défaut
			this.pixiSprite.sprite.textures = anim
			this.pixiSprite.sprite.gotoAndStop(0) // Remet le sprite sur le premier cadre

			this.success() // Indique que la cuisson a réussi
		}
	}

	// Méthode pour réinitialiser l'état du four
	resetBaker() {
		this.inBaker = false // Réinitialise l'état de cuisson
		this.player = null // Réinitialise le joueur
		this.ingredient = null // Réinitialise l'ingrédient
		this.progress = 0 // Réinitialise le progrès de cuisson (s'il y en avait)
		this.game.soundManager.stopSingleSound("mixing") // Arrête le son de mélange (s'il est joué)
		this.soundPlayed = false // Réinitialise l'indicateur de son joué
	}

	// Méthode pour ajouter des événements d'entrée pour interagir avec le four
	addInputCounterIn() {
		const inputSet1 = this.game.player1.inputSet // Obtient le jeu d'entrées du joueur 1
		inputSet1.addEvent("x", this.onPressButtonInteract, this) // Ajoute un événement pour le bouton 'x'

		const inputSet2 = this.game.player2.inputSet // Obtient le jeu d'entrées du joueur 2
		inputSet2.addEvent("x", this.onPressButtonInteract, this) // Ajoute un événement pour le bouton 'x'
	}
}
