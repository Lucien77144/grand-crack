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

	constructor(recipes) {
		this.#game = new Game()
		this.#recipes = recipes
		this.#ingredients = []
		this.#ingredientsToSpawn = {}
		this.#ingredientsSpawned = {}
		this.#player1HasFinishedTheRecipe = false
		this.#player2HasFinishedTheRecipe = false
		this.#lastSpawnTime = {}
	}
	async spawnIngredient() {
		const currentTime = Date.now()
		const ingredientsToSpawn = this.#ingredientsToSpawn
		Object.keys(ingredientsToSpawn).forEach((ingredientName) => {
			if (!this.#lastSpawnTime[ ingredientName ] || currentTime - this.#lastSpawnTime[ ingredientName ] >= 1000) {
				const recipeIngredient = this.#recipes.flatMap(recipe => recipe.ingredients).find(ingredient => ingredient.name === ingredientName)
				if (!recipeIngredient) {
					return null
				}

				const missingQuantity = ingredientsToSpawn[ ingredientName ] - (this.#ingredientsSpawned[ ingredientName ] || 0)
				if (missingQuantity > 0) {
					const x = Math.random() * window.innerWidth

					const ingredient = new Ingredient(this, recipeIngredient.name, recipeIngredient.texture, recipeIngredient.atlasData, recipeIngredient.size, x, recipeIngredient.canMove, recipeIngredient.action, recipeIngredient.isCooked)
					ingredient.initPixiSprite().then(() => {
						this.#ingredients.push(ingredient)
					})
					this.#ingredientsSpawned[ ingredientName ] = (this.#ingredientsSpawned[ ingredientName ] || 0) + 1
					this.#lastSpawnTime[ ingredientName ] = currentTime
				}
			}
		})
	}

	getMissingIngredients() {
		const missingIngredients = []
		this.#recipes.forEach(recipe => {
			recipe.ingredients.forEach(ingredient => {
				const requiredQuantity = ingredient.quantity
				const spawnedQuantity = this.#ingredientsSpawned[ ingredient.name ] || 0
				if (spawnedQuantity < requiredQuantity) {
					missingIngredients.push({
						name: ingredient.name,
						quantity: requiredQuantity - spawnedQuantity
					})
				}
			})
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
		const index = this.#ingredients.indexOf(ingredient)
		if (index > -1) {
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

		// console.log("Ingredients spawned", this.#ingredientsSpawned)
		// console.log("Ingredients to spawn", this.#ingredientsToSpawn)
		console.log("Missing ingredients", this.getMissingIngredients())
		// console.log("ingredients", this.#ingredients)

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
