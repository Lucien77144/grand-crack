import { Game } from "@/game/Game"
import InputSet from "@/game/InputSet"
import PixiSprite from "@/game/pixi/PixiSprite"
import PixiApplication from "@/game/pixi/PixiApplication"
import { clamp } from "@/utils/maths"

export default class Player {
	constructor(id, texture) {
		this.id = id
		this.game = new Game()
		this.oxygen = 100
		this.inputSet = new InputSet(id)
		this.canMove = true
		this.holder = null

		// Variables pour l'accélération et la vélocité
		this.acceleration = 0 // Accélération initiale
		this.maxVelocity = 5 // Vélocité maximale
		this.maxAcceleration = 0.1 // Accélération maximale
		this.decelerationRate = 0.05 // Taux de décélération
		this.texture = texture
		this.joystickActive = false // Indicateur si le joystick est en mouvement
	}

	async initPixiSprite() {
		const pixiApplication = new PixiApplication()
		this.pixiSprite = new PixiSprite(this.texture, 0, 0, 5, [0.5, 0.5])
		await this.pixiSprite.init().then((sprite) => {
			pixiApplication.appendToStage(sprite)
		})
	}

	// Fonction appelée quand il y a un mouvement du joystick
	joystickEvent(e) {
		const xInput = e.position.x
		const yInput = e.position.y

		if (this.pixiSprite && this.canMove && xInput !== 0 && yInput !== 0) {
			this.joystickActive = true // On active le joystick
			// Applique l'accélération tant que le joystick est en mouvement
			this.acceleration = Math.min(this.acceleration + this.maxAcceleration, this.maxVelocity)

			const x = this.acceleration * xInput
			const y = this.acceleration * yInput
			this.pixiSprite.addVecPos(x, -y)
		}
		else{
			this.joystickActive = false // On active le joystick
		}
	}

	// Mise à jour régulière
	update(dt, t) {
		// Gestion de l'oxygène (cela reste inchangé)
		this.addOxygen(-dt / 60)

		// Si le joystick n'est pas actif, on décélère
		if (!this.joystickActive && this.acceleration > 0) {
			this.acceleration = Math.max(this.acceleration - this.decelerationRate, 0)
		}

		// Quand le joystick est relâché (position neutre), on arrête la vélocité
		if (this.joystickActive && this.acceleration === 0) {
			this.velocity = 0
		}

		// On remet l'indicateur à false pour le prochain cycle
		this.joystickActive = false
	}

	// Ajout des listeners d'inputs
	addInputsListener() {
		this.inputSet.addEventJoystick(this.joystickEvent.bind(this), this)
		this.inputSet.addEvent("a", this.eventInputA, this)
	}

	// Gère l'oxygène du joueur
	addOxygen(value) {
		this.oxygen += value
		this.oxygen = clamp(this.oxygen, 0, 100)
	}

	// Exemple d'un autre événement
	eventInputA(e) {
		this.addOxygen(10)
		console.log("click")
	}
}
