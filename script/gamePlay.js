class GamePlay extends Phaser.Scene {
  constructor() {
    super({ key: "GamePlay" });

    this.water; // borda do jogo

    this.wizard; // personagem controlável, o mago
    this.velocityX = 200; // velocidade horizontal do mago
    this.velocityY = 200; // velocidade vertical do mago
    this.isCollecting = false; // saber se está ocorrendo a coleta de moeda

    this.monsters; // grupo de monstros
    this.coins; // grupo de moedas

    this.score = 0; // número da pontuação
    this.scoreboard; // texto informando a pontuação

    this.isGameOver = false; // saber se o jogo está em execução

    this.winGameImg; // imagem de vitória
    this.loseGameImg; // imagem de derrota
    this.restartBtn; // botão de reiniciar jogo

    this.keyboard; // mapeamento de teclas
  }

  preload() {
    this.load.spritesheet("wizardIdle", "../assets/scene2/wizardIdle.png", {
      // mago respirando
      frameWidth: 70,
      frameHeight: 70,
    });

    this.load.spritesheet("wizardWalk", "../assets/scene2/wizardWalk.png", {
      // mago andando
      frameWidth: 70,
      frameHeight: 70,
    });

    this.load.spritesheet(
      // mago coletando moeda
      "wizardCollect",
      "../assets/scene2/wizardCollect.png",
      {
        frameWidth: 70,
        frameHeight: 166,
      }
    );

    this.load.spritesheet("coin", "../assets/scene2/coin.png", {
      // moeda
      frameWidth: 200,
      frameHeight: 171,
    });

    this.load.spritesheet("monsterIdle1", "../assets/scene2/monsterIdle1.png", {
      // monstro 1
      frameWidth: 1422,
      frameHeight: 1131,
    });

    this.load.spritesheet("monsterIdle2", "../assets/scene2/monsterIdle2.png", {
      // monstro 2
      frameWidth: 805,
      frameHeight: 899,
    });

    this.load.spritesheet("monsterIdle3", "../assets/scene2/monsterIdle3.png", {
      // mosntro 3
      frameWidth: 563,
      frameHeight: 681,
    });

    this.load.image("winGame", "../assets/scene2/winGame.png"); // carrega a imagem de vitória
    this.load.image("loseGame", "../assets/scene2/loseGame.png"); // carrega a imagem de derrrota
    this.load.image("restartBtn", "../assets/scene2/restartBtn.png"); // botão de reiniciar jogo

    this.load.image("grass", "../assets/scene2/wizardMap/grass.png"); // imagem para contruir a chão do jogo
    this.load.image("water", "../assets/scene2/wizardMap/water.png"); // imagem para contruir a borda do jogo
    this.load.image("flora", "../assets/scene2/wizardMap/flora.png"); // imagem para contruir a decoração do jogo
    this.load.tilemapTiledJSON("map", "../assets/scene2/wizardMap/map.json"); // json com informações sobre a construção do mapa
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0); // transição no inívio da fase

    const map = this.make.tilemap({ key: "map" }); // cria mapa
    const tilesetGrass = map.addTilesetImage("grass", "grass"); // associa a imagem da grama com o json
    const tilesetWater = map.addTilesetImage("water", "water"); // associa a imagem da água com o json
    const tilesetFlora = map.addTilesetImage("flora", "flora"); // associa a imagem da flora com o json

    map.createLayer("grass", tilesetGrass, 0, 0); // cria uma camada no mapa para grama
    this.water = map.createLayer("water", tilesetWater, 0, 0); // cria uma camada no mapa para a borda do jogo, a água
    map.createLayer("flora", tilesetFlora, 0, 0); // cria uma camada no mapa para a decoração

    this.water.setCollisionByProperty({ collider: true }); // adiciona colisão onde houver a propriedade collider = verdadeiro

    this.wizard = this.physics.add // cria o mago
      .sprite(3150, 2100, "wizardWalk")
      .setScale(1.25) // tamanho do mago
      .setSize(37, 60) // tamanho do hitbox
      .setOffset(20, 8); // deslocamento do hitbox

    this.physics.add.collider(this.wizard, this.water); // Adiciona colisão entre o mago e a água

    this.anims.create({
      // cria a animação do mago respirando
      key: "wizardIdle",
      frames: this.anims.generateFrameNumbers("wizardIdle", {
        start: 0,
        end: 2,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      // cria a animação do mago andando
      key: "wizardWalk",
      frames: this.anims.generateFrameNumbers("wizardWalk", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      // cria a animação do mago coletando
      // !!!!!!!EFEITO ESPECIAL SOLICITADO NA ATIVIDADE!!!!!!!!!
      key: "wizardCollect",
      frames: this.anims.generateFrameNumbers("wizardCollect", {
        start: 0,
        end: 8,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      // cria a animação do monstro 1
      key: "monsterIdle1",
      frames: this.anims.generateFrameNumbers("monsterIdle1", {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      // cria a animação do monstro 2
      key: "monsterIdle2",
      frames: this.anims.generateFrameNumbers("monsterIdle2", {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      // cria a animação do monstro 3
      key: "monsterIdle3",
      frames: this.anims.generateFrameNumbers("monsterIdle3", {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      // cria a animação da moeda
      key: "coin",
      frames: this.anims.generateFrameNumbers("coin", {
        start: 0,
        end: 5,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.wizard.anims.play("wizardIdle", true); // inicia a animação mago repirando

    this.physics.world.setBounds(0, 0, 6300, 4200); // define os limites do mundo
    this.cameras.main.setBounds(0, 0, 6300, 4200); // define os limites da câmera
    this.cameras.main.startFollow(this.wizard, true, 0.2, 0.2); // configura a câmera para seguir o mago, com um pequeno atraso

    this.coins = this.physics.add.group(); // cria grupo de moedas

    this.physics.add.collider(this.coins, this.water); // cria colisão entre moedas e água

    this.monsters = this.physics.add.group(); // cria grupo de monstros

    this.physics.add.collider(this.wizard, this.coins); // cria colisão entre mago e moedas
    this.physics.add.collider(this.monsters, this.water); // cria colisão entre montros e água
    this.physics.add.overlap(
      // caso o mago passe por cima de um monstro, chamar a função para encerrar a partida
      this.wizard,
      this.monsters,
      () => {
        this.endGame("lose");
      },
      null,
      this
    );

    for (let i = 0; i < 250; i++) this.createMonster(); // cria 250 monstros

    for (let i = 0; i < 50; i++) this.createCoin(); // cria 50 moedas

    setInterval(() => {
      if (!this.isGameOver) this.createMonster(); // cria um monstro a cada 1,5 segundo
    }, 1500);

    this.scoreboard = this.add.text(
      // Cria o placar
      this.cameras.main.scrollX + 30, // posiciona de acordo com a posição da câmera
      this.cameras.main.scrollY + 20,
      "Pontos: " + this.score,
      {
        fontSize: "40px",
        fill: "#fff",
      }
    );

    this.winGameImg = this.add.image(0, 0, "winGame").setVisible(false); // imagem invisível de vitória

    this.loseGameImg = this.add.image(0, 0, "loseGame").setVisible(false); // imagem invisível de derrota

    this.restartBtn = this.add // botão invisível para recomeçar partida
      .image(0, 0, "restartBtn")
      .setVisible(false)
      .setInteractive();

    this.restartBtn.on("pointerover", () => {
      // caso o cursor passe por cima do botão, aumentar seu tamanho e trocar cursor
      this.restartBtn.setScale(1.1);
      this.input.setDefaultCursor("pointer");
    });

    this.restartBtn.on("pointerout", () => {
      // retorna à aparência original
      this.restartBtn.setScale(1);
      this.input.setDefaultCursor("default");
    });

    this.restartBtn.on("pointerdown", () => {
      // caso o botão de recomeçar partida seja pressionado, chamar a função de recomeçar partda
      this.restartGame();
    });

    this.keyboard = this.input.keyboard.createCursorKeys(); // cria o mapeamento de pressionamento de teclas
  }

  update() {
    if (!this.isGameOver) this.wizardMovement(); // caso a partida acabe, para movimentação do mago

    this.monsters.children.iterate((monster) => {
      // itera sobre os filhos para não deixá-los passar do limite do mapa
      let velocityX = Phaser.Math.Between(10, 50);
      let velocityY = Phaser.Math.Between(10, 50);

      if (monster.body.position.x <= 64) monster.setVelocityX(velocityX); // se chegar no início horizontalmente, mandar monstro á direita
      if (monster.body.position.x >= 6210) monster.setVelocityX(-velocityX); // se chegar no fim horizontalmente, mandar monstro à esquerda
      if (monster.body.position.y <= 64) monster.setVelocityY(velocityY); // se chegar no início verticalmente, mandar monstro para baixo
      if (monster.body.position.y >= 4125) monster.setVelocityY(-velocityY); // se chegar no início verticalmente, mandar monstro para cima
    });

    if (this.score == 500) this.endGame("win"); // se a pontuação chegar no máximo, todas moedas foram coletadas e a partida será encerrada

    this.scoreboard.setX(this.cameras.main.scrollX + 30); // reposiciona o texto horizontalmente para sempre acompanhar a câmera e não o mapa
    this.scoreboard.setY(this.cameras.main.scrollY + 20); // reposiciona o texto verticalmente para sempre acompanhar a câmera e não o mapa
  }

  endGame(situation) {
    // função para encerrar o jogo e dependendo da situação de fim de partida, executar coisas um pouco diferentes
    this.anims.pauseAll(); // pausa todas animações
    this.physics.pause(); // pausa toda a física do jogo
    this.wizard.setTint(0xff0000); // pintar o mago de vermelho
    this.score = 0;
    this.isGameOver = true; // declara à variável de controle que o jogo acabou

    if (situation == "lose") {
      // caso o jogo tenha sido encerrado na derrota
      this.loseGameImg.x = this.wizard.x; // posiciona imagem de derrota de acordo com a posição do mago
      this.loseGameImg.y = this.wizard.y - 20;
      this.loseGameImg.setVisible(true); // imagem visível
    } else {
      this.winGameImg.x = this.wizard.x; // caso o jogo tenha sido encerrado na vitória
      this.winGameImg.y = this.wizard.y - 20;
      this.winGameImg.setVisible(true); // vitória visível
    }

    this.restartBtn.x = this.wizard.x; // posiciona o botão de reiniciar fase independente da situação
    this.restartBtn.y = this.wizard.y + 130;
    this.restartBtn.setVisible(true);
  }

  collectCoin() {
    // função chamada quando o mago coleta uma moeda
    this.coins.children.iterate((coin) => {
      // itera sobre as moedas para verificar se há alguma próxima ao mago
      if (
        coin.body.position.x >= this.wizard.body.position.x - 75 &&
        coin.body.position.x <= this.wizard.body.position.x + 75 &&
        coin.body.position.y >= this.wizard.body.position.y - 75 &&
        coin.body.position.y <= this.wizard.body.position.y + 100
      ) {
        coin.disableBody(true, true); // remove a moeda próxima do mago
        this.score += 10; // aumenta pontuação
        this.scoreboard.setText("Pontos: " + this.score); // atualiza o texto do placar
      }
    });
  }

  createCoin() {
    // função para criar moeda
    let positionX = this.samePositionProtection().x; // função para obter uma posição X na qual não foi nada
    let positionY = this.samePositionProtection().y;

    let coin = this.coins
      .create(positionX, positionY, `coin`)
      .setScale(0.15)
      .setSize(100, 100)
      .setDrag(500); // Define a inércia do elemento

    coin.anims.play("coin", true); // inicia a animação?
  }

  restartGame() {
    // recomeça a parida
    this.wizard.x = 3150; // posiciona os calouros no meio
    this.wizard.x = 2100;

    this.anims.resumeAll(); // retorna a reprodução das animações

    this.physics.resume(); // retorna a física do jogo

    this.wizard.setTint(0xffffff); // volta à cor original do mago
    this.scoreboard.setText("Pontos: " + this.score);
    this.isGameOver = false; // jogo em execução

    this.monsters.children.iterate((monster) => {
      monster.disableBody(true, true); // remove todos os monstros
    });

    this.coins.children.iterate((coin) => {
      coin.disableBody(true, true); // remove todos as moedas
    });

    for (let i = 0; i < 250; i++) this.createMonster(); // cria outros 250 monstros

    for (let i = 0; i < 50; i++) this.createCoin(); // cria outras 50 monstras

    this.restartBtn.setVisible(false); // esconde imagens
    this.loseGameImg.setVisible(false);
    this.winGameImg.setVisible(false);
  }

  samePositionProtection() {
    // função para gerar ume posição X e Y aleatórias
    let positionX = Phaser.Math.Between(65, 6239);
    let positionY = Phaser.Math.Between(65, 4159);
    let repeat = false; // variável para saber se deve ser feito o ciclo de verificação  de posição ocupada novamente

    //do { !!!!!!!!!!!!!VERIFICAR COM O PROFESSOR O PORQUÊ DESTE DO-WHILE NÃO FUNCIONAR!!!!!!!!!!!!!!!
    this.monsters.children.iterate((monster) => {
      while (
        // enquanto posição for próxima, gerar novo numero aleatória
        (positionX >= monster.body.position.x - 100 && // testa se a posição é próxima a algum mosntro]
          positionX <= monster.body.position.x + 100 &&
          positionY >= monster.body.position.y - 100 &&
          positionY <= monster.body.position.y + 120) ||
        (positionX >= this.wizard.body.position.x - 200 && // testa se a posição é próxima ao mago
          positionX <= this.wizard.body.position.x + 200 &&
          positionY >= this.wizard.body.position.y - 200 &&
          positionY <= this.wizard.body.position.y + 220)
      ) {
        positionX = Phaser.Math.Between(65, 6239);
        positionY = Phaser.Math.Between(65, 4159);
      }
    });

    this.coins.children.iterate((coin) => {
      if (
        // testa se a posição está próxima a alguma moeda
        positionX >= coin.body.position.x - 100 &&
        positionX <= coin.body.position.x + 100 &&
        positionY >= coin.body.position.y - 100 &&
        positionY <= coin.body.position.y + 120
      ) {
        repeat = true; // repetir todo o clico de verifiação e geração de número
        return false;
      } else {
        repeat = false;
      }
    });
    //} while (repeat);

    return { x: positionX, y: positionY }; // retorna uma lista com as posições !!!!!!!LISTA DE DADOS SOLICITADA NA ATIVIDADE!!!!!!!!!
  }

  wizardMovement() {
    this.wizard.setVelocityX(0);
    this.wizard.setVelocityY(0);

    // Movimento horizontal
    if (this.keyboard.right.isDown) { // caso a seta seja pressionada, movimentá-lo definido uma velocidade
      this.wizard.setFlipX(false).setOffset(20, 8); // espelha a sprite e muda a posição do hitbox
      this.wizard.setVelocityX(this.velocityX);
    } else if (this.keyboard.left.isDown) {
      this.wizard.setFlipX(true).setOffset(12, 8);
      this.wizard.setVelocityX(-this.velocityX);
    }

    // Movimento vertical
    if (this.keyboard.down.isDown) {// caso a seta seja pressionada, movimentá-lo definido uma velocidade
      this.wizard.setVelocityY(this.velocityY);
    } else if (this.keyboard.up.isDown) {
      this.wizard.setVelocityY(-this.velocityY);
    }

    // Verificar se há movimento horizontal ou vertical antes de iniciar a animação
    const isMovingHorizontal =
      this.keyboard.left.isDown || this.keyboard.right.isDown;
    const isMovingVertical =
      this.keyboard.up.isDown || this.keyboard.down.isDown;

    if ((isMovingHorizontal || isMovingVertical) && !this.isCollecting) { // caso o mago se movimente e não colete, reproduzir animação
      this.wizard.anims.play("wizardWalk", true);
    } else if (!this.isCollecting) {
      this.wizard.anims.play("wizardIdle", true);
    }

    // Lógica da animação de coleta
    if (this.keyboard.space.isDown && !this.isCollecting) {
      // !!!!!!!EFEITO ESPECIAL SOLICITADO NA ATIVIDADE!!!!!!!!!
      this.wizard.anims.play("wizardCollect", true);
      this.isCollecting = true;
      this.collectCoin(); // chamado à função de coleta de moeda
    }

    // Verificar se a animação de coleta foi concluída
    if (
      this.isCollecting &&
      this.wizard.anims.currentAnim.key === "wizardCollect" &&
      this.wizard.anims.isPlaying
    ) {// verifica se animação está sendo executada
      this.wizard.setOffset(20, 55);
      this.wizard.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE,// quando a animação forcompletada, execute uma função
        () => {
          this.wizard.setOffset(20, 8);
          this.isCollecting = false;
          this.wizard.anims.play("wizardIdle", true);
        },
        this
      );
    }
  }

  createMonster() { // variável para criação de monstros
    let positionX = this.samePositionProtection().x;
    let positionY = this.samePositionProtection().y;
    let velocityX = Phaser.Math.Between(10, 100); // velocidade aleatória
    let velocityY = Phaser.Math.Between(10, 100);
    let monsterId = Phaser.Math.Between(1, 3); // identificadorpara aleatorizar qual monstro deve ser gerado
    let isNegativeX = Phaser.Math.Between(0, 1); // aleatoriza se a velicidade será negativa
    let isNegativeY = Phaser.Math.Between(0, 1);
    let scale;//tamanho variável das sprites
    let sizeX;//tamanho variável do hitbox das sprites
    let sizeY;//tamanho variável do hitbox das sprites

    switch (monsterId) { // dependendo do identificador do monstro, definir configurações mais adequadas a cada caso
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

    this.physics.add.overlap(
      monster,
      this.coins,
      () => {
        //mudar posição se monstro colidir com moeda
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
