import { CookingStation } from "./CookingStation"
import PixiSprite from "@/game/pixi/PixiSprite"
import { store } from "@/store"
import TextureLoader from "@/game/TextureLoader"
import { gsap } from "gsap"

export class Composer extends CookingStation {
	playerAssign = 0 // Stocke le joueur assigné à cette station de cuisson
	targetIngredients = [] // Liste des ingrédients cibles pour la recette
	ingredients = {}
	plate = null

	constructor({ ...props }) {
		super({ ...props })
		this.tl = new TextureLoader()
	}

	// Assigne un joueur à la station de cuisson et définit les ingrédients cibles
	assignPlayer(player) {
		this.playerAssign = player
		this.targetIngredients = player.recipe.ingredients.map(ingredient => ingredient.name)
		this.recipe = player.recipe

		this.addInputCounterIn(player)
	}

	// Gère l'interaction lorsque le bouton est pressé
	onPressButtonInteract(e) {
		const ingredient = this.playerAssign.ingredientHold // Obtient l'ingrédient que le joueur tient
		// Vérifie si le joueur et l'ingrédient existent et si l'interaction est possible
		if (this.playerAssign && ingredient && this.checkCanInteractWithIngredient(this.playerAssign, ingredient)) {
			this.playerAssign.updateSpriteFrame(false) // Met à jour le sprite du joueur pour montrer qu'il interagit
			this.game.soundManager.playSingleSound("hold", 0.25)
			ingredient.setOnPlate(true)
			ingredient.setCanMove(false)
			this.playerAssign.onPlayerInteractCounter(true) // Indique que le joueur interagit

			this.addIngredient(ingredient) // Ajoute l'ingrédient à la liste

			// Vérifie si la recette est terminée
			if (this.checkIsFinished()) {
				this.game.soundManager.playSingleSound("recipeComplete", 1) // Joue le son de complétion de recette
				store.players[ this.playerAssign.id - 1 ].score += this.recipe.score // Ajoute le score de la recette au joueur
				const recipe = this.playerAssign.setRandomRecipe() // Assigne une nouvelle recette aléatoire au joueur
				this.recipe = recipe
				this.removeIngredients()
				this.targetIngredients = recipe.ingredients.map(ingredient => ingredient.name) // Met à jour les ingrédients cibles
				this.addPlate()
			}
		}
	}

	// Ajoute un ingrédient à la liste d'ingrédients
	addIngredient(ingredient) {
		this.ingredients[ ingredient.getName() ] = ingredient
	}

	// Supprime tous les ingrédients de la liste
	removeIngredients() {
		Object.keys(this.ingredients).forEach(ingredient => this.ingredients[ ingredient ].destroy())
		this.ingredients = {}
	}

	// Ajoute une assiette pour afficher les ingrédients
	addPlate() {
		this.textureData = this.tl.assetArray[ this.recipe.name ] // Récupère les données de texture pour l'assiette
		this.plate = new PixiSprite(
			{
				x: this.pixiSprite.sprite.x,
				y: this.pixiSprite.sprite.y,
				size: 0.45,
				anchor: [ 0.5, 0.5 ], // Centre l'assiette
			},
			this.textureData
		)
		this.plate.sprite.zIndex = 4
		const orientation = this.playerAssign.id === 1 ? -1 : 1 // Détermine l'orientation de l'assiette en fonction du joueur

		gsap.to(this.plate.sprite, {
			x: this.plate.sprite.x + 300 * orientation,
			ease: "power2.in",
			duration: 0.5,
			delay: 1.5
		})

		setTimeout(() => {
			this.plate.sprite.destroy()
			this.plate = null
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

			return ingredient && overlapping && isCook && inRecipe && notAlreadyIn
		} else {
			return false
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
