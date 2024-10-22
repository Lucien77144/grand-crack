import { CookingStation } from "./CookingStation"
import PixiSprite from "@/game/pixi/PixiSprite"
import { store } from "@/store"
import TextureLoader from "@/game/TextureLoader"
import { gsap } from "gsap"

export class Composer extends CookingStation {
	playerAssign = 0
	targetIngredients = {}
	ingredients = {}
	plate = null

	constructor({ ...props }) {
		super({ ...props })
		this.tl = new TextureLoader()
	}

	start() {
		// @TODO: Optimise and do a destroy
		setInterval(() => {
			this.recipeList = this.playerAssign.setRecipeList()
			this.#setTargetIngredients()
		}, 5000)
	}

	assignPlayer(player) {
		this.playerAssign = player
		this.recipeList = player.recipeList
		this.#setTargetIngredients()

		this.addInputCounterIn(player)
	}

	#setTargetIngredients() {
		this.targetIngredients = this.recipeList.flatMap((r) => {
			return { [ r.name ]: r.ingredients.map((i) => i.name) }
		})
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

			this.recipeList.forEach((recipe) => {
				console.log("recipe", recipe)

				if (this.checkIsFinished(recipe)) {
					const pIndex = this.playerAssign.id - 1
					store.players[ pIndex ].score += recipe.score

					this.game.soundManager.playSingleSound("recipeComplete", 1)
					this.playerAssign.removeRecipeFromList(recipe.name)

					this.removeIngredients(
						recipe.ingredients.map((i) => i.name)
					)
					this.#setTargetIngredients()
					this.addPlate(recipe)
				}
			})
		}
	}

	addIngredient(ingredient) {
		this.ingredients[ ingredient.getName() ] = ingredient
	}

	removeIngredients(list = []) {
		list.forEach((ingredient) => {
			this.ingredients[ ingredient ].destroy()
			delete this.ingredients[ ingredient ]
		})
	}

	addPlate(recipe) {
		this.textureData = this.tl.assetArray[ recipe.name ]
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

	checkIsFinished(name) {
		return this.targetIngredients[ name ].every((ingredient) =>
			this.ingredients.hasOwnProperty(ingredient)
		)
	}

	addInputCounterIn(player) {
		const inputSet = player.inputSet
		inputSet.addEvent("x", this.onPressButtonInteract, this)
	}
}
