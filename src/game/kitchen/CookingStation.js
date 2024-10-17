import PixiSprite from "@/game/pixi/PixiSprite"
import { Game } from "@/game/Game"
import TextureLoader from "@/game/TextureLoader"

export class CookingStation {
	ingredient = null
	player = null
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
				anchor: [ 0.5, 0.5 ],
				animationName: this.action,
				zIndex: 2
			},
			this.textureData
		)
	}

	onPressButtonInteract(e) {
		const player = e.id === 1 ? this.game.player1 : this.game.player2
		const ingredient = player.ingredientHold
		if (player && ingredient && this.checkCanInteractWithIngredient(player, ingredient)) {
			ingredient.onInteractionCounterIn()
			player.onPlayerInteractCounter(false)
		}
	}

	checkCanInteractWithIngredient(player, ingredient) {
		const isEmpty = !this.player && !this.ingredient

		if (player.pixiSprite && player.pixiSprite.sprite && this.pixiSprite && this.pixiSprite.sprite) {
			const overlapping = player && PixiSprite.checkOverlap(
				player.pixiSprite.sprite,
				this.pixiSprite.sprite
			)
			const isNotCook = ingredient.getInCooking() === false
				&& ingredient.getIsCooked() === false

			return ingredient && isEmpty && overlapping && isNotCook
		} else {
			return false
		}
	}

	addInputCounterIn() {
		const inputSet1 = this.game.player1.inputSet
		inputSet1.addEvent("i", this.onPressButtonInteract, this)

		const inputSet2 = this.game.player2.inputSet
		inputSet2.addEvent("i", this.onPressButtonInteract, this)
	}

	addInteractingPlayer(player) {}

	removeInteractingPlayer(player) {}

	success() {
		console.log("Success")
	}

	fail() {
		console.log("Fail")
	}
}
