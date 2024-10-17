import PixiApplication from "@/game/pixi/PixiApplication"
import PixiSprite from "@/game/pixi/PixiSprite"

export class CookingStation {
	player = null
	ingredient = null
	currentTime = 0
	timeLimit = 0
	texture = null
	action = ""

	constructor({ ...props }) {
		this.texture = props.texture
		this.x = props.x
		this.y = props.y
		this.size = props.size
	}

	async initPixiSprite() {
		const pixiApplication = new PixiApplication()
		this.pixiSprite = new PixiSprite(this.texture, this.x, this.y, this.size)
		await this.pixiSprite.init().then((sprite) => {
			pixiApplication.appendToStage(sprite)
		})
	}

	addInteractingPlayer(player) {}

	removeInteractingPlayer() {}

	__startTimer() {}

	__stopTimer() {}

	__checkCanInteractWith() {}

	__success() {}

	__fail() {}
}
