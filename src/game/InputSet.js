import Axis from "axis-api"

/**
 * Classe InputSet - Gère les événements d'entrée pour un joueur (clavier, manette, joystick).
 */
export default class InputSet {
	/**
	 * Constructeur de la classe InputSet.
	 *
	 * @param {number} idPlayer - L'identifiant du joueur (1 ou 2).
	 */
	constructor(idPlayer) {
		this.idPlayer = idPlayer
		this.currentPlayer = idPlayer === 1 ? InputSet.player1 : InputSet.player2
	}

	/**
	 * Ajoute un événement sur une touche ou un bouton spécifique pour un joueur.
	 *
	 * @param {string} key - La touche ou le bouton à surveiller.
	 * @param {Function} callback - La fonction à appeler lorsque l'événement se déclenche.
	 * @param {Object} context - Le contexte dans lequel la fonction callback est appelée (généralement `this`).
	 * @param {string} event - Type d'événement (par défaut "keydown").
	 */
	addEvent(key, callback, context, event = "keydown") {
		const buttonA = Axis.buttonManager.getButton(key, this.idPlayer) // Récupère le bouton en fonction de la touche et de l'ID du joueur.
		buttonA.addEventListener(event, callback.bind(context)) // Ajoute l'événement au bouton.
	}

	/**
	 * Supprime un événement d'une touche ou d'un bouton spécifique pour un joueur.
	 *
	 * @param {string} key - La touche ou le bouton à surveiller.
	 * @param {Function} callback - La fonction à retirer.
	 * @param {Object} context - Le contexte dans lequel la fonction callback a été ajoutée.
	 * @param {string} event - Type d'événement (par défaut "keydown").
	 */
	removeEventA(key, callback, context, event = "keydown") {
		const buttonA = Axis.buttonManager.getButton(key, this.idPlayer) // Récupère le bouton.
		buttonA.removeEventA(event, callback.bind(context)) // Supprime l'événement du bouton.
	}

	/**
	 * Ajoute un événement pour la détection de mouvement du joystick pour le joueur courant.
	 *
	 * @param {Function} callback - La fonction à appeler lorsque le joystick est déplacé.
	 * @param {Object} context - Le contexte dans lequel la fonction callback est appelée.
	 */
	addEventJoystick(callback, context) {
		this.currentPlayer.addEventListener("joystick:move", callback.bind(context)) // Écoute les mouvements du joystick.
	}

	static emulateKeyboard() {
		Axis.registerKeys("a", "a", 1)
		Axis.registerKeys("z", "x", 1)
		Axis.registerKeys("e", "i", 1)
		Axis.registerKeys("r", "s", 1)
		Axis.registerKeys("t", "w", 1)

		Axis.registerKeys("u", "a", 2)
		Axis.registerKeys("i", "x", 2)
		Axis.registerKeys("o", "i", 2)
		Axis.registerKeys("p", "s", 2)
		Axis.registerKeys("^", "w", 2)
	}

	static emulateGamePad() {
		InputSet.gamepadEmulatorPlayer1 = Axis.createGamepadEmulator(0)
		InputSet.gamepadEmulatorPlayer2 = Axis.createGamepadEmulator(1)

		Axis.joystick1.setGamepadEmulatorJoystick(InputSet.gamepadEmulatorPlayer1, 0)
		Axis.joystick2.setGamepadEmulatorJoystick(InputSet.gamepadEmulatorPlayer2, 0)

		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer1, 0, "a", 1)
		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer1, 1, "x", 1)
		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer1, 2, "i", 1)
		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer1, 3, "s", 1)

		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer2, 0, "a", 1)
		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer2, 1, "x", 1)
		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer2, 2, "i", 1)
		Axis.registerGamepadEmulatorKeys(InputSet.gamepadEmulatorPlayer2, 3, "s", 1)
	}

	/**
	 * Initialise les joueurs avec leurs entrées (joystick et boutons).
	 * Associe les joysticks et boutons aux joueurs correspondants.
	 */
	static initPlayersInputs() {
		// Initialisation du joueur 1 avec ses joysticks et boutons
		InputSet.player1 = Axis.createPlayer({
			id: 1,
			joysticks: Axis.joystick1, // Associe le joystick du joueur 1.
			buttons: Axis.buttonManager.getButtonsById(1), // Associe les boutons du groupe 1 au joueur 1.
		})

		// Initialisation du joueur 2 avec ses joysticks et boutons
		InputSet.player2 = Axis.createPlayer({
			id: 2,
			joysticks: Axis.joystick2, // Associe le joystick du joueur 2.
			buttons: Axis.buttonManager.getButtonsById(2), // Associe les boutons du groupe 2 au joueur 2.
		})
	}

	/**
	 * Met à jour l'état des émulateurs de manette pour chaque joueur.
	 * Cette méthode doit être appelée à chaque frame pour détecter les changements d'état des manettes.
	 */
	static update() {
		if (InputSet.gamepadEmulatorPlayer1) {
			InputSet.gamepadEmulatorPlayer1.update() // Met à jour l'état de l'émulateur de manette du joueur 1.
		}
		if (InputSet.gamepadEmulatorPlayer2) {
			InputSet.gamepadEmulatorPlayer2.update() // Met à jour l'état de l'émulateur de manette du joueur 2.
		}
	}
}
