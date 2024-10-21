import { Howl } from "howler";

/**
 * Classe SoundManager - Gère les sons du jeu avec la bibliothèque Howler.
 */
export default class SoundManager {
	static instance;
	isPlaying = null; // Indique si un son est en cours de lecture.
	hasStarted = null; // Indique si la lecture des sons a commencé.
	soundsList = null; // Contient la liste des sons chargés.
	currentSound = null; // Référence au son actuellement en cours de lecture.

	/**
	 * Constructeur de la classe SoundManager.
	 * Utilise un singleton pour s'assurer qu'une seule instance de SoundManager existe.
	 */
	constructor() {
		if (SoundManager.instance) {
			return SoundManager.instance; // Retourne l'instance existante si elle a déjà été créée.
		}
		this.hasStarted = false;
		const snds = this.loadSounds(); // Charge les sons dans la liste.

		SoundManager.instance = this; // Définit l'instance de singleton.
	}

	/**
	 * Démarre un son spécifique avec un fondu entrant (fade in).
	 *
	 * @param {string} key - Clé du son à jouer dans la liste.
	 * @param {number} volume - Le volume auquel jouer le son (par défaut 0.5).
	 * @param {Function} animationStart - Callback optionnel à appeler lorsque le son commence.
	 */
	async startXp(key, volume = 0.5, animationStart = null) {
		// Vérifie si la lecture a déjà démarré
		if (!this.hasStarted) {
			this.hasStarted = true;
			this.soundsList[key].volume(0); // Démarre le son avec un volume à 0.
			this.soundsList[key].play(); // Joue le son.
			this.soundsList[key].fade(0, volume, 500); // Applique un fondu jusqu'au volume souhaité.
			console.log(this.soundsList[key], "start");
			this.currentSound = this.soundsList[key]; // Stocke le son actuellement joué.
			this.isPlaying = true;
			if (animationStart) {
				animationStart(); // Lance l'animation de démarrage si spécifiée.
			}
		}
	}

	/**
	 * Transition entre le son en cours et un autre, avec un fondu sortant (fade out) sur l'actuel.
	 *
	 * @param {string} room - Clé du son vers lequel effectuer la transition.
	 */
	transitionMusic(room) {
		if (this.currentSound) {
			this.currentSound.fade(0.1, 0, 1000); // Applique un fondu pour réduire le volume.
			this.currentSound.stop(); // Arrête le son actuel après le fondu.
		}

		if (this.soundsList[room]) {
			this.soundsList[room].play(); // Joue le son de la nouvelle pièce.
			if (this.isPlaying) {
				this.soundsList[room].fade(0, 0.1, 1000); // Applique un fondu pour introduire le nouveau son.
			}
			this.currentSound.current = this.soundsList[room]; // Met à jour le son actuellement joué.
		}
	}

	/**
	 * Active ou désactive tous les sons, avec des animations facultatives pour chaque état.
	 *
	 * @param {Function} animationStop - Animation à exécuter lorsque les sons sont arrêtés.
	 * @param {Function} animationStart - Animation à exécuter lorsque les sons redémarrent.
	 */
	toggleSound(animationStop, animationStart) {
		if (this.soundsList) {
			if (this.isPlaying) {
				for (const [key, value] of Object.entries(this.soundsList)) {
					this.soundsList[key].fade(0.1, 0, 500); // Diminue progressivement le volume des sons.
				}
				animationStop(); // Exécute l'animation d'arrêt.
			} else {
				animationStart(); // Exécute l'animation de démarrage.
				for (const [key, value] of Object.entries(this.soundsList)) {
					this.soundsList[key].fade(0, 0.1, 500); // Augmente progressivement le volume des sons.
				}
			}
			this.isPlaying = !this.isPlaying; // Inverse l'état de lecture des sons.
		}
	}

	/**
	 * Joue un son unique à un volume donné.
	 *
	 * @param {string} sound - Clé du son à jouer.
	 * @param {number} volume - Le volume auquel jouer le son (par défaut 0.15).
	 */
	playSingleSound(sound, volume = 0.15) {
		if (this.soundsList && this.isPlaying && this.soundsList[sound]) {
			console.log(sound, "test");
			this.soundsList[sound].volume(volume); // Définit le volume du son.
			this.soundsList[sound].play(); // Joue le son.
		}
	}

	/**
	 * Arrête un son spécifique avec un fondu sortant (fade out).
	 *
	 * @param {string} sound - Clé du son à arrêter.
	 */
	stopSingleSound(sound) {
		if (this.soundsList && this.isPlaying && this.soundsList[sound]) {
			this.soundsList[sound].fade(this.soundsList[sound]._volume, 0, 1000); // Diminue progressivement le volume avant d'arrêter.
			this.soundsList[sound].stop(); // Arrête le son.
		}
	}

	/**
	 * Charge les sons nécessaires au jeu et les stocke dans une liste.
	 */
	async loadSounds() {
		const tmp = {};

		/**
		 * Fonction utilitaire pour charger un son.
		 *
		 * @param {string} key - Clé du son à charger.
		 * @param {string} src - Chemin du fichier son.
		 * @param {number} volume - Volume initial du son.
		 * @param {boolean} loop - Si le son doit boucler ou non.
		 */
		const loadAudio = async (key, src, volume, loop = false) => {
			tmp[key] = new Howl({
				src: [src], // Chemin du fichier audio.
				loop: loop, // Détermine si le son doit boucler.
				volume: volume, // Volume initial du son.
			});
		};

		// Chargement des sons dans la liste.
		await Promise.all([
			loadAudio("music", "/assets/sounds/music.mp3", 0, true),
			loadAudio("cutting0", "/assets/sounds/cutting01.mp3", 0, false),
			loadAudio("cutting1", "/assets/sounds/cutting02.mp3", 0, false),
			loadAudio("cutting2", "/assets/sounds/cutting03.mp3", 0, false),
			loadAudio("hold", "/assets/sounds/hold.mp3", 0, false),
			loadAudio("mixing", "/assets/sounds/mixing.mp3", 0, true),
			loadAudio("bake", "/assets/sounds/bake.mp3", 0, false),
			loadAudio("recipeComplete", "/assets/sounds/recipeComplete.mp3", 0, false),
		]);

		this.soundsList = tmp; // Assigne la liste temporaire des sons à la liste de la classe.
	}
}
