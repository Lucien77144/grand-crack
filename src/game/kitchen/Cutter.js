import { CookingStation } from "./CookingStation"
import PixiSprite from "@/game/pixi/PixiSprite";

export class Cutter extends CookingStation {
	currentClicks = 0
	amount = 5

	constructor({ ...props }) {
		super({ ...props })
		this.timeLimit = 5000
		this.action = "cut"
	}

	startTimer() {
		// TODO! - Replace this by AXIS input
		this.sprite.interactive = true
		this.sprite.buttonMode = true

		this.sprite.on("pointerdown", () => {
			if (this.currentClicks >= this.amount) return

			this.currentClicks++
			this.sprite.gotoAndStop(this.currentClicks)

			if (this.currentClicks === this.amount) this.__success()
		})

		this.timer = setTimeout(() => {
			if (this.currentClicks < this.amount) this.__fail()
		}, this.cookingTime)
	}

	// checkCanInteract(e){
	// 	const player = e.id === 1  ? this.game.player1 : this.game.player2;
	// 	if(!this.player && !this.ingredient){
	// 		if(player && PixiSprite.checkOverlap(player.pixiSprite.sprite,this.sprite)){
	// 			player.holdIngredient(this)
	// 			console.log("overlap P1")
	// 		}
	// 	}
	// }
	//
	// addInputOnA(){
	// 	const inputSet1 = this.game.player1.inputSet;
	// 	inputSet1.addEvent("a",this.checkCanInteract,this)
	//
	// 	const inputSet2 = this.game.player2.inputSet;
	// 	inputSet2.addEvent("a",this.checkCanInteract,this)
	// }
	//
	//
	// setCanMove(canMove){
	// 	this.canMove = canMove
	// }


}
