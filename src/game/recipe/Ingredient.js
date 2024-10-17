import { v4 as uuidv4 } from "uuid"
import PixiSprite from "@/game/pixi/PixiSprite"
import PixiApplication from "@/game/pixi/PixiApplication"

export default class Ingredient {
	#id
	#name
	#sprite
	#canMove
	#game
	#action
	#isCooked

	constructor(ref, name, texture, x, canMove = true, action, isCooked = false) {
		this.ref = ref
		this.#id = uuidv4()
		this.#name = name
		this.texture = texture
		this.x = x
		// this.#game = new Game()
		// this.#sprite = new Sprite(texture);
		this.#canMove = canMove
		// this.#action = new Action()
		this.#isCooked = isCooked
	}

	async initPixiSprite() {
		try {
			const pixiApplication = new PixiApplication()
			this.pixiSprite = new PixiSprite(this.texture, this.x, 0)
			const sprite = await this.pixiSprite.init()
			pixiApplication.appendToStage(sprite)
		} catch (error) {
			console.error("Error initializing PixiSprite:", error)
		}
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
		if (this.pixiSprite) {
			if (this.pixiSprite?.sprite?.position) {
				this.pixiSprite.sprite.position.y += 1

				if (this.pixiSprite.sprite.position.y > window.innerHeight) {
					this.destroy()
				}
			}
		}
	}

	destroy() {
		console.log("destroy", this)
		this.ref.removeIngredient(this)
		this.pixiSprite.sprite.destroy()
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
