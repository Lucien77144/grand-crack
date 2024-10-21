import data from "@/game/textures.json" // Importe les données de textures depuis un fichier JSON
import { Assets } from "pixi.js" // Importe le module Assets de Pixi.js pour la gestion des textures

// Classe singleton pour charger les textures
export default class TextureLoader {
	static instance // Instance statique pour le singleton
	assetArray = {} // Objet pour stocker les textures chargées

	constructor() {
		// Vérifie si une instance de TextureLoader existe déjà
		if (TextureLoader.instance) {
			return TextureLoader.instance // Retourne l'instance existante si elle existe
		}

		TextureLoader.instance = this // Définit l'instance actuelle comme l'instance statique
	}

	// Méthode asynchrone pour charger les textures
	async loadTexture() {
		// Crée un tableau de promesses pour charger chaque texture
		const promises = data.textures.map(async (data) => {
			// Charge la texture à partir de la source spécifiée dans le JSON
			const texture = await Assets.load(data.src)

			// Vérifie si des données d'atlas sont fournies pour la texture
			if (data.atlasData) {
				// Ajoute l'atlas à la gestion des assets avec un alias unique
				Assets.add({
					alias: `atlas-${ data.name }`, // Crée un alias basé sur le nom de la texture
					src: data.atlasData, // Source de l'atlas
					data: { texture: texture } // Associe la texture chargée à l'atlas
				})

				// Charge l'atlas nouvellement ajouté
				const sheet = await Assets.load(`atlas-${ data.name }`)

				// Stocke la texture et l'atlas dans l'assetArray
				this.assetArray[ data.name ] = {
					texture: texture,
					sheet: sheet // Stocke la feuille d'atlas en plus de la texture
				}
			} else {
				// Si aucune atlas n'est fournie, stocke uniquement la texture
				this.assetArray[ data.name ] = {
					texture: texture,
				}
			}
		})

		// Log des promesses de chargement et de l'état actuel des textures chargées
		console.log("TextureLoader promises", this.assetArray)

		// Attendre que toutes les promesses soient résolues avant de retourner l'assetArray
		await Promise.all(promises)
		return this.assetArray // Retourne l'objet contenant toutes les textures chargées
	}
}
