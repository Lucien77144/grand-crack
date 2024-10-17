import PixiApplication from "@/game/pixi/PixiApplication"
import PixiSprite from "@/game/pixi/PixiSprite"
import { Assets, Sprite, AnimatedSprite } from "pixi.js"

export class CookingStation {
	player = null
	ingredient = null
	currentTime = 0
	timeLimit = 0
	spritesheet = null
	atlasData = null
	action = ""
	anim = null

	constructor({ ...props }) {
		this.x = props.x
		this.y = props.y
		this.action = props.action
		this.size = props.size
		this.spritesheet = props.spritesheet
		this.atlasData = props.atlasData
		this.pixiApplication = new PixiApplication()
	}

	async initPixiSprite() {
		const sheetTexture = await Assets.load(this.spritesheet)
		Assets.add({
			alias: `atlas-${ this.action }`,
			src: this.atlasData,
			data: { texture: sheetTexture }
		})

		const sheet = await Assets.load(`atlas-${ this.action }`)
		this.sprite = new AnimatedSprite(sheet.animations[ this.action ])
		this.sprite.x = this.x
		this.sprite.y = this.y
		this.sprite.scale = this.size
		this.pixiApplication.app.stage.addChild(this.sprite)
	}

	addInteractingPlayer(player) {}

	removeInteractingPlayer() {}

	__checkCanInteractWith() {}

	__success() {
		console.log("Success")
	}

	__fail() {
		console.log("Fail")
	}
}
