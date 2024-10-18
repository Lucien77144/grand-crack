import { v4 as uuidv4 } from "uuid"
import { Game } from "@/game/Game"
import PixiSprite from "@/game/pixi/PixiSprite"
import TextureLoader from "@/game/TextureLoader"
import Signal from "@/utils/signal"
import { store } from "@/store"


export default class Ingredient {
	#id
	#name
	#canMove
	#action
	#isCooked
	#inCooking = false
	#onPlate = false
	#speed = .05
	#nbOfFrames = 0
	#game
	#rotation = (Math.random() * 2) - 1

	constructor(
		ref,
		name,
		size,
		x,
		canMove = true,
		action,
		isCooked = false
	) {
		this.#game = new Game()
		this.#id = uuidv4()
		this.#name = name
		this.#action = action
		this.#canMove = canMove
		this.#isCooked = isCooked

		this.ref = ref
		this.x = x
		this.size = size
		this.tl = new TextureLoader()
		this.textureData = this.tl.assetArray[ this.#name ]

		this.canvas = this.#game.canvas
	}

	setAnimatedSpriteFrame(frame) {
		this.pixiSprite.gotoAndStop(frame)
	}

	initPixiSprite() {
		this.pixiSprite = new PixiSprite({
			x: this.x,
			y: -this.canvas.offsetWidth * 0.05,
			size: this.size * this.canvas.offsetWidth * 0.00075,
			action: this.#action,
			animationName: this.#name,
			zIndex: 0
		}, this.textureData)

		this.addInputOnA()
	}

	create() {
		try {
			this.ref.addIngredient(this)
			this.initPixiSprite()
		} catch (error) {
			console.error("Error creating ingredient:", error)
		}
	}

	update(dt) {
		this.updateGravity(dt)
	}

	updateGravity(dt) {
		if (this.pixiSprite && this.#canMove && !this.#isCooked && !this.#inCooking) {
			this.pixiSprite.sprite.position.y += dt * this.#speed * window.innerWidth * 0.00025
			this.pixiSprite.sprite.rotation += 0.001 * dt * this.#speed * this.#rotation * window.innerWidth * 0.00025

			if (this.pixiSprite.sprite.position.y > window.innerHeight) {
				this.destroy()
				this.ref.removeIngredient(this)
			}
		}
	}

	addInputOnA() {
		const inputSet1 = this.#game.player1.inputSet
		inputSet1.addEvent("a", this.holdIngredient, this)

		const inputSet2 = this.#game.player2.inputSet
		inputSet2.addEvent("a", this.holdIngredient, this)
	}

	holdIngredient(e) {
		const player = e.id === 1 ? this.#game.player1 : this.#game.player2
		if (this.#canMove && !this.#inCooking && !this.#onPlate && this.pixiSprite && this.pixiSprite.sprite) {
			if (player && PixiSprite.checkOverlap(player.pixiSprite.sprite, this.pixiSprite.sprite)) {
				this.#game.soundManager.playSingleSound("hold",.25 )
				player.holdIngredient(this)
				this.pixiSprite.sprite.zIndex = 3
				store.players[ e.id - 1 ].action = this.#action
			} else {
				store.players[ e.id - 1 ].action = null
			}
		}
	}

	destroy() {
		this.ref.removeIngredient(this)
		this.pixiSprite.sprite.destroy()
		this.pixiSprite = null
	}

	onInteractionCounterIn() {
		this.pixiSprite.sprite.visible = false
		this.setInCooking(true)
		this.setCanMove(false)
	}

	onInteractionCounterEnd() {
		this.pixiSprite.sprite.visible = true
		this.setInCooking(false)
		this.setCanMove(true)
		this.setIsCooked(true)
	}

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
		return this.#name
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
