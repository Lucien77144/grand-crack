import { Game } from "@/game/Game"
import PixiSprite from "@/game/pixi/PixiSprite"
import TextureLoader from "@/game/TextureLoader"
import { store } from "@/store"
import { gsap } from "gsap"

export default class Ingredient {
	// Membres privés
	#id // Identifiant unique de l'ingrédient
	#idList // Liste des identifiants uniques de l'ingrédient
	#size // Nom de l'ingrédient.
	#name // Nom de l'ingrédient (lié à sa texture ou animation).
	#canMove // Indique si l'ingrédient peut se déplacer.
	#action // Action associée à l'ingrédient (peut changer en fonction de l'état).
	#isCooked = false // Indique si l'ingrédient est cuit.
	#inCooking = false // Indique si l'ingrédient est en cours de cuisson.
	#onPlate = false // Indique si l'ingrédient est sur une assiette.
	#speed = 0.05 // Vitesse de chute de l'ingrédient sous l'effet de la gravité.
	#nbOfFrames = 0 // Nombre de frames de l'animation.
	#game // Référence au jeu actuel.
	#rotation = Math.random() * 2 - 1 // Rotation aléatoire de l'ingrédient pour une animation plus réaliste.

	/**
	 * Constructeur de la classe Ingredient
	 *
	 * @param {Object} ref - Référence au conteneur qui gère l'ingrédient.
	 * @param {String[]} name - Nom de l'ingrédient (lié à sa texture ou son animation).
	 * @param {Number} size - Taille de l'ingrédient.
	 * @param {Number} x - Position initiale en X de l'ingrédient.
	 * @param {Boolean} canMove - Définit si l'ingrédient peut se déplacer (par défaut true).
	 * @param {string[]} action - Action associée à l'ingrédient.
	 * @param {Boolean} isCooked - Indique si l'ingrédient est déjà cuit (par défaut false).
	 */
	constructor(ref, name, idList, size, x, action, y) {
		this.#game = new Game()
		this.#name = [ ...name ]
		this.#idList = [ ...idList ]
		this.#id = this.#idList[ 0 ]
		this.#size = Array.isArray(size)
			? [ ...size ]
			: Array(size.length).fill(size)
		this.#action = action
		this.#canMove = true

		this.ref = ref
		this.x = x
		this.y = y
		this.tl = new TextureLoader()
		this.textureData = this.tl.assetArray[ this.#name[ 0 ] ]

		this.canvas = this.#game.canvas
	}

	/**
	 * Définit la frame spécifique de l'animation de l'ingrédient.
	 *
	 * @param {Number} frame - La frame à afficher.
	 */
	setAnimatedSpriteFrame(frame) {
		this.pixiSprite.gotoAndStop?.(frame)
	}

	/**
	 * Initialise le sprite de l'ingrédient avec PixiSprite.
	 */
	initPixiSprite() {
		this.pixiSprite = new PixiSprite(
			{
				x: this.x,
				y: this.y,
				size: this.#size[ 0 ] * this.canvas.offsetWidth * 0.00075,
				animationName: this.#name[ 0 ],
				zIndex: 3,
			},
			this.textureData
		)

		this.addInputOnA()
	}

	/**
	 * Crée l'ingrédient en l'ajoutant à sa référence parent.
	 */
	create() {
		try {
			this.ref.addIngredient(this)
			this.initPixiSprite()
		} catch (error) {
			console.error("Error creating ingredient:", error)
		}
	}

	/**
	 * Met à jour la logique de l'ingrédient (ex: gravité).
	 *
	 * @param {Number} dt - Délai entre les mises à jour.
	 */
	update(dt) {
		// this.updateGravity(dt)
	}

	/**
	 * Gère la gravité de l'ingrédient en simulant une chute verticale.
	 *
	 * @param {Number} dt - Délai entre les mises à jour.
	 */
	updateGravity(dt) {
		if (
			this.pixiSprite &&
			this.#canMove &&
			!this.#isCooked &&
			!this.#inCooking
		) {
			this.pixiSprite.sprite.position.y +=
				dt * this.#speed * window.innerWidth * 0.00025
			this.pixiSprite.sprite.rotation +=
				0.001 *
				dt *
				this.#speed *
				this.#rotation *
				window.innerWidth *
				0.00025

			if (this.pixiSprite.sprite.position.y > window.innerHeight) {
				this.destroy()
				this.ref.removeIngredient(this)
			}
		}
	}

	/**
	 * Ajoute un événement d'input sur la touche 'A' lorsque l'ingrédient est tenu par un joueur.
	 */
	addInputOnA() {
		const inputSet1 = this.#game.player1.inputSet
		inputSet1.addEvent("a", this.holdIngredient, this)

		const inputSet2 = this.#game.player2.inputSet
		inputSet2.addEvent("a", this.holdIngredient, this)
	}

	/**
	 * Permet à un joueur de tenir l'ingrédient si les conditions sont remplies.
	 *
	 * @param {Object} e - Événement déclenché par un joueur (ex: touche pressée).
	 */
	holdIngredient(e) {
		const player = e.id === 1 ? this.#game.player1 : this.#game.player2
		if (
			this.#canMove &&
			!this.#inCooking &&
			!this.#onPlate &&
			this.pixiSprite &&
			this.pixiSprite.sprite
		) {
			if (
				player &&
				PixiSprite.checkOverlap(
					player.pixiSprite.sprite,
					this.pixiSprite.sprite
				)
			) {
				this.#game.soundManager.playSingleSound("hold", 0.25)
				player.holdIngredient(this)
				this.pixiSprite.sprite.zIndex = 3
				store.players[ e.id - 1 ].action = this.#action
			} else {
				store.players[ e.id - 1 ].action = null
			}
		}
	}

	/**
	 * Lance une animation de sortie de l'ingrédient d'une machine, en le faisant sortir avec une translation vers le haut.
	 */
	animOut() {
		gsap.to(this.pixiSprite.sprite, {
			y: this.pixiSprite.sprite.y - 100,
			ease: "back.out(4)",
			duration: 1,
		})
	}

	/**
	 * Détruit l'ingrédient et supprime son sprite de l'écran.
	 */
	destroy() {
		this.pixiSprite.sprite.parent.removeChild(this.pixiSprite.sprite)
		// this.pixiSprite.sprite.visible = false
		this.ref.removeIngredient(this)
		this.pixiSprite.sprite.destroy()
		this.pixiSprite = null
	}

	/**
	 * Indique que l'ingrédient est en interaction avec une machine (ex: en cours de cuisson).
	 */
	onInteractionCounterIn() {
		this.pixiSprite.sprite.visible = false
		this.setInCooking(true)
		this.setCanMove(false)
	}

	/**
	 * Indique que l'interaction avec une machine est terminée et remet l'ingrédient en état normal.
	 */
	onInteractionCounterEnd(action) {
		this.pixiSprite.sprite.visible = true
		this.setInCooking(false)
		this.setCanMove(true)
		if (this.#name.length > 1) {
			this.#name.shift()
			this.#size.shift()
			this.#idList.shift()
			this.#id = this.#idList[ 0 ]

			const newTextureData = this.tl.assetArray[ this.#id ]

			if (newTextureData.sheet) {
				this.pixiSprite.sprite.textures =
					newTextureData.sheet?.animations?.[ this.#id ]
			} else {
				this.pixiSprite.sprite.texture = newTextureData.texture
				if (this.#size[ 0 ]) {
					this.pixiSprite.sprite.scale = this.#size[ 0 ]
				}
			}
		}
		//remove action to #action
		this.#action = this.#action.filter((a) => a !== action)
		if (this.#action.length === 0) {
			this.setIsCooked(true)
		}
	}

	// Getters et Setters pour manipuler les membres privés

	getId() {
		return this.#id
	}

	setName(name) {
		this.#name = name
	}

	setInCooking(inCooking) {
		this.#inCooking = inCooking
	}

	getInCooking() {
		return this.#inCooking
	}

	getName() {
		return this.#name[ 0 ]
	}

	setCanMove(canMove) {
		this.#canMove = canMove
	}

	getCanMove() {
		return this.#canMove
	}

	setAction(action) {
		this.#action = action
	}

	getOnPlate() {
		return this.#onPlate
	}

	setOnPlate(onPlate) {
		this.#onPlate = onPlate
	}

	getAction() {
		return this.#action
	}

	setIsCooked(isCooked) {
		this.#isCooked = isCooked
	}

	getIsCooked() {
		return this.#isCooked
	}
}
