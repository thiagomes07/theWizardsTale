class GameStart extends Phaser.Scene {
  constructor() {
    super({ key: "GameStart" });
  }

  preload() {
    this.load.image("background", "../assets/scene1/background.jpg");
    this.load.image("gameTitle", "../assets/scene1/gameTitle.png");
    this.load.image("play", "../assets/scene1/play.png");
    this.load.image("rulesText", "../assets/scene1/rulesText.png");
  }

  create() {
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;

    this.add.image(0, 0, "background").setOrigin(0, 0);
    const gameTitle = this.add.image(gameWidth / 2, 150, "gameTitle");
    const playBtn = this.add.image(gameWidth / 2, 350, "play").setInteractive();
    const rulesText = this.add
      .image(0, 0, "rulesText")
      .setOrigin(0, 0)
      .setVisible(false);

    playBtn.on("pointerover", () => {
      playBtn.setScale(1.1).setTint("0x999999");
      this.input.setDefaultCursor("pointer");
    });

    playBtn.on("pointerout", () => {
      playBtn.setScale(1).setTint("0xffffff");
      this.input.setDefaultCursor("default");
    });

    playBtn.on("pointerdown", () => {
      playBtn.setScale(1).setTint("0xffffff");
      this.input.setDefaultCursor("default");
      gameTitle.setVisible(false);
      playBtn.setVisible(false);
      rulesText.setVisible(true);
      this.input.keyboard.on(
        "keydown",
        (event) => {
          this.cameras.main.fade(500, 0, 0, 0);
          this.time.delayedCall(
            1000,
            function () {
              this.scene.start("GamePlay");
            },
            [],
            this
          );
        },
        this
      );
    });
  }
}
