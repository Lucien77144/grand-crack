import { Game } from "@/game/Game"
import InputSet from "@/game/InputSet"
import PixiSprite from "@/game/pixi/PixiSprite"
import PixiApplication from "@/game/pixi/PixiApplication"
import { clamp } from "@/utils/maths"

export default class Player {
	constructor(id, texture) {
		this.id = id
		this.game = new Game()
		this.oxygen = 100
		this.inputSet = new InputSet(id)
		this.canMove = true
		this.holder = null
		this.velocity = 1
		this.texture = texture
	}

	async initPixiSprite() {
		const pixiApplication = new PixiApplication()
		this.pixiSprite = new PixiSprite(this.texture)
		await this.pixiSprite.init().then((sprite) => {
			pixiApplication.appendToStage(sprite)
		})
	}

	joystickEvent(e) {
		if (this.pixiSprite) {
			const x = this.velocity * e.position.x
			const y = this.velocity * e.position.y
			this.pixiSprite.addVecPos(x, y)
		}
	}

	addInputsListener() {
		this.inputSet.addEventJoystick(this.joystickEvent, this)
		this.inputSet.addEvent("a", this.eventInputA, this)
	}

	eventInputA(e) {
		this.addOxygen(10)
		console.log("click")
	}

	addOxygen(value) {
		this.oxygen += value
		this.oxygen = clamp(this.oxygen, 0, 100)
	}

	update(dt, t) {
		this.addOxygen(-dt / 60)
	}
}
