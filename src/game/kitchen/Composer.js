import { CookingStation } from "./CookingStation"
import PixiSprite from "@/game/pixi/PixiSprite"
import { store } from "@/store"
import TextureLoader from "@/game/TextureLoader"

export class Composer extends CookingStation {
	playerAssign = 0
	targetIngredients = []
	placeholders = []
	ingredients = {}
	plate = null

	constructor({ ...props }) {
		super({ ...props })
		this.tl = new TextureLoader()
	}

	assignPlayer(player) {
		this.playerAssign = player
		this.targetIngredients = player.recipe.ingredients.map(ingredient => ingredient.name)
		this.recipe = player.recipe

		this.addInputCounterIn(player)
	}

	onPressButtonInteract(e) {
		const ingredient = this.playerAssign.ingredientHold
		if (this.playerAssign && ingredient && this.checkCanInteractWithIngredient(this.playerAssign, ingredient)) {
			this.game.soundManager.playSingleSound("hold", .25)
			ingredient.setOnPlate(true)
			ingredient.setCanMove(false)
			this.playerAssign.onPlayerInteractCounter(true)

			this.addIngredient(ingredient)

			if (this.checkIsFinished()) {
				this.game.soundManager.playSingleSound("recipeComplete", 1)
				store.players[ this.playerAssign.id - 1 ].score += this.recipe.score
				const recipe = this.playerAssign.setRandomRecipe()
				this.recipe = recipe
				this.removeIngredients()
				this.targetIngredients = recipe.ingredients.map(ingredient => ingredient.name)
				this.addPlate()
			}
		}
	}

	addIngredient(ingredient) {
		this.ingredients[ ingredient.getName() ] = ingredient
		console.log(this.ingredients)
	}

	removeIngredients() {
		Object.keys(this.ingredients).forEach(ingredient => this.ingredients[ ingredient ].destroy())
		this.ingredients = {}
	}

	addPlate() {
		this.textureData = this.tl.assetArray[ this.recipe.name ]
		this.plate = new PixiSprite(
			{
				x: this.pixiSprite.sprite.x,
				y: this.pixiSprite.sprite.y,
				size: .25,
				anchor: [ 0.5, 0.5 ],
			},
			this.textureData
		)
		this.plate.sprite.zIndex = 4
		setTimeout(() => {
			this.plate.sprite.destroy()
			this.plate = null
		}, 5000)
	}

	checkCanInteractWithIngredient(player, ingredient) {
		if (player.pixiSprite && player.pixiSprite.sprite && this.pixiSprite && this.pixiSprite.sprite) {
			const overlapping = player && PixiSprite.checkOverlap(
				player.pixiSprite.sprite,
				this.pixiSprite.sprite
			)
			// console.log("overlapping",overlapping)

			const isCook = ingredient.getInCooking() === false
				&& ingredient.getIsCooked() === true && !ingredient.getOnPlate()
			// console.log("isCook",isCook)

			const inRecipe = this.targetIngredients.includes(ingredient.getName())
			// console.log("inRecipe",inRecipe)

			const notAlreadyIn = !this.ingredients.hasOwnProperty(ingredient.getName())
			// console.log("notAlreadyIn",notAlreadyIn)


			return ingredient && overlapping && isCook && inRecipe && notAlreadyIn
		} else {
			return false
		}
	}

	checkIsFinished() {
		return this.targetIngredients.every(ingredient => this.ingredients.hasOwnProperty(ingredient))
	}

	initPlaceholder() {
		const spriteX = this.pixiSprite.sprite.x
		const spriteY = this.pixiSprite.sprite.y
		const width = this.pixiSprite.sprite.width
		const height = this.pixiSprite.sprite.height
		this.targetIngredients.forEach((ingredient, i) => {
			const sign = i % 2 === 0 ? -1 : 1
			const x = spriteX + Math.random() * width
			const y = spriteY + Math.random() * height - sign
			this.placeholders.push({ x, y })
		})
	}

	addInputCounterIn(player) {
		const inputSet = player.inputSet
		inputSet.addEvent("x", this.onPressButtonInteract, this)
	}
}
