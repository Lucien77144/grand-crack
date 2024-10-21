import PixiSprite from "@/game/pixi/PixiSprite"
import { Game } from "@/game/Game"
import { Cutter } from "./Cutter"
import { Mixer } from "./Mixer"
import { Baker } from "./Baker"
import TextureLoader from "@/game/TextureLoader"
import { Composer } from "@/game/kitchen/Composer"

const KITCHEN_PLAN_BASE_SIZE = 0.23
const CUTTER_BASE_SIZE = 0.23
const COMPOSER_BASE_SIZE = 0.3
const MIXER_BASE_SIZE = 0.23
const BAKER_BASE_SIZE = 0.25

export class Kitchen {
	constructor() {
		this.game = new Game()
		this.canvas = this.game.canvas
		this.size = this.game.size
		this.tl = new TextureLoader()

		this.textureDataKitchen = this.tl.assetArray[ "kitchen" ]
	}

	// Méthode pour configurer la cuisine
	setup() {
		this.createKitchenPlan()
		this.createCutter()
		this.createMixer()
		this.createBaker()
		this.createComposer()
	}

	// Ajoute une station de cuisson à la liste des stations
	addCookingStation(cookingStation) {
		this.game.stationsList.push(cookingStation)
	}

	// Crée le plan de la cuisine
	createKitchenPlan() {
		const size = KITCHEN_PLAN_BASE_SIZE * (this.canvas.offsetWidth * 0.00075) // Calcule la taille du plan
		const x = this.canvas.offsetWidth / 2
		const y = this.canvas.offsetHeight
		const anchor = [ 0.5, 1 ] // Point d'ancrage au centre en bas
		const zIndex = 1

		this.kitchen = new PixiSprite({ x, y, size, anchor, zIndex }, this.textureDataKitchen)
	}

	// Crée la station de découpe
	createCutter() {
		const size = CUTTER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075)
		const x = this.canvas.offsetWidth / 3.8
		const y = this.canvas.offsetHeight * 0.9

		this.cutter = new Cutter({
			x,
			y,
			size,
			action: "cutter"
		})

		this.addCookingStation(this.cutter)
	}

	// Crée la station de mélange
	createMixer() {
		const size = MIXER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075)
		const x = this.canvas.offsetWidth / 2
		const y = this.canvas.offsetHeight * 0.86

		this.mixer = new Mixer({
			x,
			y,
			size,
			action: "mixer"
		})

		this.addCookingStation(this.mixer)
	}

	// Crée la station de cuisson
	createBaker() {
		const size = BAKER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075)
		const x = this.canvas.offsetWidth / 1.38
		const y = this.canvas.offsetHeight * 0.76

		this.baker = new Baker({
			x,
			y,
			size,
			action: "baker"
		})

		this.addCookingStation(this.baker)
	}

	// Crée les stations de composition pour les joueurs
	createComposer() {
		const size = COMPOSER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075)
		const x = 100
		const y = this.canvas.offsetHeight - 100

		const player1 = this.game.player1
		this.composer1 = new Composer({
			x,
			y,
			size,
			action: "composerP1"
		})
		this.composer1.assignPlayer(player1)

		const size2 = COMPOSER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075)
		const x2 = this.canvas.offsetWidth - 80
		const y2 = this.canvas.offsetHeight - 100

		const player2 = this.game.player2
		this.composer2 = new Composer({
			x: x2,
			y: y2,
			size: size2,
			action: "composerP2"
		})
		this.composer2.assignPlayer(player2)
	}

	update() {}
}
