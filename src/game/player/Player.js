import { Game } from "@/game/Game"
import InputSet from "@/game/InputSet"
import PixiSprite from "@/game/pixi/PixiSprite"
import { clamp } from "@/utils/maths"
import TextureLoader from "@/game/TextureLoader"

export default class Player {
	constructor(id) {
		this.id = id
		this.game = new Game()
		this.oxygen = 100
		this.inputSet = new InputSet(id)
		this.canMove = true
		this.ingredientHold = null
		this.distIngredient = null
		this.allowGrab = true
		this.tl = new TextureLoader()
		this.textureData = this.tl.assetArray[ "cursor" ]

		// Variables pour l'accélération et la vélocité
		this.acceleration = 0 // Accélération initiale
		this.maxVelocity = 5 // Vélocité maximale
		this.maxAcceleration = 0.1 // Accélération maximale
		this.decelerationRate = 0.05 // Taux de décélération
		this.joystickActive = false // Indicateur si le joystick est en mouvement
		this.initPixiSprite()
	}

	initPixiSprite() {
		this.pixiSprite = new PixiSprite(
			{
				x: 500,
				y: 200,
				size: 1,
				anchor: [ 0.5, 0.5 ],
				zIndex: 3
			},
			this.textureData
		)
	}

	// Fonction appelée quand il y a un mouvement du joystick
	joystickEvent(e) {
		let xInput = e.position.x
		let yInput = e.position.y

		const normalized = InputSet.normalizeJoystickInput(xInput, yInput)
		xInput = normalized.x
		yInput = normalized.y

		if (this.pixiSprite && this.canMove && xInput !== 0 && yInput !== 0) {
			this.joystickActive = true // On active le joystick
			// Applique l'accélération tant que le joystick est en mouvement
			this.acceleration = Math.min(this.acceleration + this.maxAcceleration, this.maxVelocity)

			const x = this.acceleration * xInput
			const y = this.acceleration * yInput
			this.pixiSprite.addVecPos(x, -y)
		} else {
			this.joystickActive = false // On active le joystick
		}
	}

	// Mise à jour régulière
	update(dt, t) {
		// Gestion de l'oxygène (cela reste inchangé)
		this.addOxygen(-dt * 0.005)
		this.updateSpeed()
		this.updateGrab()
	}

	updateSpeed() {
		// Si le joystick n'est pas actif, on décélère
		if (!this.joystickActive && this.acceleration > 0) {
			this.acceleration = Math.max(this.acceleration - this.decelerationRate, 0)
		}

		// Quand le joystick est relâché (position neutre), on arrête la vélocité
		if (this.joystickActive && this.acceleration === 0) {
			this.velocity = 0
		}

		// On remet l'indicateur à false pour le prochain cycle
		this.joystickActive = false
	}

	updateGrab() {
		// Gère le holding d'ingrédient
		if (this.ingredientHold) {
			this.ingredientHold.pixiSprite.sprite.x = this.pixiSprite.sprite.x + this.distIngredient.x
			this.ingredientHold.pixiSprite.sprite.y = this.pixiSprite.sprite.y + this.distIngredient.y
		}
	}

	onPlayerInteractCounter(isOut = true) {
		this.ingredientHold = null
		this.canMove = isOut
		this.pixiSprite.sprite.visible = isOut
		this.allowGrab = isOut
	}

	holdIngredient(ingredient) {
		if (!this.ingredientHold && this.allowGrab) {
			this.ingredientHold = ingredient
			const distOffset = PixiSprite.updatePositionWithOffset(this.pixiSprite.sprite, this.ingredientHold.pixiSprite.sprite)
			this.distIngredient = distOffset
			ingredient.setCanMove(false)
			this.allowGrab = false
		}
	}

	releaseIngredient() {
		if (this.ingredientHold && !this.allowGrab) {
			this.ingredientHold.setCanMove(true)
			this.ingredientHold = null
			this.distIngredient = null
			setTimeout(() => {
				this.allowGrab = true
			}, 1000)
		}
	}

	// Ajout des listeners d'inputs
	addInputsListener() {
		this.inputSet.addEventJoystick(this.joystickEvent, this)
		this.inputSet.addEvent("a", this.releaseIngredient, this)
		this.inputSet.addEvent("w", this.gainOxygen, this)

		// HACK - Just for debug with keyboard
		this.inputSet.addEvent("x", this.eventInputX, this)
		this.inputSet.addEvent("i", this.eventInputI, this)
		this.inputSet.addEvent("s", this.eventInputS, this)
	}

	eventInputX(e) {
		this.pixiSprite.sprite.x -= 50
	}

	eventInputI(e) {
		this.pixiSprite.sprite.x += 50
	}

	eventInputS(e) {
		this.pixiSprite.sprite.y += 50
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
