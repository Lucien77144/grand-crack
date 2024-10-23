import { Kitchen } from "@/game/kitchen/Kitchen"
import PixiApplication from "@/game/pixi/PixiApplication"
import InputSet from "./InputSet"
import Player from "@/game/player/Player"
import IngredientManager from "./recipe/IngredientManager"
import recipes from "./recipe/recipes"
import { store } from "@/store"
import SoundManager from "@/game/SoundManager"

export class Game {
	static instance
	kitchen = null
	soundManager = null
	existingIngredientList = {}
	stationsList = []
	player1 = null
	player2 = null
	recipesDone = 0

	/**
	 * Constructeur de la classe Game.
	 *
	 * @param {HTMLElement} canvas - Le canvas sur lequel Pixi.js va rendre la scène.
	 * @param {Object} size - Dimensions du canvas.
	 */
	constructor(canvas, size) {
		if (Game.instance) {
			return Game.instance
		}
		Game.instance = this
		this.pixiApplication = new PixiApplication()
		this.app = this.pixiApplication.app
		this.canvas = canvas
		this.size = size
	}

	/**
	 * Prépare et initialise le canvas pour l'application Pixi.
	 *
	 * @param {PixiApplication} pixiApplication - L'instance de l'application Pixi.
	 * @returns {Promise} - Une promesse qui résout le canvas après l'initialisation.
	 */
	async prepareCanvas(pixiApplication) {
		await pixiApplication.init(this.canvas)
		return Promise.resolve(pixiApplication.canvas)
	}

	/**
	 * Ajoute un ingrédient à la liste des ingrédients existants dans le jeu.
	 *
	 * @param {Ingredient} ingredient - L'ingrédient à ajouter.
	 */
	addExistingIngredient(ingredient) {
		this.existingIngredientList.push(ingredient)
	}

	/**
	 * Configuration initiale du jeu, initialise les joueurs, la cuisine, et le gestionnaire d'ingrédients.
	 */
	setup() {
		console.log("Game setup")

		InputSet.emulateKeyboard()
		InputSet.emulateGamePad()
		InputSet.initPlayersInputs()

		this.pixiApplication = new PixiApplication()

		this.prepareCanvas(this.pixiApplication).then(() => {
			this.soundManager = new SoundManager()

			this.player1 = new Player(1)
			this.player1.addInputsListener()

			this.player2 = new Player(2)
			this.player2.addInputsListener()

			this.kitchen = new Kitchen()
			this.kitchen.setup()

			this.ingredientManager = new IngredientManager(recipes)
			this.ingredientManager.init()
		})
	}

	/**
	 * Met à jour les composants du jeu (joueurs, ingrédients, etc.) à chaque frame.
	 *
	 * @param {Number} dt - Le temps écoulé depuis la dernière frame.
	 * @param {Number} t - Le temps courant.
	 */
	update(dt, t) {
		if (store.isSplashScreen || store.isGameOver) return
		if (!store.isGameStarted) {
			store.isGameStarted = true
			this.kitchen.start()
		}

		InputSet.update()

		if (this.player1) {
			this.player1.update(dt, t)
		}

		if (this.player2) {
			this.player2.update(dt, t)
		}

		if (this.ingredientManager) {
			this.ingredientManager.update(dt)
		}
	}

	/**
	 * Réinitialise le jeu pour commencer une nouvelle partie.
	 */
	reset() {
		this.player1.reset()
		this.player2.reset()

		// TODO! - Reset le jeu (kitchen, ingrédients, etc.)
	}

	resize() {
		console.log(this.size)
	}

	destroy() {
		console.log("Game destroy")
	}
}
