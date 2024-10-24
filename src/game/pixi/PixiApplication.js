import * as PIXI from "pixi.js"
import { ZoomBlurFilter } from "pixi-filters"
import Axis from "axis-api"
import { lerp } from "@/utils/maths"
import gsap from "gsap"
import { Game } from "@/game/Game"

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
		await this.app.init({ resizeTo: window, }).then(() => {
			wrapper.appendChild(this.app.canvas)
			this.canvas = this.app.canvas
		})

		await PIXI.Assets.load("/assets/img/background.jpg")
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

		gsap.set(".bumper-left", {
			x: -400,
		})
		gsap.set(".bumper-right", {
			x: 400,
		})
	}

	startCoke() {
		const game = new Game()


		const filter = new ZoomBlurFilter({
			strength: 0, center: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
		})

		this.app.stage.filters = [ filter ]
		let targetStrength = 0
		let block = true

		let leftPressed = false
		const leftCoke = document.querySelector(".bumper-left img:nth-child(2)")

		let rightPressed = false
		const rightCoke = document.querySelector(".bumper-right img:nth-child(2)")

		let progress = 0
		let activeSide = ""
		let timeout = 30000


		const handleRandom = () => {
			setTimeout(() => {
				const randomSide = Math.random() > .5 ? "left" : "right"
				activeSide = randomSide
				block = false
				gsap.to([ `.bumper-${ randomSide }` ], {
					x: 0,
					delay: 1
				})
			}, timeout)
		}
		handleRandom()

		const buttonA = Axis.buttonManager.getButton("w", 1) // Récupère le bouton en fonction de la touche et de l'ID du joueur.
		buttonA.addEventListener("keydown", () => {
			if (activeSide === "left" && !leftPressed) {
				game.soundManager.playSingleSound("sniff", 1)
			}
			leftPressed = true
		})
		buttonA.addEventListener("keyup", () => {
			leftPressed = false
		})

		const buttonB = Axis.buttonManager.getButton("w", 2) // Récupère le bouton en fonction de la touche et de l'ID du joueur.
		buttonB.addEventListener("keydown", () => {
			if (activeSide === "right" && !rightPressed) {
				game.soundManager.playSingleSound("sniff", 1)
			}
			rightPressed = true
		})
		buttonB.addEventListener("keyup", () => {
			rightPressed = false
		})

		const handleReset = () => {
			progress = 0
			leftPressed = false
			rightPressed = false
			block = true
			activeSide = ""

			game.soundManager.playSingleSound("aaa", 1)
			timeout = Math.max(2000, timeout - 2000)

			gsap.to(".bumper-left", {
				x: "-100%",
				onComplete: () => {
					leftCoke.style.clipPath = `inset(0 0% 0 0)`
					rightCoke.style.clipPath = `inset(0 0% 0 0)`

					handleRandom()
				},
			})
			gsap.to(".bumper-right", {
				x: "100%",
			})
		}


		let latestTime = 0
		const update = () => {
			const currentTime = performance.now()
			const delta = currentTime - latestTime
			targetStrength += 0.00001 * delta
			if (block) targetStrength = 0
			if (targetStrength > 0.1) targetStrength = 0.1
			filter.strength = lerp(filter.strength, targetStrength, 0.01 * delta)

			if (leftPressed && activeSide === "left") {
				leftCoke.style.clipPath = `inset(0 ${ progress }% 0 0)`
				progress += 3
				targetStrength -= 0.001
				if (progress >= 100) {
					handleReset()
				}
			}
			if (rightPressed && activeSide === "right") {
				rightCoke.style.clipPath = `inset(0 ${ progress }% 0 0)`
				progress += 3
				targetStrength -= 0.001
				if (progress >= 100) {
					handleReset()
				}
			}


			latestTime = currentTime
			requestAnimationFrame(update)
		}
		update()
	}

	appendToStage(elt) {
		this.app.stage.addChild(elt)
	}
}
