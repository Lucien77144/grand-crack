import { v4 as uuidv4 } from "uuid"
import PixiApplication from "@/game/pixi/PixiApplication"
import { Assets, AnimatedSprite } from "pixi.js"
import { Game } from "@/game/Game"
import PixiSprite from "@/game/pixi/PixiSprite"
export default class Ingredient {
	#id
	#name
	#sprite
	#canMove
	#game
	#action
	#isCooked
	#inCooking = false
	#speed = .5
	#nbOfFrames = 0

	constructor(ref, name, spritesheet, atlasData, size, x, canMove = true, action, isCooked = false) {
		this.ref = ref
		this.#game = new Game()
		this.#id = uuidv4()
		this.#name = name
		this.spritesheet = spritesheet
		this.atlasData = atlasData
		this.size = size
		this.x = x
		// this.#game = new Game()
		// this.#sprite = new Sprite(spritesheet);
		this.#canMove = canMove
		// this.#action = new Action()
		this.#isCooked = isCooked
	}

	setAnimatedSpriteFrame(frame) {
		this.sprite.gotoAndStop(frame)
	}

	async initPixiSprite() {
		const pixiApplication = new PixiApplication()

		this.pixiSprite = new PixiSprite({
			src: this.spritesheet,
			x: this.x,
			y: 0,
			size: 1,
			action: this.#action,
		})

		this.pixiSprite.setAtlasData(this.atlasData)

		await this.pixiSprite.init().then((sprite) => {
			this.sprite = sprite
			pixiApplication.stage.addChild(this.sprite)
		})

		this.addInputOnA()
	}

	async create() {
		try {
			this.ref.addIngredient(this)
			await this.initPixiSprite()
		} catch (error) {
			console.error("Error creating ingredient:", error)
		}
	}

	update(dt) {
		this.updateGravity(dt)
	}

	updateGravity(dt) {
		if (this.sprite) {
			console.log(this.sprite.position)
			this.sprite.position.y += dt * this.#speed

			if (this.sprite.position.y > window.innerHeight) {
				this.destroy()
			}
		}
	}

	addInputOnA() {
		const inputSet1 = this.#game.player1.inputSet
		inputSet1.addEvent("a", this.checkCanInteract, this)

		const inputSet2 = this.#game.player2.inputSet
		inputSet2.addEvent("a", this.checkCanInteract, this)
	}

	checkCanInteract(e) {
		const player = e.id === 1 ? this.#game.player1 : this.#game.player2
		if (this.#canMove && !this.#inCooking && this.sprite) {
			if (player && PixiSprite.checkOverlap(player.pixiSprite.sprite, this.sprite)) {
				player.holdIngredient(this)
				console.log("overlap P1")
			}
		}
	}

	destroy() {
		this.ref.removeIngredient(this)
		this.sprite.destroy()
		this.sprite = null
	}

	getId() {
		return this.#id
	}

	setName(name) {
		this.#name = name
	}

	getName() {
		return this.#name
	}

	setSprite(sprite) {
		this.#sprite = sprite
	}

	getSprite() {
		return this.#sprite
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
