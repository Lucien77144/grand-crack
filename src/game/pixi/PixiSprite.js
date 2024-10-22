import { Assets, Sprite, Point, AnimatedSprite } from "pixi.js" // Import des classes nécessaires de Pixi.js
import { v4 as uuidv4 } from "uuid" // Import pour générer des identifiants uniques
import PixiApplication from "@/game/pixi/PixiApplication" // Import de l'application Pixi

export default class PixiSprite {
	constructor(
		{
			x = 0,
			y = 0,
			size = 1,
			anchor = [ 0.5, 0.5 ],
			animationName = "",
			zIndex = 0,
		} = {},
		textureData
	) {
		this.textureData = textureData
		this.atlasId = uuidv4() // Identifiant unique pour le sprite

		// Propriétés de position, taille, ancre, animation, et zIndex
		this.x = x
		this.y = y
		this.size = size
		this.anchor = anchor
		this.animationName = animationName
		this.zIndex = zIndex

		this.init() // Appel de la méthode d'initialisation
	}

	init() {
		const pixiApplication = new PixiApplication()

		// Crée un AnimatedSprite si des données d'atlas sont fournies
		if (this.textureData.sheet) {
			this.sprite = new AnimatedSprite(
				this.textureData.sheet.animations[ this.animationName ]
			)
		} else {
			// Sinon, crée un Sprite simple
			this.sprite = new Sprite(this.textureData.texture)
		}

		// Définit l'ancre, la position, l'échelle et le zIndex
		this.sprite.anchor.set(...this.anchor)
		this.sprite.x = this.x
		this.sprite.y = this.y
		this.sprite.scale = this.size
		this.sprite.zIndex = this.zIndex

		pixiApplication.appendToStage(this.sprite)
	}

	update(dt, t) {
		// ...
	}

	setSpritePos(nextPos) {
		this.sprite.position.set(nextPos.x, nextPos.y)
	}

	addVecPos(x, y) {
		this.sprite.x += x
		this.sprite.y += y
	}

	setSpriteRotation(nextRotation) {
		// Définit la rotation du sprite
		this.sprite.rotation = nextRotation
	}

	static updatePositionWithOffset(spriteA, spriteB) {
		const dx = spriteB.x - spriteA.x
		const dy = spriteB.y - spriteA.y

		// Retourne la nouvelle position ajustée
		const spriteBNew = {
			x: dx,
			y: dy,
		}

		return spriteBNew
	}

	// Vérifie si deux sprites se chevauchent
	static checkOverlap(baseSprite, targetSprite) {
		const halfWidth = targetSprite.width / 2
		const halfHeight = targetSprite.height / 2

		// Vérifie si le point est à l'intérieur des dimensions du sprite
		const isInside =
			baseSprite.x >= -halfWidth + targetSprite.x &&
			baseSprite.x <= halfWidth + targetSprite.x &&
			baseSprite.y >= -halfHeight + targetSprite.y &&
			baseSprite.y <= halfHeight + targetSprite.y

		return isInside // Retourne true si overlap, false sinon
	}
}
