import PixiSprite from "@/game/pixi/PixiSprite"
import { Game } from "@/game/Game"
import { Cutter } from "./Cutter"
import { Mixer } from "./Mixer"
import { Baker } from "./Baker"
import TextureLoader from "@/game/TextureLoader"
import { Composer } from "@/game/kitchen/Composer"

const CUTTER_BASE_SIZE = 0.175
const MIXER_BASE_SIZE = 0.175
const BAKER_BASE_SIZE = 0.175

export class Kitchen {
	constructor() {
		this.game = new Game()
		this.canvas = this.game.canvas
		this.size = this.game.size
		this.tl = new TextureLoader()

		this.textureDataKitchen = this.tl.assetArray[ "kitchen" ]
	}

	start() {
		this.composer1.start()
		this.composer2.start()
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
		const size = this.canvas.offsetWidth * 0.00025
		// const size = this.canvas.offsetWidth * 0.001 // Calcule la taille du plan
		const x = this.canvas.offsetWidth / 2
		const y = this.canvas.offsetHeight
		const anchor = [ 0.5, 1 ] // Point d'ancrage au centre en bas
		const zIndex = 1

		this.kitchen = new PixiSprite(
			{ x, y, size, anchor, zIndex },
			this.textureDataKitchen
		)
	}

	// Crée la station de découpe
	createCutter() {
		const size = CUTTER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075)
		const x = this.canvas.offsetWidth / 3.1
		const y = this.canvas.offsetHeight * 0.915

		this.cutter = new Cutter({
			x,
			y,
			size,
			action: "cutter",
		})

		this.addCookingStation(this.cutter)
	}

	// Crée la station de mélange
	createMixer() {
		const size = MIXER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075)
		const x = this.canvas.offsetWidth / 2
		const y = this.canvas.offsetHeight * 0.885

		this.mixer = new Mixer({
			x,
			y,
			size,
			action: "mixer",
		})

		this.addCookingStation(this.mixer)
	}

	// Crée la station de cuisson
	createBaker() {
		const size = BAKER_BASE_SIZE * (this.canvas.offsetWidth * 0.00075)
		const x = this.canvas.offsetWidth / 1.5
		const y = this.canvas.offsetHeight * 0.82

		this.baker = new Baker({
			x,
			y,
			size,
			action: "baker",
		})

		this.addCookingStation(this.baker)
	}

	// Crée les stations de composition pour les joueurs
	createComposer() {
		const width = Math.floor(this.canvas.offsetWidth)
		const height = Math.floor(this.canvas.offsetHeight)
		const factor = innerWidth / 2560
		const size = 0.75

		const player1 = this.game.player1
		this.composer1 = new Composer({
			x: (width * size) * .15,
			y: height * size + (height * size) * .25,
			size: size * factor,
			anchor: [ 0.5, 0.5 ],
			action: "composer",
		})
		this.composer1.assignPlayer(player1)

		const player2 = this.game.player2
		this.composer2 = new Composer({
			x: width * size + (width * size) * .1775,
			y: height * size + (height * size) * .25,
			size: size * factor,
			anchor: [ 0.5, 0.5 ],
			action: "composer",
		})
		this.composer2.assignPlayer(player2)
	}

	update() {}
}
