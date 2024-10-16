import { Application, Assets, Sprite } from "pixi.js"

export default class PixiSprite{
	constructor(src) {
		this.src = src

	}

	async init() {
		this.texture = await Assets.load(this.src)
		this.sprite = new Sprite(this.texture)

		this.sprite.anchor.set(0.5)
		this.sprite.x = 200
		this.sprite.y = 200
		return Promise.resolve(this.sprite)
	}

	update(t){
		if(this.sprite)
			this.sprite.position.x += Math.sin(t*0.1) * 200;
	}

	setSpritePos(nextPos){
		this.sprite.position.set(nextPos.x, nextPos.y)
	}

	setSpriteRotation(nextRotation){
		this.sprite.rotation = nextRotation
	}
}
