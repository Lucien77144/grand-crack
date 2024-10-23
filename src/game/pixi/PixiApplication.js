import * as PIXI from "pixi.js"
import {ZoomBlurFilter} from "pixi-filters";
import Axis from "axis-api";
import {lerp} from "@/utils/maths";
import gsap from "gsap";
import {Game} from "@/game/Game";

export default class PixiApplication {
	static instance

	constructor() {
		if (PixiApplication.instance) {
			return PixiApplication.instance
		}
		PixiApplication.instance = this
		console.log("init")
	}

	async init(wrapper, color = "#000") {
		this.app = new PIXI.Application()
		await this.app.init({resizeTo: window,}).then(() => {
			wrapper.appendChild(this.app.canvas)
			this.canvas = this.app.canvas
		})

		await PIXI.Assets.load("/assets/img/background.jpg");
		// change background with an image /assets/img/office.webp
		const assets = PIXI.Assets.get("/assets/img/background.jpg")
		// get ratio of image
		const ratio = assets.width / assets.height
		const slide = new PIXI.Sprite(assets)
		if (innerWidth / innerHeight > ratio) {
			slide.width = window.innerWidth
			slide.height = window.innerWidth / ratio
		} else {
			slide.width = window.innerHeight * ratio
			slide.height = window.innerHeight
		}
		slide.x = window.innerWidth / 2 - slide.width / 2
		this.app.stage.addChild(slide)


		// create custom filter

		const game = new Game()


		const filter = new ZoomBlurFilter({
			strength: 0.01, center: {x: window.innerWidth / 2, y: window.innerHeight / 2},
		})

		this.app.stage.filters = [filter]
		let targetStrength = 0
		let block = true

		setTimeout(() => {
			block = false
			setTimeout(() => {
				gsap.to([".bumper-left", ".bumper-right"], {
					x: 0,
				})
			}, 5000)
		}, 10000)
		gsap.set(".bumper-left", {
			x: -100,
		})
		gsap.set(".bumper-right", {
			x: 100,
		})

		let leftClick = false
		let rightClick = false

		const resetBump = () => {
			if (leftClick && rightClick) {
				game.soundManager.playSingleSound("sniff", 1)
				targetStrength = 0
				leftClick = false
				rightClick = false

				gsap.to([".bumper-left img:nth-child(2)", ".bumper-right img:nth-child(2)"], {
					duration: 0.5, x: 0,
				})

				block = true

				gsap.to(".bumper-left", {
					x: -100,
				})
				gsap.to(".bumper-right", {
					x: 100,
				})
				setTimeout(() => {
					block = false
					setTimeout(() => {
						gsap.to([".bumper-left", ".bumper-right"], {
							x: 0,
						})
					}, 5000)
				}, 10000)
			}
		}

		const buttonA = Axis.buttonManager.getButton("w", 1) // Récupère le bouton en fonction de la touche et de l'ID du joueur.
		buttonA.addEventListener("keydown", () => {
			gsap.set(".bumper-left img:nth-child(2)", {x: 0})
			gsap.to(".bumper-left img:nth-child(2)", {
				duration: 0.5, x: -10,
			})
			leftClick = true
			resetBump()
		})

		const buttonB = Axis.buttonManager.getButton("w", 2) // Récupère le bouton en fonction de la touche et de l'ID du joueur.
		buttonB.addEventListener("keydown", () => {
			gsap.set(".bumper-right img:nth-child(2)", {x: 0})
			gsap.to(".bumper-right img:nth-child(2)", {
				duration: 0.5, x: -10,

			})
			rightClick = true

			resetBump()
		})
		let latestTime = 0
		const update = () => {

			const currentTime = performance.now()
			const delta = currentTime - latestTime
			targetStrength += 0.00001 * delta
			if (block) targetStrength = 0
			if (targetStrength > 0.1) targetStrength = 0.1
			filter.strength = lerp(filter.strength, targetStrength, 0.01 * delta)
			latestTime = currentTime
			requestAnimationFrame(update)
		}
		update()


	}

	appendToStage(elt) {
		this.app.stage.addChild(elt)
	}
}
