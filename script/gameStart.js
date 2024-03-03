class GameStart extends Phaser.Scene {
  constructor() {
    super({ key: "GameStart" });
  }

  create() {
    this.add.text(150, 250, "Click to start!", {
      fill: "#ffffff",
      fontSize: "20px",
    });
    //this.input.on('pointerdown', () => {
    this.cameras.main.fade(500, 0, 0, 0);
    this.time.delayedCall(
      1000,
      function () {
        this.scene.start("GamePlay");
      },
      [],
      this
    );
    //})
  }
}
