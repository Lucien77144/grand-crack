import { v4 as uuidv4 } from "uuid"
import PixiApplication from "@/game/pixi/PixiApplication"
import { Assets, AnimatedSprite } from "pixi.js"
import {Game} from "@/game/Game";
import PixiSprite from "@/game/pixi/PixiSprite";


export default class Ingredient {
	#id
	#name
	#sprite
	#canMove
	#game
	#action
	#isCooked
	#inCooking = false
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
		if (!this.spritesheet || !this.atlasData) return
		const pixiApplication = new PixiApplication()

		const sheetTexture = await Assets.load(this.spritesheet)
		Assets.add({
			alias: `atlas-${ this.#name }`,
			src: this.atlasData,
			data: { texture: sheetTexture }
		})

		const sheet = await Assets.load(`atlas-${ this.#name }`)

		this.sprite = new AnimatedSprite(sheet.animations[ this.#name ])

		this.sprite.scale = this.size
		this.sprite.anchor.set(0.5,0.5)

		this.sprite.x = this.x
		this.sprite.y = 0

		pixiApplication.appendToStage(this.sprite)

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
		// if (this.pixiSprite) {
		// 	if (this.pixiSprite?.sprite?.position) {
		// 		this.pixiSprite.sprite.position.y += 1

		// 		if (this.pixiSprite.sprite.position.y > window.innerHeight) {
		// 			this.destroy()
		// 		}
		// 	}
		// }

		this.updateGravity()
	}

	updateGravity(){
		if (this.sprite) {
			// console.log(this.sprite.position)
			this.sprite.position.y += 1

			if (this.sprite.position.y > window.innerHeight) {
				this.destroy()
			}
		}
	}

	addInputOnA(){
		const inputSet1 = this.#game.player1.inputSet;
		inputSet1.addEvent("a",this.checkCanInteract,this)

		const inputSet2 = this.#game.player2.inputSet;
		inputSet2.addEvent("a",this.checkCanInteract,this)
	}

	checkCanInteract(e){
		const player = e.id === 1  ? this.#game.player1 : this.#game.player2;
		if(this.#canMove && !this.#inCooking && this.sprite){
			if(player && PixiSprite.checkOverlap(player.pixiSprite.sprite,this.sprite)){
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
