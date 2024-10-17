import { Assets, Sprite } from "pixi.js"

export default class PixiSprite {
	constructor(src, x, y, size) {
		this.src = src
		this.x = x
		this.y = y
		this.size = size
	}

	async init() {
		this.texture = await Assets.load(this.src)
		this.sprite = new Sprite(this.texture)

		this.sprite.anchor.set(0.5)
		this.sprite.x = this.x
		this.sprite.y = this.y

		this.sprite.width = this.size
		this.sprite.height = this.size * (this.texture.height / this.texture.width)

		return Promise.resolve(this.sprite)
	}

	update(dt, t) {}

	setSpritePos(nextPos) {
		this.sprite.position.set(nextPos.x, nextPos.y)
	}

	addVecPos(x,y){
		this.sprite.x += x
        this.sprite.y += y
	}

	setSpriteRotation(nextRotation) {
		this.sprite.rotation = nextRotation
	}

	checkIn(spriteOverlap) {
		let x1 = this.sprite.position.x - (this.sprite.width / 2),
			y1 = this.sprite.position.y - (this.sprite.height / 2),
			w1 = this.sprite.width,
			h1 = this.sprite.height,
			x2 = spriteOverlap.position.x - (spriteOverlap.width / 2),
			y2 = spriteOverlap.position.y - (spriteOverlap.height / 2),
			w2 = spriteOverlap.width,
			h2 = spriteOverlap.height

		if (x1 + w1 > x2)
			if (x1 < x2 + w2)
				if (y1 + h1 > y2)
					if (y1 < y2 + h2)
						return true

		return false
	}

	// Fonction pour vérifier si deux sprites se chevauchent
	checkOverlap(targetSprite) {
		const bounds1 = this.sprite.getBounds()
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
