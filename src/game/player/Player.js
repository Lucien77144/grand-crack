import { Game } from "@/game/Game"
import InputSet from "@/game/InputSet"
import PixiSprite from "@/game/pixi/PixiSprite"
import { clamp } from "@/utils/maths"
import TextureLoader from "@/game/TextureLoader"
import { store } from "@/store"

const CURSOR_BASE_SIZE = 0.4
import recipes from "@/game/recipe/recipes.json"

export default class Player {
	constructor(id) {
		this.id = id
		this.tl = new TextureLoader()
		this.textureData = this.tl.assetArray[ `cursor${ id }` ]
		this.game = new Game()

		// Comportements par défaut du joueur
		this.canMove = true
		this.ingredientHold = null
		this.distIngredient = null
		this.allowGrab = true
		this.oxygen = 100

		// Variables liées à la physique du joueur (accélération et vélocité)
		this.inputSet = new InputSet(id)
		this.acceleration = 0
		this.maxVelocity = 10 * window.innerWidth * 0.00075
		this.maxAcceleration = 0.5 * window.innerWidth * 0.00075
		this.decelerationRate = 0.05
		this.joystickActive = false
		this.xDif = 0
		this.yDif = 0

		this.canvas = this.game.canvas

		this.initPixiSprite() // Initialisation du sprite Pixi.js associé au joueur
		this.setRandomRecipe() // Attribution d'une recette aléatoire au joueur
	}

	setRandomRecipe() {
		// Sélectionne une recette aléatoire pour le joueur
		const randomIndex = Math.floor(Math.random() * recipes.length)
		this.recipe = recipes[ randomIndex ]
		return this.recipe
	}

	initPixiSprite() {
		// Initialisation du sprite Pixi.js avec sa position, taille et animation
		this.pixiSprite = new PixiSprite(
			{
				// TODO: Faire en sorte que la position des joueurs soit définie à des positions de départ fixes
				x: this.id === 1 ? this.canvas.offsetWidth / 2 - this.canvas.offsetWidth * 0.1 : this.canvas.offsetWidth / 2 + this.canvas.offsetWidth * 0.1,
				y: 200,
				size: CURSOR_BASE_SIZE * this.canvas.offsetWidth * 0.0005, // Taille du sprite ajustée selon la largeur de l'écran
				animationName: `cursor${ this.id }`, // Animation liée à l'id du joueur
				anchor: [ 0.5, 0.5 ], // Centre le sprite
				zIndex: 4
			},
			this.textureData // Texture chargée pour le sprite
		)
	}

	joystickEvent(e) {
		if (e.id !== this.id) return
		// Gestion des événements de joystick
		let xInput = e.position.x
		let yInput = e.position.y

		if (this.pixiSprite && this.canMove && xInput !== 0 && yInput !== 0) {
			this.joystickActive = true // Active le joystick
			// Augmente l'accélération tant que le joystick est actif
			this.acceleration = Math.min(this.acceleration + this.maxAcceleration, this.maxVelocity)

			// Calcule les différences en X et Y selon l'accélération et l'input du joystick
			this.xDif = this.acceleration * xInput
			this.yDif = this.acceleration * yInput
		} else {
			this.joystickActive = false // Désactive le joystick si aucun mouvement
			this.xDif = 0
			this.yDif = 0
		}
	}

	update(dt, t) {
		// Mise à jour principale du joueur (appelée à chaque frame)
		// this.addOxygen(-dt * 0.007) // Réduit l'oxygène au fil du temps
		this.updateSpeed() // Met à jour la vitesse et la position du joueur
		this.updateGrab() // Met à jour la position de l'ingrédient tenu

		if (this.oxygen <= 1) {
			// Si l'oxygène atteint 0, le jeu se termine
			store.isGameOver = true
			this.oxygen = 100 // Remise à 100 pour une potentielle réinitialisation
		}
	}

	updateSpeed() {
		// Gestion de la décélération lorsque le joystick n'est plus actif
		if (!this.joystickActive && this.acceleration > 0) {
			this.acceleration = Math.max(this.acceleration - this.decelerationRate, 0) // Réduit l'accélération progressivement
		}

		// Gestion de la vélocité quand le joystick est relâché
		if (this.joystickActive && this.acceleration === 0) {
			this.velocity = 0 // Vélocité à zéro quand le joystick est inactif
		}

		// Ajoute la différence de position calculée au sprite
		this.pixiSprite.addVecPos(this.xDif, -this.yDif)
		//clamp to innerWidth and innerHeight
		this.pixiSprite.sprite.x = clamp(this.pixiSprite.sprite.x, 0, this.canvas.offsetWidth)
		this.pixiSprite.sprite.y = clamp(this.pixiSprite.sprite.y, 0, this.canvas.offsetHeight)
	}

	updateGrab() {
		// Mise à jour de la position de l'ingrédient si un ingrédient est tenu
		if (this.ingredientHold) {
			this.ingredientHold.pixiSprite.sprite.x = this.pixiSprite.sprite.x + this.distIngredient.x
			this.ingredientHold.pixiSprite.sprite.y = this.pixiSprite.sprite.y + this.distIngredient.y
		}
	}

	updateSpriteFrame(isGrab) {
		// Met à jour l'animation du sprite selon si un ingrédient est attrapé ou non
		if (this.pixiSprite) {
			if (isGrab) {
				if (this.pixiSprite.sprite.currentFrame !== 1) {
					this.pixiSprite.sprite.gotoAndStop(1) // Change l'animation en mode 'grab'
				}
			} else {
				if (this.pixiSprite.sprite.currentFrame !== 0) {
					this.pixiSprite.sprite.gotoAndStop(0) // Retourne à l'animation par défaut
				}
			}
		}
	}

	updateAction() {
		// Vérifie et met à jour l'action du joueur
		if (store.players && store.players[ this.id - 1 ]) {
			if (store.players[ this.id - 1 ].action !== this.action) {
				this.action = store.players[ this.id - 1 ].action
				this.updateSpriteFrame() // Met à jour le sprite selon la nouvelle action
			}
		}
	}

	onPlayerInteractCounter(isOut = true) {
		// Gère l'interaction du joueur avec un compteur (par ex., pour déposer des ingrédients)
		this.ingredientHold = null
		this.canMove = isOut
		this.pixiSprite.sprite.visible = isOut // Cache ou montre le sprite selon l'état
		this.allowGrab = isOut // Désactive ou active la capacité d'attraper
	}

	holdIngredient(ingredient) {
		// Attrape un ingrédient si aucun n'est déjà tenu
		if (!this.ingredientHold && this.allowGrab) {
			this.ingredientHold = ingredient
			const distOffset = PixiSprite.updatePositionWithOffset(
				this.pixiSprite.sprite, this.ingredientHold.pixiSprite.sprite
			)
			this.updateSpriteFrame(true) // Passe à l'animation 'grab'
			this.distIngredient = distOffset
			ingredient.setCanMove(false) // Désactive le mouvement de l'ingrédient
			this.allowGrab = false // Empêche d'attraper d'autres ingrédients immédiatement
		}
	}

	releaseIngredient() {
		// Libère l'ingrédient actuellement tenu
		if (this.ingredientHold && !this.allowGrab) {
			this.ingredientHold.setCanMove(true) // Permet à l'ingrédient de bouger de nouveau
			this.ingredientHold = null
			this.distIngredient = null
			this.updateSpriteFrame(false) // Revient à l'animation par défaut
			setTimeout(() => {
				this.allowGrab = true // Permet de reprendre un ingrédient après une seconde
			}, 1000)
		}
	}

	// Ajout des listeners pour gérer les inputs du joueur
	addInputsListener() {
		this.inputSet.addEventJoystick(this.joystickEvent, this) // Associe le joystick aux mouvements
		this.inputSet.addEvent("a", this.releaseIngredient, this) // 'a' pour relâcher un ingrédient
		this.inputSet.addEvent("w", this.gainOxygen, this) // 'w' pour gagner de l'oxygen


		this.inputSet.addEvent("a", () => {
			if (store.isSplashScreen) {
				store.isSplashScreen = false
				this.game.soundManager.startXp("music", .25)
			}

			// TODO!! - le reload() est un hard reload du navigateur, il faut plutôt reset la partie
			if (store.isGameOver) {
				setTimeout(() => {
					window.location.reload()
				}, 1000)
				// store.isGameOver = false
				// console.log(store.isGameOver)
			}
		})

		// HACK - Ces events permettent de debug / tester en local
		// this.inputSet.addEvent("x", this.eventInputX, this)
		// this.inputSet.addEvent("i", this.eventInputI, this)
		// this.inputSet.addEvent("s", this.eventInputS, this)
	}

	eventInputX(e) {
		this.pixiSprite.sprite.x -= 100
	}

	eventInputI(e) {
		this.pixiSprite.sprite.x += 100
	}

	eventInputS(e) {
		this.pixiSprite.sprite.y += 100
	}

	// Gère l'oxygène du joueur
	addOxygen(value) {
		this.oxygen += value
		this.oxygen = clamp(this.oxygen, 0, 100)
	}

	// Exemple d'un autre événement
	gainOxygen() {
		this.addOxygen(5)
	}

	setCanMove(canMove) {
		this.canMove = canMove
	}

	// Permet de réinitialiser le joueur au début du jeu
	reset() {
		this.oxygen = 100
		this.canMove = true
		this.ingredientHold = null
		this.distIngredient = null
		this.allowGrab = true
		this.acceleration = 0
		this.joystickActive = false
		this.pixiSprite.sprite.visible = true
		this.pixiSprite.sprite.x = 500
		this.pixiSprite.sprite.y = 200
	}
}
