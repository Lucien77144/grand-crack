import PixiApplication from "@/game/pixi/PixiApplication"
import PixiSprite from "@/game/pixi/PixiSprite"
import { Assets, Sprite, AnimatedSprite } from "pixi.js"
import {Game} from "@/game/Game";

export class CookingStation {
	player = null
	ingredient = null
	currentTime = 0
	timeLimit = 0
	spritesheet = null
	atlasData = null
	action = ""
	anim = null
	game

	constructor({ ...props }) {
		this.x = props.x
		this.y = props.y
		this.size = props.size
		this.spritesheet = props.spritesheet
		this.atlasData = props.atlasData
		this.pixiApplication = new PixiApplication()
		this.game = new Game()
	}

	async initPixiSprite() {
		const sheetTexture = await Assets.load(this.spritesheet)
		Assets.add({
			alias: "atlas",
			src: this.atlasData,
			data: { texture: sheetTexture }
		})

		const sheet = await Assets.load("atlas")
		this.sprite = new AnimatedSprite(sheet.animations.cutter)
		this.sprite.x = this.x
		this.sprite.y = this.y

		const reference = sheet.data.frames
		let w
		let h

		// Get the first frame as a reference (because they all have the same size)
		const keys = Object.keys(reference)
		if (keys.length > 0) {
			const firstKey = keys[ 0 ]
			const firstValue = reference[ firstKey ]
			w = firstValue.sourceSize.w
			h = firstValue.sourceSize.h
		}

		this.sprite.width = this.size
		this.sprite.height = this.size * (h / w)

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
