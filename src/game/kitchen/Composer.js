import { CookingStation } from "./CookingStation" // Importe la classe CookingStation, dont Composer hérite
import PixiSprite from "@/game/pixi/PixiSprite" // Importe la classe PixiSprite pour la gestion des sprites Pixi
import { store } from "@/store" // Importe le store pour la gestion de l'état global (probablement de Redux ou un système similaire)
import TextureLoader from "@/game/TextureLoader" // Importe la classe TextureLoader pour charger des textures
import { gsap } from "gsap" // Importe GSAP pour les animations

// Classe Composer qui étend CookingStation
export class Composer extends CookingStation {
	playerAssign = 0 // Stocke le joueur assigné à cette station de cuisson
	targetIngredients = [] // Liste des ingrédients cibles pour la recette
	ingredients = {} // Objet pour stocker les ingrédients ajoutés
	plate = null // Référence à l'objet "plate" (assiette) pour la présentation des ingrédients

	constructor({ ...props }) {
		super({ ...props }) // Appelle le constructeur de la classe parente
		this.tl = new TextureLoader() // Crée une nouvelle instance de TextureLoader
	}

	// Assigne un joueur à la station de cuisson et définit les ingrédients cibles
	assignPlayer(player) {
		this.playerAssign = player // Assigne le joueur
		// Récupère les ingrédients de la recette du joueur et les stocke comme ingrédients cibles
		this.targetIngredients = player.recipe.ingredients.map(ingredient => ingredient.name)
		this.recipe = player.recipe // Stocke la recette actuelle

		this.addInputCounterIn(player) // Ajoute des événements d'entrée pour le joueur
	}

	// Gère l'interaction lorsque le bouton est pressé
	onPressButtonInteract(e) {
		const ingredient = this.playerAssign.ingredientHold // Obtient l'ingrédient que le joueur tient
		// Vérifie si le joueur et l'ingrédient existent et si l'interaction est possible
		if (this.playerAssign && ingredient && this.checkCanInteractWithIngredient(this.playerAssign, ingredient)) {
			this.playerAssign.updateSpriteFrame(false) // Met à jour le sprite du joueur pour montrer qu'il interagit
			this.game.soundManager.playSingleSound("hold", 0.25) // Joue le son "hold"
			ingredient.setOnPlate(true) // Marque l'ingrédient comme étant sur l'assiette
			ingredient.setCanMove(false) // Empêche l'ingrédient de bouger
			this.playerAssign.onPlayerInteractCounter(true) // Indique que le joueur interagit

			this.addIngredient(ingredient) // Ajoute l'ingrédient à la liste

			// Vérifie si la recette est terminée
			if (this.checkIsFinished()) {
				this.game.soundManager.playSingleSound("recipeComplete", 1) // Joue le son de complétion de recette
				store.players[this.playerAssign.id - 1].score += this.recipe.score // Ajoute le score de la recette au joueur
				const recipe = this.playerAssign.setRandomRecipe() // Assigne une nouvelle recette aléatoire au joueur
				this.recipe = recipe // Met à jour la recette actuelle
				this.removeIngredients() // Supprime les ingrédients de la précédente recette
				this.targetIngredients = recipe.ingredients.map(ingredient => ingredient.name) // Met à jour les ingrédients cibles
				this.addPlate() // Ajoute une assiette pour la nouvelle recette
			}
		}
	}

	// Ajoute un ingrédient à la liste d'ingrédients
	addIngredient(ingredient) {
		this.ingredients[ingredient.getName()] = ingredient // Ajoute l'ingrédient à l'objet ingredients
		console.log(this.ingredients) // Log pour débogage
	}

	// Supprime tous les ingrédients de la liste
	removeIngredients() {
		// Pour chaque ingrédient, détruit l'objet correspondant
		Object.keys(this.ingredients).forEach(ingredient => this.ingredients[ingredient].destroy())
		this.ingredients = {} // Réinitialise l'objet ingredients
	}

	// Ajoute une assiette pour afficher les ingrédients
	addPlate() {
		this.textureData = this.tl.assetArray[this.recipe.name] // Récupère les données de texture pour l'assiette
		// Crée une nouvelle instance de PixiSprite pour représenter l'assiette
		this.plate = new PixiSprite(
			{
				x: this.pixiSprite.sprite.x, // Position x de l'assiette
				y: this.pixiSprite.sprite.y, // Position y de l'assiette
				size: 0.45, // Taille de l'assiette
				anchor: [0.5, 0.5], // Centre l'assiette
			},
			this.textureData // Passe les données de texture à PixiSprite
		)
		this.plate.sprite.zIndex = 4 // Définit l'ordre d'affichage de l'assiette
		const orientation = this.playerAssign.id === 1 ? -1 : 1 // Détermine l'orientation de l'assiette en fonction du joueur

		// Anime l'assiette avec GSAP pour la déplacer
		gsap.to(this.plate.sprite, {
			x: this.plate.sprite.x + 300 * orientation, // Déplace l'assiette à droite ou à gauche
			ease: "power2.in", // Type d'animation
			duration: 0.5, // Durée de l'animation
			delay: 1.5 // Délai avant de commencer l'animation
		})

		// Détruit l'assiette après 5 secondes
		setTimeout(() => {
			this.plate.sprite.destroy() // Détruit l'assiette
			this.plate = null // Réinitialise la référence à l'assiette
		}, 5000)
	}

	// Vérifie si un joueur peut interagir avec un ingrédient
	checkCanInteractWithIngredient(player, ingredient) {
		if (player.pixiSprite && player.pixiSprite.sprite && this.pixiSprite && this.pixiSprite.sprite) {
			// Vérifie si le joueur et l'assiette se chevauchent
			const overlapping = player && PixiSprite.checkOverlap(
				player.pixiSprite.sprite,
				this.pixiSprite.sprite
			)

			const isCook = ingredient.getInCooking() === false
				&& ingredient.getIsCooked() === true && !ingredient.getOnPlate() // Vérifie l'état de cuisson de l'ingrédient

			const inRecipe = this.targetIngredients.includes(ingredient.getName()) // Vérifie si l'ingrédient est dans la recette
			const notAlreadyIn = !this.ingredients.hasOwnProperty(ingredient.getName()) // Vérifie si l'ingrédient n'est pas déjà ajouté

			// Retourne vrai si toutes les conditions sont remplies
			return ingredient && overlapping && isCook && inRecipe && notAlreadyIn
		} else {
			return false // Retourne faux si les vérifications échouent
		}
	}

	// Vérifie si la recette est terminée
	checkIsFinished() {
		return this.targetIngredients.every(ingredient => this.ingredients.hasOwnProperty(ingredient)) // Retourne vrai si tous les ingrédients cibles sont ajoutés
	}

	// Ajoute des événements d'entrée pour interagir avec la station de cuisson
	addInputCounterIn(player) {
		const inputSet = player.inputSet // Obtient le jeu d'entrées du joueur
		inputSet.addEvent("x", this.onPressButtonInteract, this) // Ajoute un événement pour le bouton 'x'
	}
}
