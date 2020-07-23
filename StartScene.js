class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' })
  }

  preload() {
    this.load.image('playButton', 'SpriteFolder\\playButton.png');
    this.load.image('instructionsButton', 'SpriteFolder\\instructionsButton.png');
  }

  create() {
    /*this.add.text(config.width/2, co nfig.height/2, 'Click to Start', {
      fontSize: '30px',
      fill: '#000000',
    });
    this.input.on('pointerdown', () => {
      this.scene.stop('StartScene');
      this.scene.start('GameScene');
    })*/
    var playBt = this.add.sprite(400, 400, 'playButton').setInteractive();
    var instructionsBt = this.add.sprite(400, 300, 'instructionsButton').setInteractive();
    var tempBt = this.add.sprite(0, 0, 'playButton').setInteractive();

    playBt.on('pointerdown', () => {
      this.scene.stop('StartScene');
      this.scene.start('GameScene');
    });
    instructionsBt.on('pointerdown', () => {
      this.scene.stop('StartScene');
      this.scene.start('InstructionsScene1');
    });
    tempBt.on('pointerdown', () => {
      this.scene.stop('StartScene');
      this.scene.start('GameScene2');
    });

  }

}
