import { v4 as uuidv4 } from "uuid"
import PixiApplication from "@/game/pixi/PixiApplication"
import { Assets, AnimatedSprite } from "pixi.js"


export default class Ingredient {
	#id
	#name
	#sprite
	#canMove
	#game
	#action
	#isCooked
	#nbOfFrames = 0

	constructor(ref, name, spritesheet, atlasData, animationName, size, x, canMove = true, action, isCooked = false) {
		this.ref = ref
		this.#id = uuidv4()
		this.#name = name
		this.spritesheet = spritesheet
		this.atlasData = atlasData
		this.animationName = animationName
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
		if (!this.spritesheet || !this.atlasData || !this.animationName) return
		const pixiApplication = new PixiApplication()

		const sheetTexture = await Assets.load(this.spritesheet)
		Assets.add({
			alias: `atlas-${ this.#name }`,
			src: this.atlasData,
			data: { texture: sheetTexture }
		})

		const sheet = await Assets.load(`atlas-${ this.#name }`)

		this.sprite = new AnimatedSprite(sheet.animations[ this.animationName ])

		this.sprite.scale = this.size

		this.sprite.x = this.x
		this.sprite.y = 0

		pixiApplication.appendToStage(this.sprite)
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
		// if (this.pixiSprite) {
		// 	if (this.pixiSprite?.sprite?.position) {
		// 		this.pixiSprite.sprite.position.y += 1

		// 		if (this.pixiSprite.sprite.position.y > window.innerHeight) {
		// 			this.destroy()
		// 		}
		// 	}
		// }

		if (this.sprite) {
			console.log(this.sprite.position)
			this.sprite.position.y += 1

			if (this.sprite.position.y > window.innerHeight) {
				this.destroy()
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
