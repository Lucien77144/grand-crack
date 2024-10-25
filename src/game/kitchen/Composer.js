import { CookingStation } from "./CookingStation"
import PixiSprite from "@/game/pixi/PixiSprite"
import { store } from "@/store"
import TextureLoader from "@/game/TextureLoader"
import { gsap } from "gsap"
import { Game } from "../Game"

export class Composer extends CookingStation {
	playerAssign = 0
	targetIngredients = {}
	ingredients = {}
	plate = null
	game = new Game()

	constructor({ ...props }) {
		super({ ...props })
		this.tl = new TextureLoader()
	}

	start() {
		if (store.isGameOver) return
		const rdm = Math.floor(Math.random() * 25) * 1000
		const min = 10000
		const speed =
			(this.game.recipesDone - (this.playerAssign.id - 1)) * 1000

		this.game.recipesDone++

		setTimeout(() => {
			this.recipeList = this.playerAssign.setRecipeList()
			this.#setTargetIngredients()
			this.start()
		}, rdm + min - speed)
	}

	assignPlayer(player) {
		this.playerAssign = player
		this.recipeList = player.recipeList
		this.#setTargetIngredients()

		this.addInputCounterIn(player)
	}

	#setTargetIngredients() {
		this.targetIngredients = this.recipeList.reduce((acc, r) => {
			return { ...acc, [ r.id ]: r.ingredients.map((i) => i.id) }
		}, {})
	}

	onPressButtonInteract() {
		const ingredient = this.playerAssign?.ingredientHold

		if (
			ingredient &&
			this.checkCanInteractWithIngredient(this.playerAssign, ingredient)
		) {
			this.playerAssign.updateSpriteFrame(false)
			this.game.soundManager.playSingleSound("hold", 0.1)
			ingredient.setOnPlate(true)
			ingredient.setCanMove(false)
			this.playerAssign.onPlayerInteractCounter(true)

			this.addIngredient(ingredient)

			const newList = []
			this.recipeList.forEach((recipe) => {
				if (this.checkIsFinished(recipe.id)) {
					const pIndex = this.playerAssign.id - 1
					store.players[ pIndex ].score += recipe.score

					this.game.soundManager.playSingleSound("recipeComplete", 1)
					this.playerAssign.removeRecipeFromList(recipe.id)

					this.removeIngredients(recipe.ingredients.map((i) => i.id))

					this.#setTargetIngredients()
					this.addPlate(recipe)
				} else {
					newList.push(recipe)
				}
			})
			this.recipeList = newList

			this.playerAssign.releaseIngredient(true)
		}
	}

	addIngredient(ingredient) {
		this.ingredients[ ingredient.getId() ] = ingredient
	}

	removeIngredients(list = []) {
		list.forEach((ingredient) => {
			this.ingredients[ ingredient ].destroy()
			delete this.ingredients[ ingredient ]
		})
	}

	addPlate(recipe) {
		this.textureData = this.tl.assetArray[ recipe.id ]
		if (!this.textureData) return
		const dir = this.playerAssign.id === 1 ? 1 : -1 // 1 = left; -1 = right;
		const size = 0.4
		const margin = 300
		const size2 = size * (innerWidth * 0.1)
		const toRight = dir < 0 ? innerWidth : 0
		const offset = (size2 + margin) * dir
		const x = offset + toRight

		this.plate = new PixiSprite(
			{
				x,
				y: innerHeight - this.pixiSprite.sprite.height * 0.35,
				size,
				anchor: [ 0.5, 0.5 ],
			},
			this.textureData
		)
		this.plate.sprite.zIndex = 4

		const tl = gsap
			.timeline()
			.to(
				this.plate.sprite,
				{
					x: x - offset * 2,
					ease: "power2.in",
					duration: 0.5,
					delay: 1.5,
				},
				0
			)
			.to(
				this.plate.sprite.scale,
				{
					x: size * 0.1,
					y: size * 0.1,
					ease: "power2.in",
					duration: 0.5,
					delay: 1.5,
					onComplete: () => {
						this.plate.sprite.destroy()
						this.plate = null
						tl.kill()
					},
				},
				0
			)
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

			// const isCook =
			// 	ingredient.getInCooking() === false &&
			// 	ingredient.getIsCooked() === true &&
			// 	!ingredient.getOnPlate()

			const inRecipe = this.recipeList.some((recipe) =>
				recipe.ingredients.some((i) => i.id === ingredient.getId())
			)
			const notAlreadyIn = !this.ingredients.hasOwnProperty(
				ingredient.getId()
			)

			return (
				// ingredient && overlapping && inRecipe && notAlreadyIn && isCook
				ingredient && overlapping && inRecipe && notAlreadyIn
			)
		} else {
			return false
		}
	}

	checkIsFinished(id) {
		return this.targetIngredients[ id ].every((ingredient) =>
			this.ingredients.hasOwnProperty(ingredient)
		)
	}

	addInputCounterIn(player) {
		const inputSet = player.inputSet
		inputSet.addEvent("a", this.onPressButtonInteract, this)
	}
}
