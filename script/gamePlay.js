class GamePlay extends Phaser.Scene {
  constructor() {
    super({ key: "GamePlay" });

    this.water;

    this.wizard;
    this.velocityX = 1000;
    this.velocityY = 1000;
    this.isCollecting = false;

    this.monsters;
    
    this.coins;

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

    this.load.spritesheet("coin", "../assets/coin.png", {
      frameWidth: 200,
      frameHeight: 171,
    });

    this.load.spritesheet("monsterIdle1", "../assets/monsterIdle1.png", {
      frameWidth: 1422,
      frameHeight: 1131,
    });

    this.load.spritesheet("monsterIdle2", "../assets/monsterIdle2.png", {
      frameWidth: 805,
      frameHeight: 899,
    });

    this.load.spritesheet("monsterIdle3", "../assets/monsterIdle3.png", {
      frameWidth: 563,
      frameHeight: 681,
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

    map.createLayer("grass", tilesetGrass, 0, 0);
    this.water = map.createLayer("water", tilesetWater, 0, 0);
    map.createLayer("flora", tilesetFlora, 0, 0);

    this.water.setCollisionByProperty({ collider: true });

    this.wizard = this.physics.add
      .sprite(3150, 2100, "wizardWalk")
      .setScale(1.25)
      .setSize(37, 60)
      .setOffset(20, 8);

    this.physics.add.collider(this.wizard, this.water); // Adiciona colisão entre o mago e a água

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

    this.anims.create({
      key: "monsterIdle1",
      frames: this.anims.generateFrameNumbers("monsterIdle1", {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "monsterIdle2",
      frames: this.anims.generateFrameNumbers("monsterIdle2", {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "monsterIdle3",
      frames: this.anims.generateFrameNumbers("monsterIdle3", {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "coin",
      frames: this.anims.generateFrameNumbers("coin", {
        start: 0,
        end: 5,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.wizard.anims.play("wizardIdle", true);

    this.physics.world.setBounds(0, 0, 6300, 4200);
    this.cameras.main.setBounds(0, 0, 6300, 4200);
    this.cameras.main.startFollow(this.wizard, true, 0.2, 0.2);

    this.keyboard = this.input.keyboard.createCursorKeys();

    this.monsters = this.physics.add.group();

    this.physics.add.collider(this.monsters, this.water);
    this.physics.add.overlap(
      this.wizard,
      this.monsters,
      () => {
        //colisão do mago com monstros
      },
      null,
      this
    );

    for (let i = 0; i < 250; i++) {
      this.createMonster();
    }
  }

  update() {
    this.wizardMovement();

    this.monsters.children.iterate((monster) => {
      let velocityX = Phaser.Math.Between(10, 50);
      let velocityY = Phaser.Math.Between(10, 50);

      if (monster.body.position.x <= 64) monster.setVelocityX(velocityX);
      if (monster.body.position.x >= 6210) monster.setVelocityX(-velocityX);
      if (monster.body.position.y <= 64) monster.setVelocityY(velocityY);
      if (monster.body.position.y >= 4125) monster.setVelocityY(-velocityY);
    });
  }

  wizardMovement() {
    this.wizard.setVelocityX(0);
    this.wizard.setVelocityY(0);

    // Movimento horizontal
    if (this.keyboard.right.isDown) {
      this.wizard.setFlipX(false).setOffset(20, 8);
      this.wizard.setVelocityX(this.velocityX);
    } else if (this.keyboard.left.isDown) {
      this.wizard.setFlipX(true).setOffset(12, 8);
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
    if (
      this.isCollecting &&
      this.wizard.anims.currentAnim.key === "wizardCollect" &&
      this.wizard.anims.isPlaying
    ) {
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

  collectCoin() {}
  createCoin() {}

  createMonster() {
    let positionX = Phaser.Math.Between(65, 6239);
    let positionY = Phaser.Math.Between(65, 4159);
    let velocityX = Phaser.Math.Between(10, 50);
    let velocityY = Phaser.Math.Between(10, 50);
    let monsterId = Phaser.Math.Between(1, 3);
    let isNegativeX = Phaser.Math.Between(0, 1);
    let isNegativeY = Phaser.Math.Between(0, 1);
    let scale;
    let sizeX;
    let sizeY;

    switch (monsterId) {
      case 1:
        scale = 0.03;
        sizeX = 1000;
        sizeY = 700;
        break;
      case 2:
        scale = 0.0425;
        sizeX = 650;
        sizeY = 800;
        break;
      case 3:
        scale = 0.055;
        sizeX = 450;
        sizeY = 450;
        break;
    }

    if (isNegativeX) velocityX *= -1;
    if (isNegativeY) velocityY *= -1;

    let monster = this.monsters
      .create(positionX, positionY, `monsterIdle${monsterId}`)
      .setScale(scale)
      .setSize(sizeX, sizeY)
      .setVelocityX(velocityX)
      .setVelocityY(velocityY);

    this.physics.add.collider(
      monster,
      this.monsters,
      () => {
        //mudar posição se monstro colidir com monstro
        let collideVelocityX = Phaser.Math.Between(10, 50);
        let collideVelocityY = Phaser.Math.Between(10, 50);

        let collideIsNegativeX = Phaser.Math.Between(0, 1);
        let collideIsNegativeY = Phaser.Math.Between(0, 1);

        if (collideIsNegativeX) collideVelocityX *= -1;
        if (collideIsNegativeY) collideVelocityY *= -1;

        monster.setVelocityX(collideVelocityX).setVelocityY(collideVelocityY);
      },
      null,
      this
    );

    monster.anims.play(`monsterIdle${monsterId}`, true);
  }
}
