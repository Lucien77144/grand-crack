import { Game } from "../Game.js"
import Ingredient from "./Ingredient.js"
import Axis from "axis-api"
import PixiSprite from "@/game/pixi/PixiSprite"
import TextureLoader from "@/game/TextureLoader"
import signal from "@/utils/signal"

const FREQUENCY = 5000 // Fréquence (en millisecondes) à laquelle les ingrédients peuvent apparaître.

/**
 * Gestionnaire des ingrédients dans le jeu, responsable de la création, du suivi et de la mise à jour des ingrédients.
 */
export default class IngredientManager {
	#ingredients = [] // Liste des ingrédients actuellement actifs dans le jeu.
	#ingredientsToSpawn = {} // Dictionnaire des ingrédients à apparaître, avec leurs quantités.
	#game = new Game() // Référence au jeu.
	#recipes // Liste des recettes disponibles.
	#ingredientsSpawned = {} // Dictionnaire du nombre d'ingrédients apparus.
	#lastSpawnTime = 0 // Timestamp de la dernière fois qu'un ingrédient a été généré.
	dropZone = 800 // Largeur de la zone dans laquelle les ingrédients peuvent apparaître (horizontalement).
	tl = new TextureLoader()

	/**
	 * Constructeur du gestionnaire d'ingrédients.
	 *
	 * @param {Array} recipes - Liste des recettes pour lesquelles les ingrédients seront gérés.
	 */
	constructor(recipes) {
		this.#recipes = Array.isArray(recipes) ? recipes : [ recipes ]

		const factor = innerWidth / 2560

		// create a cube where the ingredient can be hold
		const ingredientsContainer = []
		const fridge = new PixiSprite(
			{
				size: factor * 0.7,
				x: innerWidth * .365,
				y: innerHeight * .67,
			},
			this.tl.assetArray[ "bounding_beuh" ]
		)

		ingredientsContainer.push({
			// sprite: fridge.sprite,
			bounds: fridge.sprite.getBounds(),
			ingredientName: [ "tete_de_beuh", "beuh_grinde" ],
			ingredientSize: [ 0.2, .35 ],
			ingredientAction: [ "mixer", null ],
			ingredientSound: "tomate",
		})

		const tiroir = new PixiSprite(
			{
				size: factor * 0.7,
				x: innerWidth * 0.6325,
				y: innerHeight * 0.67,
			},
			this.tl.assetArray[ "bounding_beuh" ]
		)

		ingredientsContainer.push({
			sprite: tiroir.sprite,
			bounds: tiroir.sprite.getBounds(),
			ingredientName: [ "feuilles_de_coca", "coco" ],
			ingredientSize: [ 0.15 ],
			ingredientAction: [ "mixer", null ],
			ingredientSound: "aubergine",
		})

		const oven = new PixiSprite(
			{
				size: factor * 0.2,
				x: innerWidth / 2 + 300,
				y: innerHeight / 2,
			},
			this.tl.assetArray[ "cutter" ]
		)

		ingredientsContainer.push({
			sprite: oven.sprite,
			bounds: oven.sprite.getBounds(),
			ingredientName: [ "flour" ],
			ingredientSize: 0.2,
			ingredientAction: [ "mixer" ],
			ingredientSound: "courgette",
		})

		ingredientsContainer.forEach((container) => {
			signal.on("releaseIngredient", (ingredient) => {
				//if the player is in the same position as the container destroy
				if (!ingredient?.pixiSprite) return
				if (
					ingredient.pixiSprite.sprite.x >= container.bounds.x &&
					ingredient.pixiSprite.sprite.x <=
						container.bounds.x + container.bounds.width &&
					ingredient.pixiSprite.sprite.y >= container.bounds.y &&
					ingredient.pixiSprite.sprite.y <=
						container.bounds.y + container.bounds.height
				) {
					ingredient.destroy()
				}
			})
		})

		const handleKeydown = (player) => {
			if (player.ingredientHold !== null) return
			const playerPosition = {
				x: player.pixiSprite.sprite.x,
				y: player.pixiSprite.sprite.y,
			}
			ingredientsContainer.forEach((container) => {
				if (
					playerPosition.x >= container.bounds.x &&
					playerPosition.x <=
						container.bounds.x + container.bounds.width &&
					playerPosition.y >= container.bounds.y &&
					playerPosition.y <=
						container.bounds.y + container.bounds.height
				) {
					const ingredient = new Ingredient(
						this,
						container.ingredientName,
						container.ingredientSize,
						playerPosition.x,
						container.ingredientAction,
						playerPosition.y
					)

					ingredient.create()
					this.#game.soundManager.playSingleSound(
						container.ingredientSound,
						0.5
					)

					this.#ingredients.push(ingredient)

					player.releaseIngredient()

					player.holdIngredient(ingredient)
				}
			})
		}
		const buttonA = Axis.buttonManager.getButton("a", 1)
		buttonA.addEventListener("keydown", () =>
			handleKeydown(this.#game.player1)
		)

		const buttonB = Axis.buttonManager.getButton("a", 2)
		buttonB.addEventListener("keydown", () =>
			handleKeydown(this.#game.player2)
		)
	}

	/**
	 * Fait apparaître un ingrédient aléatoirement, en fonction des ingrédients manquants.
	 *
	 * Les ingrédients manquants sont ceux qui n'ont pas encore atteint leur quantité cible.
	 */

	// TODO!! À optimiser ! Boucles imbriquées, il y a trop d'appels de fonctions
	// TODO! - Faire une fonction qui sert à faire apparaître un ingrédient aléatoirement et une avec callback qui appelle la première

	// Sert à faire apparaître un ingrédient aléatoirement en fonction des ingrédients manquants
	async spawnIngredient() {
		const currentTime = Date.now()

		// Vérifie si le délai depuis le dernier spawn est supérieur à la fréquence définie.
		if (currentTime - this.#lastSpawnTime > FREQUENCY) {
			const missingIngredients = this.getMissingIngredients()

			// Si des ingrédients manquent, on en génère un aléatoirement.
			if (missingIngredients.length > 0) {
				const randomIngredient =
					missingIngredients[
						Math.floor(Math.random() * missingIngredients.length)
					]
				const { name } = randomIngredient

				// Trouve l'ingrédient dans la liste des recettes.
				const ingredientRecipe = this.#recipes
					.flatMap((recipe) => recipe.ingredients)
					.find((ingredient) => ingredient.name === name)

				if (ingredientRecipe) {
					const x =
						window.innerWidth / 2 +
						Math.random() * this.dropZone -
						this.dropZone / 2
					const y = innerHeight / 2
					const ingredient = new Ingredient(
						this,
						name,
						ingredientRecipe.size,
						x,
						ingredientRecipe.canMove,
						ingredientRecipe.action,
						ingredientRecipe.isCooked,
						y
					)

					await ingredient.create() // Crée l'ingrédient et l'ajoute au jeu.

					this.#ingredients.push(ingredient)
					this.#ingredientsSpawned[ name ] =
						(this.#ingredientsSpawned[ name ] || 0) + 1
					this.#lastSpawnTime = currentTime // Met à jour l'heure du dernier spawn.
				}
			}
		}
	}

	/**
	 * Retourne une liste des ingrédients manquants, en fonction de la quantité déjà apparue et celle requise.
	 *
	 * @returns {Array} Liste des ingrédients manquants.
	 */
	getMissingIngredients() {
		return Object.entries(this.#ingredientsToSpawn)
			.filter(
				([ name, quantity ]) =>
					(this.#ingredientsSpawned[ name ] || 0) < quantity
			)
			.map(([ name, quantity ]) => ({
				name,
				quantity: quantity - (this.#ingredientsSpawned[ name ] || 0),
			}))
	}

	/**
	 * Initialise le gestionnaire d'ingrédients en créant les premiers ingrédients à apparaître.
	 */
	init() {
		this.createIngredients()
	}

	/**
	 * Ajoute un ingrédient à la liste active.
	 *
	 * @param {Ingredient} ingredient - L'ingrédient à ajouter.
	 */
	addIngredient(ingredient) {
		this.#ingredients.push(ingredient)
	}

	/**
	 * Retire un ingrédient de la liste active.
	 *
	 * @param {Ingredient} ingredient - L'ingrédient à retirer.
	 */
	removeIngredient(ingredient) {
		const id = ingredient.getId()
		const index = this.#ingredients.findIndex((ing) => ing.getId() === id)

		if (index !== -1) {
			this.#ingredients.splice(index, 1)
			const name = ingredient.getName()
			if (this.#ingredientsSpawned[ name ] !== undefined) {
				this.#ingredientsSpawned[ name ]--
			}
		}
	}

	/**
	 * Met à jour tous les ingrédients, notamment en générant de nouveaux ingrédients si nécessaire.
	 *
	 * @param {Number} dt - Le temps écoulé depuis la dernière mise à jour.
	 */
	update(dt) {
		// Si des ingrédients doivent encore apparaître, en génère un.
		// if (Object.keys(this.#ingredientsToSpawn).length > 0) {
		// 	this.spawnIngredient()
		// }

		// Met à jour chaque ingrédient.
		this.#ingredients.forEach((ingredient) => ingredient?.update(dt))
	}

	/**
	 * Réinitialise le gestionnaire en supprimant tous les ingrédients actifs et en réinitialisant les compteurs.
	 */
	destroy() {
		this.#ingredientsToSpawn = {}
		this.#ingredientsSpawned = {}
		this.#lastSpawnTime = 0
	}

	/**
	 * Retourne la liste actuelle des ingrédients.
	 *
	 * @returns {Array} Liste des ingrédients actifs.
	 */
	getIngredients() {
		return this.#ingredients
	}

	/**
	 * Retourne les ingrédients qui doivent encore apparaître.
	 *
	 * @returns {Object} Dictionnaire des ingrédients à apparaître avec leurs quantités.
	 */
	getIngredientsToSpawn() {
		return this.#ingredientsToSpawn
	}

	/**
	 * Définit les ingrédients actifs.
	 *
	 * @param {Array} ingredients - Liste des ingrédients à activer.
	 */
	setIngredients(ingredients) {
		this.#ingredients = ingredients
	}

	/**
	 * Retourne le dictionnaire des ingrédients qui ont déjà apparu avec leurs quantités respectives.
	 *
	 * @returns {Object} Dictionnaire des ingrédients déjà apparus.
	 */
	getIngredientsSpawned() {
		return this.#ingredientsSpawned
	}

	/**
	 * Définit les ingrédients à apparaître.
	 *
	 * @param {Object} ingredientsToSpawn - Dictionnaire des ingrédients à apparaître.
	 */
	setIngredientsToSpawn(ingredientsToSpawn) {
		this.#ingredientsToSpawn = ingredientsToSpawn
	}

	/**
	 * Définit le dictionnaire des ingrédients déjà apparus.
	 *
	 * @param {Object} ingredientsSpawned - Dictionnaire des ingrédients déjà apparus.
	 */
	setIngredientsSpawned(ingredientsSpawned) {
		this.#ingredientsSpawned = ingredientsSpawned
	}

	/**
	 * Crée les ingrédients nécessaires en fonction des recettes.
	 */
	createIngredients() {
		this.updateIngredientsToSpawn()
	}

	/**
	 * Met à jour le dictionnaire des ingrédients qui doivent encore apparaître en fonction des recettes.
	 */
	updateIngredientsToSpawn() {
		this.#ingredientsToSpawn = this.#recipes.reduce((acc, recipe) => {
			recipe.ingredients.forEach(({ name, quantity }) => {
				const totalQuantity =
					quantity * 2 - recipe.nbOfPlayerHaveCompleted
				acc[ name ] = Math.min(totalQuantity, acc[ name ] || totalQuantity)
			})
			return acc
		}, {})
	}
}
