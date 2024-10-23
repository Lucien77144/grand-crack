import PixiSprite from "@/game/pixi/PixiSprite"
import { Game } from "@/game/Game"
import TextureLoader from "@/game/TextureLoader"

export class CookingStation {
	ingredient = null
	player = null
	atlasData = null
	action = "" // Action associée à la station (par exemple, cuisiner, mixer)
	game

	constructor({ ...props }) {
		this.x = props.x
		this.y = props.y
		this.action = props.action
		this.size = props.size
		this.anchor = props.anchor
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
				anchor: this.anchor, // Centre l'ancre du sprite
				animationName: this.action,
				zIndex: 2,
			},
			this.textureData
		)
	}

	// Gère l'interaction lorsque le bouton est pressé
	onPressButtonInteract(e) {
		const player = e.id === 1 ? this.game.player1 : this.game.player2
		const ingredient = player.ingredientHold
		if (player && ingredient && this.checkCanInteractWithIngredient(player, ingredient)) {
			ingredient.onInteractionCounterIn() // Notifie l'ingrédient qu'il est en interaction
			player.onPlayerInteractCounter(false) // Notifie le joueur qu'il interagit
		}
	}

	// Vérifie si un joueur peut interagir avec un ingrédient
	checkCanInteractWithIngredient(player, ingredient) {
		const isEmpty = !this.player && !this.ingredient // Vérifie si la station est vide (sans joueur ni ingrédient)

		if (player.pixiSprite && player.pixiSprite.sprite && this.pixiSprite && this.pixiSprite.sprite) {
			// Vérifie si le joueur et la station se chevauchent
			const overlapping = player && PixiSprite.checkOverlap(
				player.pixiSprite.sprite,
				this.pixiSprite.sprite
			)
			const isNotCook = ingredient.getInCooking() === false
				&& ingredient.getIsCooked() === false // Vérifie que l'ingrédient n'est pas en cours de cuisson et pas cuit

			const correspondingAction = ingredient.getAction()[0] === this.action // Vérifie si l'action de l'ingrédient correspond à celle de la station

			// Retourne vrai si toutes les conditions sont remplies
			return ingredient && isEmpty && overlapping && isNotCook && correspondingAction
		} else {
			return false // Retourne faux si les vérifications échouent
		}
	}

	// Ajoute des événements d'entrée pour interagir avec la station de cuisson
	addInputCounterIn() {
		const inputSet1 = this.game.player1.inputSet
		inputSet1.addEvent("a", this.onPressButtonInteract, this)

		const inputSet2 = this.game.player2.inputSet
		inputSet2.addEvent("a", this.onPressButtonInteract, this)
	}
}
