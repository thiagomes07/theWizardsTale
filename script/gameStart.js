class GameStart extends Phaser.Scene {
  constructor() {
    super({ key: "GameStart" }); // define o nome da cena
  }

  preload() {
    this.load.image("background", "assets/scene1/background.jpg"); // carrega o plano de fundo
    this.load.image("gameTitle", "assets/scene1/gameTitle.png"); // carrega o título do jogo
    this.load.image("play", "assets/scene1/play.png"); // carrega o botão de jogar
    this.load.image("rulesText", "assets/scene1/rulesText.png"); // carrega as regras do jogo
  }

  create() {
    const gameWidth = this.sys.game.config.width; // pega a largura da imagem

    this.add.image(0, 0, "background").setOrigin(0, 0); // cria o plano de fundo
    const gameTitle = this.add.image(gameWidth / 2, 150, "gameTitle"); // cria o título do jogo
    const playBtn = this.add.image(gameWidth / 2, 350, "play").setInteractive(); // cria o botão de jogar e o define como elemento interativo, para ser clicável
    const rulesText = this.add
      .image(0, 0, "rulesText")
      .setOrigin(0, 0)
      .setVisible(false); // deixa invisível

    playBtn.on("pointerover", () => {
      // feedback para o usuário saber que é um botão
      playBtn.setScale(1.1).setTint("0x999999"); // deixa botão escuro e aumenta o tamanho caso o usuário passe o cursor em cima do botão
      this.input.setDefaultCursor("pointer"); // troca o cursor caso o usuário passe o cursor em cima do botão
    });

    playBtn.on("pointerout", () => {
      // quando tirar o cursor, volta ao estado normal
      playBtn.setScale(1).setTint("0xffffff");
      this.input.setDefaultCursor("default");
    });

    playBtn.on("pointerdown", () => {
      gameTitle.setVisible(false); // esconde o título
      playBtn.setVisible(false); // esconde o botão de jogar
      rulesText.setVisible(true); // exibe as regras do jogo
      this.input.keyboard.on(
        "keydown",
        (event) => {
          // caso qualquer tecla seja apertada, inicia a próxima cena
          this.cameras.main.fade(500, 0, 0, 0); // escurece a tela antes de trocar senha
          this.time.delayedCall(
            // delay para cena iniciar só depois do efeito fade
            500, // tempo de delay
            () => {
              this.scene.start("GamePlay"); // inicia a próxima cena
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
