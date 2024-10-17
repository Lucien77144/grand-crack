import { Assets, Sprite, Point, AnimatedSprite } from "pixi.js"
import { v4 as uuidv4 } from "uuid"
import PixiApplication from "@/game/pixi/PixiApplication"


export default class PixiSprite {
	constructor({
		x = 0,
		y = 0,
		size = 1,
		anchor = [ 0.5, 0.5 ],
		animationName = "",
	} = {},
	textureData
	) {
		this.textureData = textureData
		this.atlasId = uuidv4()

		this.x = x
		this.y = y
		this.size = size
		this.anchor = anchor
		this.animationName = animationName

		this.init()
	}

	init() {
		const pixiApplication = new PixiApplication()

		// Create a spritesheet if there is an atlasData
		if (this.textureData.sheet) {
			this.sprite = new AnimatedSprite(
				this.textureData.sheet.animations[ this.animationName ]
			)

		// Otherwise, create a sprite
		} else {
			this.sprite = new Sprite(this.textureData.texture)
		}

		this.sprite.anchor.set(...this.anchor)
		this.sprite.x = this.x
		this.sprite.y = this.y
		this.sprite.scale = this.size
		this.sprite.layer = this.layer

		pixiApplication.appendToStage(this.sprite)
	}

	update(dt, t) {}

	setSpritePos(nextPos) {
		this.sprite.position.set(nextPos.x, nextPos.y)
	}

	addVecPos(x, y) {
		this.sprite.x += x
		this.sprite.y += y
	}

	setSpriteRotation(nextRotation) {
		this.sprite.rotation = nextRotation
	}

	static checkIn(baseSprite, targetSprite) {
		let x1 = baseSprite.position.x - (baseSprite.width / 2),
			y1 = baseSprite.position.y - (baseSprite.height / 2),
			w1 = baseSprite.width,
			h1 = baseSprite.height,
			x2 = targetSprite.position.x - (targetSprite.width / 2),
			y2 = targetSprite.position.y - (targetSprite.height / 2),
			w2 = targetSprite.width,
			h2 = targetSprite.height

		if (x1 + w1 > x2)
			if (x1 < x2 + w2)
				if (y1 + h1 > y2)
					if (y1 < y2 + h2)
						return true

		return false
	}

	static updatePositionWithOffset(spriteA, spriteB) {
		// Calculer la différence entre A et B
		const dx = spriteB.x - spriteA.x // Différence sur l'axe x
		const dy = spriteB.y - spriteA.y // Différence sur l'axe y

		// Appliquer cette différence à la nouvelle position de A
		const spriteBNew = {
			x: dx, // Position x de B ajustée
			y: dy // Position y de B ajustée
		}

		return spriteBNew
	}

	// Fonction pour vérifier si deux sprites se chevauchent
	static checkOverlap(baseSprite, targetSprite) {
		if (!baseSprite || !targetSprite) {
			console.error("Un des sprites est invalide.")
			return false
		}


		const bounds1 = baseSprite.getBounds()
		const bounds2 = targetSprite.getBounds()

		// Vérifie s'il y a chevauchement entre les rectangles
		return (
			bounds1.x < bounds2.x + bounds2.width &&
				bounds1.x + bounds1.width > bounds2.x &&
				bounds1.y < bounds2.y + bounds2.height &&
				bounds1.y + bounds1.height > bounds2.y
		)
	}
}
