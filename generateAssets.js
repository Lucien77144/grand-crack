const fs = require("fs")
const path = require("path")

function generateAssets() {
	const assetsPath = path.join(__dirname, "public", "assets")
	const items = []

	const assetsFolders = fs.readdirSync(assetsPath)

	assetsFolders.forEach((assetFolder) => {
		const folderPath = path.join(assetsPath, assetFolder)

		if (assetFolder === "audios" || assetFolder === "textures") {
			const subFolders = fs.readdirSync(folderPath)

			subFolders.forEach((subFolder) => {
				const stat = fs.statSync(path.join(folderPath, subFolder))

				if (stat.isDirectory()) {
					const files = fs.readdirSync(path.join(folderPath, subFolder))

					files.forEach((file) => {
						if (file === ".DS_Store") return

						const obj = createAssetObject(assetFolder, subFolder, file)
						if (obj) items.push(obj)
					})
				} else {
					const obj = createAssetObject(assetFolder, "", subFolder)
					if (obj) items.push(obj)
				}
			})
		}
	})

	return items
}

function createAssetObject(assetFolder, subFolder, file) {
	const fileExtension = file.split(".").pop()
	const fileName = file.split(".").shift()

	if (fileName === "") return

	return {
		name: `${subFolder ? subFolder + "-" : ""}${fileName}`,
		source: "/assets/" + path.join(assetFolder, subFolder, file),
		type: assetFolder === "audios" ? "audio" : "texture",
	}
}

const assetsArray = generateAssets()
const assetsFilePath = path.join(__dirname, "src", "webgl", "Experience", "assets.js")

fs.writeFileSync(
	assetsFilePath,
	`// NOTE - This file is auto-generated when running 'npm run gen'
/* eslint-disable */
export default [
	{
		name: "base",
		data: {},
		items: ${JSON.stringify(assetsArray, null, "\t")}
	},
]
`,
)

console.log("Assets generated successfully!")
