import PixiSprite from "@/game/pixi/PixiSprite" // Importe la classe PixiSprite pour gérer les sprites
import { Game } from "@/game/Game" // Importe la classe Game pour gérer l'état du jeu
import { Cutter } from "./Cutter" // Importe la classe Cutter pour gérer la station de découpe
import { Mixer } from "./Mixer" // Importe la classe Mixer pour gérer la station de mélange
import { Baker } from "./Baker" // Importe la classe Baker pour gérer la station de cuisson
import TextureLoader from "@/game/TextureLoader" // Importe le chargeur de textures pour charger les images
import { Composer } from "@/game/kitchen/Composer"; // Importe la classe Composer pour gérer la composition des plats

// Définition des tailles de base pour chaque station de cuisine
const KITCHEN_PLAN_BASE_SIZE = 0.23
const CUTTER_BASE_SIZE = 0.23
const COMPOSER_BASE_SIZE = 0.3
const MIXER_BASE_SIZE = 0.23
const BAKER_BASE_SIZE = 0.25

// Classe Kitchen qui gère la configuration de la cuisine et des stations de cuisson
export class Kitchen {
	constructor() {
		this.game = new Game() // Crée une instance du jeu
		this.canvas = this.game.canvas // Récupère le canevas du jeu
		this.size = this.game.size // Récupère la taille du canevas
		this.tl = new TextureLoader() // Crée une instance de TextureLoader

		this.textureDataKitchen = this.tl.assetArray["kitchen"] // Charge les textures pour le plan de cuisine
	}

	// Méthode pour configurer la cuisine
	setup() {
		this.createKitchenPlan() // Crée le plan de la cuisine
		this.createCutter() // Crée la station de découpe
		this.createMixer() // Crée la station de mélange
		this.createBaker() // Crée la station de cuisson
		this.createComposer() // Crée les stations de composition
	}

	// Ajoute une station de cuisson à la liste des stations
	addCookingStation(cookingStation) {
		this.game.stationsList.push(cookingStation)
	}

	// Crée le plan de la cuisine
	createKitchenPlan() {
		const size = KITCHEN_PLAN_BASE_SIZE * (this.canvas.offsetWidth * 0.00075) // Calcule la taille du plan
		const x = this.canvas.offsetWidth / 2 // Position x au centre
		const y = this.canvas.offsetHeight // Position y en bas
		const anchor = [0.5, 1] // Point d'ancrage au centre en bas
		const zIndex = 1 // Z-index pour le plan

		// Crée un sprite pour le plan de cuisine
		this.kitchen = new PixiSprite({ x, y, size, anchor, zIndex }, this.textureDataKitchen)
	}

	// Crée la station de découpe
	createCutter() {
		const size = CUTTER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075) // Calcule la taille du cutter
		const x = this.canvas.offsetWidth / 3.8 // Position x
		const y = this.canvas.offsetHeight * 0.9 // Position y

		// Crée une instance de Cutter avec les propriétés définies
		this.cutter = new Cutter({
			x,
			y,
			size,
			action: "cutter"
		})

		this.addCookingStation(this.cutter) // Ajoute le cutter à la liste des stations
	}

	// Crée la station de mélange
	createMixer() {
		const size = MIXER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075) // Calcule la taille du mixer
		const x = this.canvas.offsetWidth / 2 // Position x
		const y = this.canvas.offsetHeight * 0.86 // Position y

		// Crée une instance de Mixer avec les propriétés définies
		this.mixer = new Mixer({
			x,
			y,
			size,
			action: "mixer"
		})

		this.addCookingStation(this.mixer) // Ajoute le mixer à la liste des stations
	}

	// Crée la station de cuisson
	createBaker() {
		const size = BAKER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075) // Calcule la taille du baker
		const x = this.canvas.offsetWidth / 1.38 // Position x
		const y = this.canvas.offsetHeight * 0.76 // Position y

		// Crée une instance de Baker avec les propriétés définies
		this.baker = new Baker({
			x,
			y,
			size,
			action: "baker"
		})

		this.addCookingStation(this.baker) // Ajoute le baker à la liste des stations
	}

	// Crée les stations de composition pour les joueurs
	createComposer() {
		const size = COMPOSER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075) // Calcule la taille du composer pour le joueur 1
		const x = 100 // Position x pour le joueur 1
		const y = this.canvas.offsetHeight - 100 // Position y pour le joueur 1

		const player1 = this.game.player1 // Récupère le joueur 1
		this.composer1 = new Composer({
			x,
			y,
			size,
			action: "composerP1"
		})
		this.composer1.assignPlayer(player1) // Assigne le joueur 1 au composer

		const size2 = COMPOSER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075) // Calcule la taille du composer pour le joueur 2
		const x2 = this.canvas.offsetWidth - 80 // Position x pour le joueur 2
		const y2 = this.canvas.offsetHeight - 100 // Position y pour le joueur 2

		const player2 = this.game.player2 // Récupère le joueur 2
		this.composer2 = new Composer({
			x: x2,
			y: y2,
			size: size2,
			action: "composerP2"
		})
		this.composer2.assignPlayer(player2) // Assigne le joueur 2 au composer

		console.log(this.composer1 === this.composer2) // Log pour vérifier si les deux composers sont identiques
	}

	// Méthode pour mettre à jour l'état de la cuisine (pour le moment vide)
	update() {}
}
