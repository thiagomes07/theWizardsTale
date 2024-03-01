class GameStart extends Phaser.Scene {
	constructor() {
		super({ key: 'GameStart' })
	}

	create() {
		this.add.text( 150, 250, 'Click to start!', {fill: '#ffffff', fontSize: '20px'})
		//this.input.on('pointerdown', () => {
			this.scene.start('GamePlay')
		//})
	}
}
