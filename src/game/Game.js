import { Kitchen } from "@/game/kitchen/Kitchen"
import PixiApplication from "@/game/pixi/PixiApplication"
import InputSet from "./InputSet"
import Player from "@/game/player/Player"
import IngredientManager from "./recipe/IngredientManager"
import recipes from "./recipe/recipes"
import { store } from "@/store"
import SoundManager from "@/game/SoundManager"

/**
 * Classe principale du jeu gérant l'initialisation, la mise à jour et la gestion des joueurs, des ingrédients et de la cuisine.
 */
export class Game {
	static instance // Singleton de l'instance de Game pour éviter la création de plusieurs instances.
	isPaused = false // Indicateur si le jeu est en pause.
	kitchen = null // Référence à la cuisine (Kitchen).
	soundManager = null // Gestionnaire de sons (SoundManager).
	existingIngredientList = {} // Liste des ingrédients existants dans le jeu.
	stationsList = [] // Liste des stations de cuisson disponibles dans le jeu.
	player1 = null // Référence au premier joueur.
	player2 = null // Référence au deuxième joueur.

	/**
	 * Constructeur de la classe Game.
	 *
	 * @param {HTMLElement} canvas - Le canvas sur lequel Pixi.js va rendre la scène.
	 * @param {Object} size - Dimensions du canvas.
	 */
	constructor(canvas, size) {
		// Singleton : retourne l'instance existante si elle a déjà été créée.
		if (Game.instance) {
			return Game.instance
		}
		Game.instance = this
		this.pixiApplication = new PixiApplication() // Initialise une nouvelle application Pixi.
		this.canvas = canvas // Canvas de rendu.
		this.size = size // Dimensions du canvas.
	}

	/**
	 * Prépare et initialise le canvas pour l'application Pixi.
	 *
	 * @param {PixiApplication} pixiApplication - L'instance de l'application Pixi.
	 * @returns {Promise} - Une promesse qui résout le canvas après l'initialisation.
	 */
	async prepareCanvas(pixiApplication) {
		await pixiApplication.init(this.canvas) // Initialise Pixi avec le canvas fourni.
		return Promise.resolve(pixiApplication.canvas) // Retourne le canvas une fois prêt.
	}

	/**
	 * Ajoute un ingrédient à la liste des ingrédients existants dans le jeu.
	 *
	 * @param {Ingredient} ingredient - L'ingrédient à ajouter.
	 */
	addExistingIngredient(ingredient) {
		this.existingIngredientList.push(ingredient) // Ajoute l'ingrédient à la liste.
	}

	/**
	 * Configuration initiale du jeu, initialise les joueurs, la cuisine, et le gestionnaire d'ingrédients.
	 */
	setup() {
		console.log("Game setup")

		// Initialisation des entrées utilisateurs.
		InputSet.emulateKeyboard() // Emule un clavier pour les entrées utilisateur.
		InputSet.emulateGamePad() // Emule un GamePad pour les entrées utilisateur.
		InputSet.initPlayersInputs() // Initialise les entrées des joueurs.

		this.pixiApplication = new PixiApplication() // Initialise une nouvelle instance de PixiApplication.

		// Prépare le canvas et continue l'initialisation du jeu après sa préparation.
		this.prepareCanvas(this.pixiApplication).then(() => {
			this.soundManager = new SoundManager() // Initialise le gestionnaire de sons.

			// Initialisation des joueurs.
			this.player1 = new Player(1)
			this.player1.addInputsListener() // Ajoute des écouteurs d'entrées pour le joueur 1.

			this.player2 = new Player(2)
			this.player2.addInputsListener() // Ajoute des écouteurs d'entrées pour le joueur 2.

			this.kitchen = new Kitchen() // Initialise la cuisine.
			this.kitchen.setup() // Configure la cuisine.

			this.ingredientManager = new IngredientManager(recipes) // Initialise le gestionnaire d'ingrédients avec les recettes.
			this.ingredientManager.init() // Lance l'initialisation des ingrédients.
		})
	}

	/**
	 * Met à jour les composants du jeu (joueurs, ingrédients, etc.) à chaque frame.
	 *
	 * @param {Number} dt - Le temps écoulé depuis la dernière frame.
	 * @param {Number} t - Le temps courant.
	 */
	update(dt, t) {
		// Si l'écran de démarrage ou l'écran de fin de jeu est actif, n'effectue pas de mise à jour.
		if (store.isSplashScreen || store.isGameOver) return

		InputSet.update() // Met à jour les entrées utilisateur.

		// Met à jour les joueurs si ils sont initialisés.
		if (this.player1) {
			this.player1.update(dt, t)
		}

		if (this.player2) {
			this.player2.update(dt, t)
		}

		// Met à jour le gestionnaire d'ingrédients.
		if (this.ingredientManager) {
			this.ingredientManager.update(dt)
		}
	}

	/**
	 * Réinitialise le jeu pour commencer une nouvelle partie.
	 */
	reset() {
		this.player1.reset() // Réinitialise le joueur 1.
		this.player2.reset() // Réinitialise le joueur 2.

		// TODO: Réinitialiser la cuisine, les stations de cuisson, et autres éléments du jeu.
	}

	/**
	 * Gère les changements de taille du canvas.
	 */
	resize() {
		console.log(this.size) // Affiche la taille du canvas (peut être modifiée pour gérer le redimensionnement).
	}

	/**
	 * Détruit le jeu et nettoie les ressources utilisées.
	 */
	destroy() {
		console.log("Game destroy") // Message de débogage pour indiquer que le jeu est en train d'être détruit.
	}
}
