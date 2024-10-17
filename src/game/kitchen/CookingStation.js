import PixiApplication from "@/game/pixi/PixiApplication"
import PixiSprite from "@/game/pixi/PixiSprite"

export class CookingStation {
	player = null
	ingredient = null
	currentTime = 0
	timeLimit = 0
	texture = null
	sprite = null
	action = ""

	constructor({ ...props }) {
		this.texture = props.texture
		this.x = props.x
		this.y = props.y
		this.size = props.size

		console.log("CookingStation created")
	}

	async initPixiSprite() {
		const pixiApplication = new PixiApplication()
		this.sprite = new PixiSprite(this.texture, this.x, this.y, this.size)
		await this.sprite.init().then((sprite) => {
			pixiApplication.appendToStage(sprite)
		})

		console.log("Init the PixiSprite")
	}

	addInteractingPlayer(player) {}

	removeInteractingPlayer() {}

	__startTimer() {}

	__stopTimer() {}

	__checkCanInteractWith() {}

	__success() {
		console.log("Success")
	}

	__fail() {
		console.log("Fail")
	}
}
