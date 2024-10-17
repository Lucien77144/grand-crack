import { Game } from "../Game.js"
import Ingredient from "./Ingredient.js"

export default class IngredientManager {
	#ingredients
	#ingredientsToSpawn
	#player1HasFinishedTheRecipe
	#player2HasFinishedTheRecipe
	#game
	#recipes
	#ingredientsSpawned
	#lastSpawnTime
	dropZone = 800

	constructor(recipes) {
		this.#game = new Game()
		this.#recipes = recipes
		this.#ingredients = []
		this.#ingredientsToSpawn = {}
		this.#ingredientsSpawned = {}
		this.#player1HasFinishedTheRecipe = false
		this.#player2HasFinishedTheRecipe = false
		this.#lastSpawnTime = 0
	}

	async spawnIngredient() {
		const currentTime = Date.now()

		if (currentTime - this.#lastSpawnTime > 1000) {
			const missingIngredients = this.getMissingIngredients()

			const randomIngredient = missingIngredients[ Math.floor(Math.random() * missingIngredients.length) ]

			if (randomIngredient) {
				const ingredientRecipe = this.#recipes.find((recipe) => {
					return recipe.ingredients.find((ingredient) => {
						return ingredient.name === randomIngredient.name
					})
				}).ingredients.find((ingredient) => {
					return ingredient.name === randomIngredient.name
				})

				const x = window.innerWidth / 2 + Math.random() * this.dropZone - this.dropZone / 2

				const ingredient = new Ingredient(this, randomIngredient.name, ingredientRecipe.size, x, ingredientRecipe.canMove, ingredientRecipe.action, ingredientRecipe.isCooked)

				await ingredient.create()

				this.#ingredients.push(ingredient)

				this.#ingredientsSpawned[ randomIngredient.name ] = this.#ingredientsSpawned[ randomIngredient.name ] || 0

				this.#ingredientsSpawned[ randomIngredient.name ]++

				this.#lastSpawnTime = currentTime
			}
		}
	}

	getMissingIngredients() {
		const missingIngredients = []

		this.#ingredientsToSpawn = this.#ingredientsToSpawn || {}

		Object.keys(this.#ingredientsToSpawn).forEach((ingredientName) => {
			if (this.#ingredientsSpawned[ ingredientName ] === undefined || this.#ingredientsSpawned[ ingredientName ] < this.#ingredientsToSpawn[ ingredientName ]) {
				missingIngredients.push({ name: ingredientName, quantity: this.#ingredientsToSpawn[ ingredientName ] - (this.#ingredientsSpawned[ ingredientName ] || 0) })
			}
		})

		return missingIngredients
	}

	init() {
		this.createIngredients()
	}

	addIngredient(ingredient) {
		this.#ingredients.push(ingredient)
	}

	removeIngredient(ingredient) {
		const id = ingredient.getId()

		const index = this.#ingredients.findIndex((ingredient) => {
			return ingredient.getId() === id
		})

		if (index !== -1) {
			this.#ingredients.splice(index, 1)
		}

		const ingredientName = ingredient.getName()
		if (this.#ingredientsSpawned[ ingredientName ] !== undefined) {
			this.#ingredientsSpawned[ ingredientName ]--
		}
	}

	update(dt) {
		if (Object.keys(this.#ingredientsToSpawn).length > 0) {
			if (!this.#player1HasFinishedTheRecipe || !this.#player2HasFinishedTheRecipe) {
				this.spawnIngredient()
			}
		}

		this.#ingredients.forEach((ingredient) => {
			ingredient.update(dt)
		})
	}

	destroy() {
		this.#ingredientsToSpawn = {}
		this.#player1HasFinishedTheRecipe = false
		this.#player2HasFinishedTheRecipe = false
		this.#ingredientsSpawned = {}
		this.#lastSpawnTime = {}
	}

	getIngredients() {
		return this.#ingredients
	}

	getIngredientsToSpawn() {
		return this.#ingredientsToSpawn
	}

	getPlayer1HasFinishedTheRecipe() {
		return this.#player1HasFinishedTheRecipe
	}

	getPlayer2HasFinishedTheRecipe() {
		return this.#player2HasFinishedTheRecipe
	}

	setIngredients(ingredients) {
		this.#ingredients = ingredients
	}

	getIngredientsSpawned() {
		return this.#ingredientsSpawned
	}

	setIngredientsToSpawn(ingredientsToSpawn) {
		this.#ingredientsToSpawn = ingredientsToSpawn
	}

	setPlayer1HasFinishedTheRecipe(player1HasFinishedTheRecipe) {
		this.#player1HasFinishedTheRecipe = player1HasFinishedTheRecipe
		this.updateIngredientsToSpawn()
	}

	setPlayer2HasFinishedTheRecipe(player2HasFinishedTheRecipe) {
		this.#player2HasFinishedTheRecipe = player2HasFinishedTheRecipe
		this.updateIngredientsToSpawn()
	}

	setIngredientsSpawned(ingredientsSpawned) {
		this.#ingredientsSpawned = ingredientsSpawned
	}

	createIngredients() {
		this.updateIngredientsToSpawn()
	}

	updateIngredientsToSpawn() {
		const multiplier = this.#player1HasFinishedTheRecipe || this.#player2HasFinishedTheRecipe ? 1 : 2

		if (!Array.isArray(this.#recipes)) {
			this.#recipes = [ this.#recipes ]
		}

		this.#ingredientsToSpawn = {}

		if (this.#recipes && this.#recipes.length > 0) {
			this.#recipes.forEach((recipe) => {
				if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
					recipe.ingredients.forEach((ingredient) => {
						const totalQuantity = ingredient.quantity * multiplier
						this.#ingredientsToSpawn[ ingredient.name ] = Math.min(totalQuantity, this.#ingredientsToSpawn[ ingredient.name ] || totalQuantity)
					})
				}
			})
		}
	}
}
