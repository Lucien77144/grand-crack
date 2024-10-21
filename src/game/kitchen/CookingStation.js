import PixiSprite from "@/game/pixi/PixiSprite" // Importe la classe PixiSprite pour gérer les sprites Pixi
import { Game } from "@/game/Game" // Importe la classe Game, probablement pour gérer le jeu global
import TextureLoader from "@/game/TextureLoader" // Importe la classe TextureLoader pour charger des textures

// Classe CookingStation qui représente une station de cuisson dans le jeu
export class CookingStation {
	ingredient = null // Référence à l'ingrédient actuellement en cours d'utilisation
	player = null // Référence au joueur interagissant avec la station
	atlasData = null // Données d'atlas pour les textures
	action = "" // Action associée à la station (par exemple, cuisiner, mixer)
	game // Référence au jeu en cours

	constructor({ ...props }) {
		// Initialise les propriétés de la station à partir des props
		this.x = props.x // Position x de la station
		this.y = props.y // Position y de la station
		this.action = props.action // Action associée à la station
		this.size = props.size // Taille de la station
		this.game = new Game() // Crée une nouvelle instance du jeu
		this.tl = new TextureLoader() // Crée une nouvelle instance de TextureLoader
		this.textureData = this.tl.assetArray[props.action] // Récupère les données de texture associées à l'action

		this.initPixiSprite() // Initialise le sprite Pixi
	}

	// Initialise le sprite Pixi pour la station
	initPixiSprite() {
		this.pixiSprite = new PixiSprite(
			{
				x: this.x, // Position x du sprite
				y: this.y, // Position y du sprite
				size: this.size, // Taille du sprite
				anchor: [0.5, 0.5], // Centre l'ancre du sprite
				animationName: this.action, // Nom de l'animation du sprite
				zIndex: 2 // Définit l'ordre d'affichage du sprite
			},
			this.textureData // Passe les données de texture au sprite
		)
	}

	// Gère l'interaction lorsque le bouton est pressé
	onPressButtonInteract(e) {
		const player = e.id === 1 ? this.game.player1 : this.game.player2 // Détermine quel joueur interagit
		const ingredient = player.ingredientHold // Obtient l'ingrédient que le joueur tient
		// Vérifie si le joueur et l'ingrédient existent et si l'interaction est possible
		if (player && ingredient && this.checkCanInteractWithIngredient(player, ingredient)) {
			ingredient.onInteractionCounterIn() // Notifie l'ingrédient qu'il est en interaction
			player.onPlayerInteractCounter(false) // Notifie le joueur qu'il interagit
		}
	}

	// Vérifie si un joueur peut interagir avec un ingrédient
	checkCanInteractWithIngredient(player, ingredient) {
		const isEmpty = !this.player && !this.ingredient // Vérifie si la station est vide (sans joueur ni ingrédient)

		if (player.pixiSprite && player.pixiSprite.sprite && this.pixiSprite && this.pixiSprite.sprite) {
			// Vérifie si le joueur et la station se chevauchent
			const overlapping = player && PixiSprite.checkOverlap(
				player.pixiSprite.sprite,
				this.pixiSprite.sprite
			)
			const isNotCook = ingredient.getInCooking() === false
				&& ingredient.getIsCooked() === false // Vérifie que l'ingrédient n'est pas en cours de cuisson et pas cuit

			const correspondingAction = ingredient.getAction() === this.action // Vérifie si l'action de l'ingrédient correspond à celle de la station

			// Retourne vrai si toutes les conditions sont remplies
			return ingredient && isEmpty && overlapping && isNotCook && correspondingAction
		} else {
			return false // Retourne faux si les vérifications échouent
		}
	}

	// Ajoute des événements d'entrée pour interagir avec la station de cuisson
	addInputCounterIn() {
		const inputSet1 = this.game.player1.inputSet // Obtient le jeu d'entrées du joueur 1
		inputSet1.addEvent("x", this.onPressButtonInteract, this) // Ajoute un événement pour le bouton 'x'

		const inputSet2 = this.game.player2.inputSet // Obtient le jeu d'entrées du joueur 2
		inputSet2.addEvent("x", this.onPressButtonInteract, this) // Ajoute un événement pour le bouton 'x'
	}

	// Méthode vide pour ajouter un joueur interagissant (peut être implémentée dans des classes dérivées)
	addInteractingPlayer(player) {}

	// Méthode vide pour supprimer un joueur interagissant (peut être implémentée dans des classes dérivées)
	removeInteractingPlayer(player) {}

	// Méthode pour indiquer que l'interaction a réussi
	success() {
		console.log("Success") // Log pour le débogage
	}

	// Méthode pour indiquer que l'interaction a échoué
	fail() {
		console.log("Fail") // Log pour le débogage
	}
}
