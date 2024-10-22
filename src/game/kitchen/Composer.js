import { CookingStation } from "./CookingStation"
import PixiSprite from "@/game/pixi/PixiSprite"
import { store } from "@/store"
import TextureLoader from "@/game/TextureLoader"
import { gsap } from "gsap"

export class Composer extends CookingStation {
	playerAssign = 0
	targetIngredients = []
	ingredients = {}
	plate = null

	constructor({ ...props }) {
		super({ ...props })
		this.tl = new TextureLoader()
	}

	assignPlayer(player) {
		this.playerAssign = player
		this.targetIngredients = player.recipe.ingredients.map(
			(ingredient) => ingredient.name
		)
		this.recipe = player.recipe

		this.addInputCounterIn(player)
	}

	onPressButtonInteract(e) {
		const ingredient = this.playerAssign.ingredientHold

		if (
			this.playerAssign &&
			ingredient &&
			this.checkCanInteractWithIngredient(this.playerAssign, ingredient)
		) {
			this.playerAssign.updateSpriteFrame(false)
			this.game.soundManager.playSingleSound("hold", 0.25)
			ingredient.setOnPlate(true)
			ingredient.setCanMove(false)
			this.playerAssign.onPlayerInteractCounter(true)

			this.addIngredient(ingredient)

			if (this.checkIsFinished()) {
				this.game.soundManager.playSingleSound("recipeComplete", 1)
				store.players[ this.playerAssign.id - 1 ].score +=
					this.recipe.score
				const recipe = this.playerAssign.setRandomRecipe()
				this.recipe = recipe
				this.removeIngredients()
				this.targetIngredients = recipe.ingredients.map(
					(ingredient) => ingredient.name
				)
				this.addPlate()
			}
		}
	}

	addIngredient(ingredient) {
		this.ingredients[ ingredient.getName() ] = ingredient
	}

	removeIngredients() {
		Object.keys(this.ingredients).forEach((ingredient) =>
			this.ingredients[ ingredient ].destroy()
		)
		this.ingredients = {}
	}

	addPlate() {
		this.textureData = this.tl.assetArray[ this.recipe.name ]
		this.plate = new PixiSprite(
			{
				x: this.pixiSprite.sprite.x,
				y: this.pixiSprite.sprite.y,
				size: 0.45,
				anchor: [ 0.5, 0.5 ],
			},
			this.textureData
		)
		this.plate.sprite.zIndex = 4
		const orientation = this.playerAssign.id === 1 ? -1 : 1

		gsap.to(this.plate.sprite, {
			x: this.plate.sprite.x + 300 * orientation,
			ease: "power2.in",
			duration: 0.5,
			delay: 1.5,
		})

		setTimeout(() => {
			this.plate.sprite.destroy()
			this.plate = null
		}, 5000)
	}

	checkCanInteractWithIngredient(player, ingredient) {
		if (
			player.pixiSprite &&
			player.pixiSprite.sprite &&
			this.pixiSprite &&
			this.pixiSprite.sprite
		) {
			const overlapping =
				player &&
				PixiSprite.checkOverlap(
					player.pixiSprite.sprite,
					this.pixiSprite.sprite
				)

			const isCook =
				ingredient.getInCooking() === false &&
				ingredient.getIsCooked() === true &&
				!ingredient.getOnPlate()

			const inRecipe = this.targetIngredients.includes(
				ingredient.getName()
			)
			const notAlreadyIn = !this.ingredients.hasOwnProperty(
				ingredient.getName()
			)

			return (
				ingredient && overlapping && isCook && inRecipe && notAlreadyIn
			)
		} else {
			return false
		}
	}

	checkIsFinished() {
		return this.targetIngredients.every((ingredient) =>
			this.ingredients.hasOwnProperty(ingredient)
		)
	}

	addInputCounterIn(player) {
		const inputSet = player.inputSet
		inputSet.addEvent("x", this.onPressButtonInteract, this)
	}
}
