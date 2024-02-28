class GamePlay extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.spritesheet("wizardIdle", "../assets/wizardIdle.png", {
      frameWidth: 70,
      frameHeight: 70,
    });

    this.load.spritesheet("wizardWalk", "../assets/wizardWalk.png", {
      frameWidth: 70,
      frameHeight: 70,
    });

    this.load.spritesheet("wizardCollect", "../assets/wizardCollect.png", {
      frameWidth: 70,
      frameHeight: 166,
    });

    this.load.tilemapTiledJSON("map", "./assets/map/map.json");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tilesetGrass = map.addTilesetImage("grass", "tiles");
    const tilesetWater = map.addTilesetImage("water", "border");

    const ground = map.createLayer("grass", tilesetGrass, 0, 0);

    const wizard = this.physics.add.sprite(400, 400, "wizardWalk").setScale(3);

    this.anims.create({
      key: "wizardIdle",
      frames: this.anims.generateFrameNumbers("wizardIdle", {
        start: 0,
        end: 2,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "wizardWalk",
      frames: this.anims.generateFrameNumbers("wizardWalk", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "wizardCollect",
      frames: this.anims.generateFrameNumbers("wizardCollect", {
        start: 0,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });

    wizard.anims.play("wizardIdle", true);
  }

  update() {}
}
