class GamePlay extends Phaser.Scene {
  constructor() {
    super({ key: "GamePlay" });

    this.wizard;
    this.velocityX = 200;
    this.velocityY = 200;
    this.isCollecting = false;

    this.keyboard;
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

    this.load.image("grass", "../assets/wizardMap/grass.png");
    this.load.image("water", "../assets/wizardMap/water.png");
    this.load.image("flora", "../assets/wizardMap/flora.png");
    this.load.tilemapTiledJSON("map", "../assets/wizardMap/map.json");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tilesetGrass = map.addTilesetImage("grass", "grass");
    const tilesetWater = map.addTilesetImage("water", "water");
    const tilesetFlora = map.addTilesetImage("flora", "flora");

    const ground = map.createLayer("grass", tilesetGrass, 0, 0);
    const water = map.createLayer("water", tilesetWater, 0, 0);
    const flora = map.createLayer("flora", tilesetFlora, 0, 0);

    water.setCollisionByProperty({ collider: true });

    this.wizard = this.physics.add
      .sprite(3150, 2100, "wizardWalk")
      .setScale(1.25)
      .setSize(40, 60);

    this.physics.add.collider(this.wizard, water);

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
      frameRate: 7,
      repeat: 0,
    });

    this.wizard.anims.play("wizardIdle", true);

    this.physics.world.setBounds(0, 0, 6300, 4200);
    this.cameras.main.setBounds(0, 0, 6300, 4200);
    this.cameras.main.startFollow(this.wizard, true, 0.2, 0.2);

    this.keyboard = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.wizard.setVelocityX(0);
    this.wizard.setVelocityY(0);

    // Movimento horizontal
    if (this.keyboard.right.isDown) {
      this.wizard.setFlipX(false);
      this.wizard.setVelocityX(this.velocityX);
    } else if (this.keyboard.left.isDown) {
      this.wizard.setFlipX(true);
      this.wizard.setVelocityX(-this.velocityX);
    }

    // Movimento vertical
    if (this.keyboard.down.isDown) {
      this.wizard.setVelocityY(this.velocityY);
    } else if (this.keyboard.up.isDown) {
      this.wizard.setVelocityY(-this.velocityY);
    }

    // Verificar se há movimento horizontal ou vertical antes de iniciar a animação
    const isMovingHorizontal =
      this.keyboard.left.isDown || this.keyboard.right.isDown;
    const isMovingVertical =
      this.keyboard.up.isDown || this.keyboard.down.isDown;

    if ((isMovingHorizontal || isMovingVertical) && !this.isCollecting) {
      this.wizard.anims.play("wizardWalk", true);
    } else if (!this.isCollecting) {
      this.wizard.anims.play("wizardIdle", true);
    }

    // Lógica da animação de coleta
    if (this.keyboard.space.isDown && !this.isCollecting) {
      this.wizard.anims.play("wizardCollect", true);
      this.isCollecting = true;
    }

    // Verificar se a animação de coleta foi concluída
    if (this.isCollecting && this.wizard.anims.currentAnim.key === "wizardCollect" && this.wizard.anims.isPlaying) {
      this.wizard.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        function () {
          console.log("asas");
          this.isCollecting = false;
          this.wizard.anims.play("wizardIdle", true);
        },
        this
      );
    }
  }
}
