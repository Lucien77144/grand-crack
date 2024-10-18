import Axis from "axis-api"

export default class InputSet {
	constructor(idPlayer) {
		this.idPlayer = idPlayer
		this.currentPlayer = idPlayer === 1 ? InputSet.player1 : InputSet.player2
	}

	addEvent(key, callback, context, event = "keydown") {
		const buttonA = Axis.buttonManager.getButton(key, this.idPlayer)
		buttonA.addEventListener(event, callback.bind(context))
	}

	removeEventA(key, callback, context, event = "keydown") {
		const buttonA = Axis.buttonManager.getButton(key, this.idPlayer)
		buttonA.removeEventA(event, callback.bind(context))
	}

	addEventJoystick(callback, context) {
		this.currentPlayer.addEventListener("joystick:move", callback.bind(context))
	}

	static emulateKeyboard() {
		//First Group
		Axis.registerKeys("a", "a", 1)
		Axis.registerKeys("z", "x", 1)
		Axis.registerKeys("e", "i", 1)
		Axis.registerKeys("r", "s", 1)
		Axis.registerKeys("t", "w", 1)

		//Second Group
		Axis.registerKeys("u", "a", 2)
		Axis.registerKeys("i", "x", 2)
		Axis.registerKeys("o", "i", 2)
		Axis.registerKeys("p", "s", 2)
		Axis.registerKeys("^", "w", 2)
	}

	static emulateGamePad() {
		InputSet.gamepadEmulatorPlayer1 = Axis.createGamepadEmulator(0) // 0 is gamepad index, often represents the first gamepad connected to your computer
		InputSet.gamepadEmulatorPlayer2 = Axis.createGamepadEmulator(1) // 0 is gamepad index, often represents the first gamepad connected to your computer

		Axis.joystick1.setGamepadEmulatorJoystick(InputSet.gamepadEmulatorPlayer1, 0) // 0 is the joystick index of the gamepad, often the one on the left side
		Axis.joystick2.setGamepadEmulatorJoystick(InputSet.gamepadEmulatorPlayer2, 0) // 0 is the joystick index of the gamepad, often the one on the left side

		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer1, 0, "a", 1) // Gamepad button index 0 (PS4 X) to button "a" from group 1
		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer1, 1, "x", 1) // Gamepad button index 1 (PS4 Square) to button "x" from group 1
		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer1, 2, "i", 1) // Gamepad button index 2 (PS4 Circle) to button "i" from group 1
		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer1, 3, "s", 1) // Gamepad button index 3 (PS4 Triangle) to button "s" from group 1

		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer2, 0, "a", 1) // Gamepad button index 0 (PS4 X) to button "a" from group 1
		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer2, 1, "x", 1) // Gamepad button index 1 (PS4 Square) to button "x" from group 1
		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer2, 2, "i", 1) // Gamepad button index 2 (PS4 Circle) to button "i" from group 1
		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer2, 3, "s", 1) // Gamepad button index 3 (PS4 Triangle) to button "s" from group 1
	}

	static initPlayersInputs() {
		InputSet.player1 = Axis.createPlayer({
			id: 1,
			joysticks: Axis.joystick1,
			buttons: Axis.buttonManager.getButtonsById(1), // Give player 1 all buttons from group 1
		})


		InputSet.player2 = Axis.createPlayer({
			id: 2,
			joysticks: Axis.joystick2,
			buttons: Axis.buttonManager.getButtonsById(2), // Give player 1 all buttons from group 2
		})
	}

	static normalizeJoystickInput(x, y) {
		// Calculer la magnitude
		const magnitude = Math.sqrt(x * x + y * y)

		// Vérifier si la magnitude est supérieure à 0 pour éviter de diviser par 0
		if (magnitude > 0) {
			return {
				x: x / magnitude,
				y: y / magnitude
			}
		} else {
			// Si magnitude est 0, on retourne un vecteur nul
			return { x: 0, y: 0 }
		}
	}

	static update() {
		if (InputSet.gamepadEmulatorPlayer1) {
			InputSet.gamepadEmulatorPlayer1.update()
		}
		if (InputSet.gamepadEmulatorPlayer2) {
			InputSet.gamepadEmulatorPlayer2.update()
		}
	}
}
