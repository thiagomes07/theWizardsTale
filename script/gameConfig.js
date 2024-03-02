const config = {
	type: Phaser.AUTO,
	width: 900,
	height: 600,
	parent: "wizardGame", 
	physics: {
		default: 'arcade',
		arcade: {
			enableBody: true,
			//debug: true,
		}
	},
	scene: [GameStart, GamePlay]
};

const game = new Phaser.Game(config);