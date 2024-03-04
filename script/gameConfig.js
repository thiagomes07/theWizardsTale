const config = {
	type: Phaser.AUTO,
	width: 900,
	height: 600,
	parent: "wizardGame", // atribui o canvas do jogo a um elemento HTML
	physics: {
		default: 'arcade',
		arcade: {
			enableBody: true,
		}
	},
	scene: [GameStart, GamePlay] // cenas do jogo
};

const game = new Phaser.Game(config);