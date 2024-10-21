import { Game } from "../Game.js"
import Ingredient from "./Ingredient.js"

const FREQUENCY = 5000

export default class IngredientManager {
	#ingredients = []
	#ingredientsToSpawn = {}
	#game = new Game()
	#recipes
	#ingredientsSpawned = {}
	#lastSpawnTime = 0
	dropZone = 800

	constructor(recipes) {
		this.#recipes = Array.isArray(recipes) ? recipes : [ recipes ]
	}

	// Sert à faire apparaître un ingrédient aléatoirement en fonction des ingrédients manquants
	//TODO! - Faire une fonction qui sert à faire apparaître un ingrédient aléatoirement et une avec callback qui appelle la première
	async spawnIngredient() {
		const currentTime = Date.now()

		if (currentTime - this.#lastSpawnTime > FREQUENCY) {
			const missingIngredients = this.getMissingIngredients()

			if (missingIngredients.length > 0) {
				const randomIngredient = missingIngredients[ Math.floor(Math.random() * missingIngredients.length) ]
				const { name } = randomIngredient

				const ingredientRecipe = this.#recipes
					.flatMap(recipe => recipe.ingredients)
					.find(ingredient => ingredient.name === name)

				if (ingredientRecipe) {
					const x = window.innerWidth / 2 + Math.random() * this.dropZone - this.dropZone / 2
					const ingredient = new Ingredient(this, name, ingredientRecipe.size, x, ingredientRecipe.canMove, ingredientRecipe.action, ingredientRecipe.isCooked)

					await ingredient.create()

					this.#ingredients.push(ingredient)
					this.#ingredientsSpawned[ name ] = (this.#ingredientsSpawned[ name ] || 0) + 1
					this.#lastSpawnTime = currentTime
				}
			}
		}
	}

	// Sert à récupérer les ingrédients manquants
	getMissingIngredients() {
		return Object.entries(this.#ingredientsToSpawn)
			.filter(([ name, quantity ]) => (this.#ingredientsSpawned[ name ] || 0) < quantity)
			.map(([ name, quantity ]) => ({ name, quantity: quantity - (this.#ingredientsSpawned[ name ] || 0) }))
	}

	// Sert à initialiser les ingrédients
	init() {
		this.createIngredients()
	}

	// Sert à ajouter un ingrédient
	addIngredient(ingredient) {
		this.#ingredients.push(ingredient)
	}

	// Sert à retirer un ingrédient
	removeIngredient(ingredient) {
		const id = ingredient.getId()
		const index = this.#ingredients.findIndex(ing => ing.getId() === id)

		if (index !== -1) {
			this.#ingredients.splice(index, 1)
			const name = ingredient.getName()
			if (this.#ingredientsSpawned[ name ] !== undefined) {
				this.#ingredientsSpawned[ name ]--
			}
		}
	}

	// Sert à mettre à jour les ingrédients
	update(dt) {
		if (Object.keys(this.#ingredientsToSpawn).length > 0) {
			this.spawnIngredient()
		}

		this.#ingredients.forEach(ingredient => ingredient.update(dt))
	}

	destroy() {
		this.#ingredientsToSpawn = {}
		this.#ingredientsSpawned = {}
		this.#lastSpawnTime = 0
	}

	getIngredients() {
		return this.#ingredients
	}

	getIngredientsToSpawn() {
		return this.#ingredientsToSpawn
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

	setIngredientsSpawned(ingredientsSpawned) {
		this.#ingredientsSpawned = ingredientsSpawned
	}

	createIngredients() {
		this.updateIngredientsToSpawn()
	}

	// Sert à mettre à jour les ingrédients à faire apparaître
	updateIngredientsToSpawn() {
		this.#ingredientsToSpawn = this.#recipes.reduce((acc, recipe) => {
			recipe.ingredients.forEach(({ name, quantity }) => {
				const totalQuantity = quantity * 2 - recipe.nbOfPlayerHaveCompleted
				acc[ name ] = Math.min(totalQuantity, acc[ name ] || totalQuantity)
			})
			return acc
		}, {})
	}
}
