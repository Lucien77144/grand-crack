import { Howl } from "howler";

export default class SoundManager {
	static instance;
	isPlaying = null;
	hasStarted = null;
	soundsList = null;
	currentSound = null;

	constructor() {
		if (SoundManager.instance) {
			return SoundManager.instance;
		}
		this.hasStarted = false;
		const snds = this.loadSounds();

		SoundManager.instance = this;
	}

	async startXp(key,volume = 0.5, animationStart = null) {
		// Définit l'état des sons
		if(!this.hasStarted){
			this.hasStarted = true;
			this.soundsList[key].volume(0);
			this.soundsList[key].play();
			this.soundsList[key].fade(0, volume, 500);
			console.log(this.soundsList[key],"start")
			this.currentSound = this.soundsList[key];
			this.isPlaying = true;
			if (animationStart) {
				animationStart();
			}
		}

	}

	transitionMusic(room) {
		if (this.currentSound) {
			this.currentSound.fade(0.1, 0, 1000);
			this.currentSound.stop(); // Arrête l'instance audio actuelle
		}

		if (this.soundsList[room]) {
			this.soundsList[room].play();
			if (this.isPlaying) {
				this.soundsList[room].fade(0, 0.1, 1000);
			}
			this.currentSound.current = this.soundsList[room];
		}
	}

	toggleSound(animationStop, animationStart) {
		if (this.soundsList) {
			if (this.isPlaying) {
				for (const [key, value] of Object.entries(this.soundsList)) {
					this.soundsList[key].fade(0.1, 0, 500);
				}
				animationStop();
			} else {
				animationStart();
				for (const [key, value] of Object.entries(this.soundsList)) {
					this.soundsList[key].fade(0, 0.1, 500);
				}
			}
			this.isPlaying = !this.isPlaying;
		}
	}

	playSingleSound(sound, volume = 0.15) {
		if (this.soundsList && this.isPlaying && this.soundsList[sound]){
			console.log(sound,"test")
			this.soundsList[sound].volume(volume);
			this.soundsList[sound].play();
		}
	}

	stopSingleSound(sound) {
		if (this.soundsList && this.isPlaying && this.soundsList[sound]) {
			this.soundsList[sound].fade(this.soundsList[sound]._volume, 0, 1000);
			this.soundsList[sound].stop();
		}
	}
	async loadSounds() {
		const tmp = {};

		const loadAudio = async (key, src, volume, loop = false) => {
			tmp[key] = new Howl({
				src: [src],
				loop: loop,
				volume: volume,
			});
		};

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

		this.soundsList = tmp;
	}
}
