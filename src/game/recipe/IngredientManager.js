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

	spawnIngredient() {
		const ingredientNames = Object.keys(this.#ingredientsToSpawn)
		if (ingredientNames.length > 0) {
			const currentTime = Date.now()
			const spawnableIngredients = ingredientNames.filter(name => {
				const recipeIngredient = this.#recipes.flatMap(recipe => recipe.ingredients).find(ingredient => ingredient.name === name)
				if (!recipeIngredient) {
					return false
				}
				const lastSpawnTime = this.#lastSpawnTime[ name ] || 0
				return currentTime - lastSpawnTime >= recipeIngredient.spawnRate
			})

			if (spawnableIngredients.length > 0) {
				const randomIndex = Math.floor(Math.random() * spawnableIngredients.length)
				const ingredientName = spawnableIngredients[ randomIndex ]

				const recipeIngredient = this.#recipes.flatMap(recipe => recipe.ingredients).find(ingredient => ingredient.name === ingredientName)
				if (!recipeIngredient) {
					return null
				}

				const x = Math.random() * window.innerWidth

				const ingredient = new Ingredient(
					this,
					recipeIngredient.name,
					recipeIngredient.size,
					x,
					recipeIngredient.canMove,
					recipeIngredient.action,
					recipeIngredient.isCooked
				)

				ingredient.create()

				this.#ingredientsSpawned[ ingredientName ] = (this.#ingredientsSpawned[ ingredientName ] || 0) + 1
				this.#ingredientsToSpawn[ ingredientName ]--
				this.#lastSpawnTime[ ingredientName ] = currentTime
				if (this.#ingredientsToSpawn[ ingredientName ] !== undefined && this.#ingredientsToSpawn[ ingredientName ] === 0) {
					delete this.#ingredientsToSpawn[ ingredientName ]
				}
				return ingredient
			}
		}
		return null
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
			if (this.#ingredientsSpawned[ ingredientName ] === 0) {
				delete this.#ingredientsSpawned[ ingredientName ]
			}
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

		if (this.#recipes && this.#recipes.length > 0) {
			this.#recipes.forEach((recipe) => {
				if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
					recipe.ingredients.forEach((ingredient) => {
						this.#ingredientsToSpawn[ ingredient.name ] = (this.#ingredientsToSpawn[ ingredient.name ] || 0) + ingredient.quantity * multiplier
					})
				}
			})
		}
	}
}
