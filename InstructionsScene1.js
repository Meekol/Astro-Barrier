class InstructionsScene1 extends Phaser.Scene {
  constructor() {
    super({ key: 'InstructionsScene1' })
  }

  bullet1Reset() {
    gameState.bullet1.x = 999;
    gameState.bullet1.y = 999;
    gameState.bullet1inScreen = false;
  }
  bullet2Reset() {
    gameState.bullet2.x = 999;
    gameState.bullet2.y = 999;
    gameState.bullet2inScreen = false;
  }

  preload() {
    this.load.image('wideBarrierNew', 'SpriteFolder\\wideBarrierNew.png');
    this.load.image('wideBarrierNewRed', 'SpriteFolder\\wideBarrierNewRed.png');
    this.load.image('bullet', 'SpriteFolder\\newBullet.png');
    this.load.image('shipOutline', 'SpriteFolder\\shipOutline.png');
    this.load.image('squareBlock', 'SpriteFolder\\squareBlock.png');
  }

  create() {
//IMPORTANT LEVEL VARIABLES (change for each level if needed)
    //bulletsRemaining tracks how many bullets the player has in this level
    gameState.bulletsRemaining = 5;
    //numOfBarriers specifies how many barriers there are to activate to complete the level
    gameState.numOfBarriers = 1;

    this.add.text(220, 600, 'Use your arrow keys "<-" or "->" to move.\n' + '  Press the Space Bar to shoot a bullet.');
    gameState.player = this.add.sprite(400,700, 'shipOutline').setScale(5);
    gameState.bullet1 = this.physics.add.sprite(999, 999, 'bullet');
    gameState.bullet1inScreen = false;
    gameState.bullet2 = this.physics.add.sprite(999, 999, 'bullet');
    gameState.bullet2inScreen = false;
    gameState.collidedBarrier;
    gameState.bulletCounterText = this.add.text(100, 750, 'Bullets: ' + gameState.bulletsRemaining);
    this.add.text(10, 700, 'You have limited bullets, the level\n  will restart if you run out.');

    //activatedBarriers is incremented each time a mandatory barrier is shot and stopped,
    //and is compared with numOfBarriers to check if the level is complete
    gameState.activatedBarriers = 0;
    //barriers is the general barrier group containing all barriers yet to be activated,
    gameState.barriers = this.physics.add.group();
    gameState.hitBarriers = this.physics.add.group();
    //create new barriers below this line
    gameState.barriers.create(200, 300, 'wideBarrierNew');
    this.add.text(280, 290, '<- This is a barrier, shoot all the barriers\n to clear a level.');
    this.add.text(190, 350, 'Shoot the barrier to return to the main menu.');

    gameState.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    //basic controls
    //ship movement left/right
    if (gameState.cursors.left.isDown && gameState.player.x >= 70) {
      gameState.player.x -= 10;
    }
    if (gameState.cursors.right.isDown && gameState.player.x <= 730) {
      gameState.player.x += 10;
    }
    //fire bullet
    if (gameState.cursors.space.isDown && gameState.bulletsRemaining > 0) {
      if (gameState.bullet1inScreen == false) {
        gameState.bullet1.x = gameState.player.x;
        gameState.bullet1.y = gameState.player.y - 10;
        gameState.bullet1inScreen = true;
        gameState.bulletsRemaining -= 1;
      }
      if (gameState.bullet1inScreen == true && gameState.bullet2inScreen == false && gameState.bullet1.y < gameState.player.y - 100 && gameState.bulletsRemaining > 0) {
        gameState.bullet2.x = gameState.player.x;
        gameState.bullet2.y = gameState.player.y - 10;
        gameState.bullet2inScreen = true;
        gameState.bulletsRemaining -= 1;
      }
    }

    //forces bullet to keep going up
    if (gameState.bullet1.y > -50) {
      gameState.bullet1.y -= 10;
    }
    if (gameState.bullet2.y > -50) {
      gameState.bullet2.y -= 10;
    }

    //checks if bullets still inScreen, resets them otherwise
    if (gameState.bullet1.y < -20) {
      this.bullet1Reset();
    }
    if (gameState.bullet2.y < -20) {
      this.bullet2Reset();
    }

    //checks if bullet1/bullet2 hits a barrier
    gameState.barriers.getChildren().forEach(function(item, index) {
      //bullet1 logic
      if ((gameState.bullet1.y >= item.y - 30 && gameState.bullet1.y <= item.y + 30) && (gameState.bullet1.x >= item.x - 61 && gameState.bullet1.x <= item.x + 61)) {
        console.log(item + ", " + index);
        console.log(item.x + ", " + item.y);
        gameState.bullet1.x = 999;
        gameState.bullet1.y = 999;
        gameState.bullet1inScreen = false;
        gameState.collidedBarrier = index;
        item.state = 0;
        setTimeout(() => { gameState.hitBarriers.create(item.x, item.y, 'wideBarrierNewRed').setScale(1.02); }, 1);
        gameState.activatedBarriers++;
      }
      //bullet2 logic
      else if ((gameState.bullet2.y >= item.y - 30 && gameState.bullet2.y <= item.y + 30) && (gameState.bullet2.x >= item.x - 61 && gameState.bullet2.x <= item.x + 61)) {
        console.log(item + ", " + index);
        console.log(item.x + ", " + item.y);
        gameState.bullet2.x = 999;
        gameState.bullet2.y = 999;
        gameState.bullet2inScreen = false;
        gameState.collidedBarrier = index;
        item.state = 0;
        setTimeout(() => { gameState.hitBarriers.create(item.x, item.y, 'wideBarrierNewRed').setScale(1.02); }, 1);
        gameState.activatedBarriers++;
      }
    });


    //checks if all barriers have been activated
    if (gameState.numOfBarriers === gameState.activatedBarriers) {
      this.scene.pause();
      this.add.text(config.width/2-110, config.height/2, 'Level complete', {
        fontSize: '30px',
        fill: '#4DFF04',
      });
      var text1;
      var text2;
      var text3;
      setTimeout(() => {
        text1 = this.add.text(config.width/2-110, config.height/2 + 100, 'Starting next level in 3...', {fill: '#000000'});
      }, 1000);
      setTimeout(() => {
        text1.destroy();
        text2 = this.add.text(config.width/2-110, config.height/2 + 100, 'Starting next level in 2...', {fill: '#000000'});
      }, 2000);
      setTimeout(() => {
        text2.destroy();
        text3 = this.add.text(config.width/2-110, config.height/2 + 100, 'Starting next level in 1...', {fill: '#000000'});
      }, 3000);
      setTimeout(() => {
        this.scene.stop('InstructionsScene1');
        this.scene.start('StartScene');
      }, 4000);
    }

    //update bullet counter
    gameState.bulletCounterText.setText('Bullets: ' + gameState.bulletsRemaining);

    //out of bullets, reset scene
    if (gameState.bulletsRemaining <= 0 && gameState.bullet1inScreen == false && gameState.bullet2inScreen == false) {
      this.scene.pause();
      this.add.text(config.width/2-110, config.height/2, 'Out of Bullets!', {
        fontSize: '30px',
        fill: '#ff0000',
      });
      var text1;
      var text2;
      var text3;
      setTimeout(() => {
        text1 = this.add.text(config.width/2-70, config.height/2 + 100, 'Restarting in 3...', {fill: '#000000'});
      }, 1000);
      setTimeout(() => {
        text1.destroy();
        text2 = this.add.text(config.width/2-70, config.height/2 + 100, 'Restarting in 2...', {fill: '#000000'});
      }, 2000);
      setTimeout(() => {
        text2.destroy();
        text3 = this.add.text(config.width/2-70, config.height/2 + 100, 'Restarting in 1...', {fill: '#000000'});
      }, 3000);
      setTimeout(() => {
        this.scene.restart();
      }, 4000);
    }

  }
}
