import { CookingStation } from "./CookingStation"

export class Cutter extends CookingStation {
	currentClicks = 0
	steps = null

	constructor({ ...props }) {
		super({ ...props })
		this.timeLimit = 5000
	}

	startTimer() {
		this.steps = this.sprite.totalFrames

		const inputSet1 = this.game.player1.inputSet
		inputSet1.addEvent("i", this.onPressButton, this)

		const inputSet2 = this.game.player2.inputSet
		inputSet2.addEvent("i", this.onPressButton, this)

		this.timer = setTimeout(() => {
			if (this.currentClicks < this.steps) this.fail()
		}, this.cookingTime)
	}

	onPressButton(e) {
		console.log(e)

		if (this.currentClicks >= this.steps) return

		this.currentClicks++
		this.sprite.gotoAndStop(this.currentClicks)

		if (this.currentClicks === this.steps) this.success()
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
