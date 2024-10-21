import data from "@/game/textures.json"
import { Assets } from "pixi.js"
export default class TextureLoader {
	static instance
	assetArray = {}

	constructor() {
		if (TextureLoader.instance) {
			return TextureLoader.instance
		}

		TextureLoader.instance = this
	}

	async loadTexture() {
		const promises = data.textures.map(async (data) => {
			const texture = await Assets.load(data.src)

			if (data.atlasData) {
				Assets.add({
					alias: `atlas-${ data.name }`,
					src: data.atlasData,
					data: { texture: texture }
				})

				const sheet = await Assets.load(`atlas-${ data.name }`)

				this.assetArray[ data.name ] = {
					texture: texture,
					sheet: sheet
				}
			} else {
				// Si aucune atlas n'est fournie, stocke uniquement la texture
				this.assetArray[ data.name ] = {
					texture: texture,
				}
			}
		})

		await Promise.all(promises)
		return this.assetArray
	}
}
