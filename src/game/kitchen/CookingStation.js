import PixiApplication from "@/game/pixi/PixiApplication"
import PixiSprite from "@/game/pixi/PixiSprite"
import { Assets, Sprite, AnimatedSprite } from "pixi.js"
import { Game } from "@/game/Game"
import TextureLoader from "@/game/TextureLoader"


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
		this.action = props.action
		this.size = props.size
		this.spritesheet = props.spritesheet
		this.atlasData = props.atlasData
		this.pixiApplication = new PixiApplication()
		this.game = new Game()
		this.tl = new TextureLoader()
		this.textureData = this.tl.assetArray[ props.action ]

		this.initPixiSprite()
	}

	initPixiSprite() {
		this.pixiSprite = new PixiSprite(
			{
				x: this.x,
				y: this.y,
				size: this.size,
				anchor: [ 0, 0 ],
				animationName: this.action,
				zIndex: 2
			},
			this.textureData
		)
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
