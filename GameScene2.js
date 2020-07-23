class GameScene2 extends Phaser.Scene {

  constructor() {
    super({ key: 'GameScene2' })
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

  //load new images here
  preload() {
    this.load.image('wideBarrier', 'SpriteFolder\\wideBarrier.png');
    this.load.image('wideBarrierNew', 'SpriteFolder\\wideBarrierNew.png');
    this.load.image('wideBarrierNewRed', 'SpriteFolder\\wideBarrierNewRed.png');
    this.load.image('bullet', 'SpriteFolder\\newBullet.png');
    this.load.image('ship', 'SpriteFolder\\ship.png');
    this.load.image('shipOutline', 'SpriteFolder\\shipOutline.png');
    this.load.image('squareBlock', 'SpriteFolder\\squareBlock.png');
  }


  //variables to modify per level:
  //gameState.bulletsRemaining, gameState.numOfBarriers, gameState.blocks, gameState.barriers
  create() {
//IMPORTANT LEVEL VARIABLES (change for each level if needed)
    //bulletsRemaining tracks how many bullets the player has in this level
    gameState.bulletsRemaining = 5;
    //numOfBarriers specifies how many barriers there are to activate to complete the level
    gameState.numOfBarriers = 3;

//INITIALIZE PLAYER AND BULLET OBJECTS
    gameState.player = this.add.sprite(400,700, 'shipOutline').setScale(5);
    gameState.bullet1 = this.physics.add.sprite(999, 999, 'bullet');
    gameState.bullet1inScreen = false;
    gameState.bullet2 = this.physics.add.sprite(999, 999, 'bullet');
    gameState.bullet2inScreen = false;
    gameState.collidedBarrier;
    gameState.bulletCounterText = this.add.text(100, 750, 'Bullets: ' + gameState.bulletsRemaining);

//STATIC BLOCKS
    //static blocks serve as obstacles that block bullets
    gameState.blocks = this.physics.add.staticGroup();
    gameState.blocks.create(100, 100, 'squareBlock');
    gameState.blocks.create(700, 100, 'squareBlock');
    gameState.blocks.create(100, 300, 'squareBlock');
    gameState.blocks.create(700, 300, 'squareBlock');
    gameState.blocks.create(100, 500, 'squareBlock');
    gameState.blocks.create(700, 500, 'squareBlock');

    //collision detection for bullet1 and bullet2
    this.physics.add.overlap(gameState.bullet1, gameState.blocks, () => {
      this.bullet1Reset();
    });
    this.physics.add.overlap(gameState.bullet2, gameState.blocks, () => {
      this.bullet2Reset();
    });


//BARRIERS
    //activatedBarriers is incremented each time a mandatory barrier is shot and stopped,
    //and is compared with numOfBarriers to check if the level is complete
    gameState.activatedBarriers = 0;
    //barriers is the general barrier group containing all barriers yet to be activated,
    gameState.barriers = this.physics.add.group();
    //create new barriers below this line
    this.add.line(0, 0, 200, 100, 600, 100, '0xff0000').setOrigin(0,0);
    gameState.barriers.create(300, 100, 'wideBarrierNew');
    //new Line('GameScene.js', 300, 100, 300, 100, 600, 100, '0xff0000');

    //var line = new Phaser.Geom.Line(300, 100, 600, 100);
    //graphics.strokeLineShape(line);
    this.add.line(0, 0, 200, 300, 600, 300, '0xff0000').setOrigin(0,0);
    gameState.barriers.create(250, 300, 'wideBarrierNew');

    this.add.line(0, 0, 200, 500, 600, 500, '0xff0000').setOrigin(0,0);
    gameState.barriers.create(400, 500, 'wideBarrierNew');


    var counter = 0;
    //initializes 'state' for each child in barrier to 1,11,21,31...
    //each barrier has 10 possible states of movement that are updated in update(),
    //but counter in the below function can be changed if more states are needed
    //0 state = barrier has been hit, all barriers share this state
    gameState.barriers.getChildren().forEach(function(item, index) {
      item.state = 1 + counter;
      counter += 10;
    });

    gameState.hitBarriers = this.physics.add.group();
    this.physics.add.overlap(gameState.bullet1, gameState.hitBarriers, () => {
      this.bullet1Reset();
    });
    this.physics.add.overlap(gameState.bullet2, gameState.hitBarriers, () => {
      this.bullet2Reset();
    });


//initialize controls
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
        this.scene.stop('GameScene');
        this.scene.start('StartScene');
      }, 4000);
    }
    //barrier movement logic if level is still going
    else {
      gameState.barriers.getChildren().forEach(function(item, index) {
        if (item.state === 0) {
          item.setVelocityX(0);
          item.setVelocityY(0);
        }
        else if (item.state === 1) {
          item.setVelocityX(150);
        }
        else if (item.state === 2) {
          item.setVelocityX(-150);
        }
        else if (item.state === 11) {
          item.setVelocityX(100);
        }
        else if (item.state === 12) {
          item.setVelocityX(-100);
        }
        else if (item.state === 21) {
          item.setVelocityX(200);
        }
        else if (item.state === 22) {
          item.setVelocityX(-200);
        }

        //must include buffer zones for x/y coords because update() calls aren't consistant/perfect
        //states 1-10 reserved for barrier1
        if (item.state === 1 && (item.x <= 630 && item.x >= 570)) {
          item.state = 2;
        }
        else if (item.state === 2 && (item.x <= 230 && item.x >= 170)) {
          item.state = 1;
        }

        //states 11-20 reserved for barrier2
        if (item.state === 11 && (item.x <= 630 && item.x >= 570)) {
          item.state = 12;
        }
        else if (item.state === 12 && (item.x <= 230 && item.x >= 170)) {
          item.state = 11;
        }

        if (item.state === 21 && (item.x <= 630 && item.x >= 570)) {
          item.state = 22;
        }
        else if (item.state === 22 && (item.x <= 230 && item.x >= 170)) {
          item.state = 21;
        }
      });

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
          text1 = this.add.text(config.width/2-60, config.height/2 + 100, 'Restarting in 3...', {fill: '#000000'});
        }, 1000);
        setTimeout(() => {
          text1.destroy();
          text2 = this.add.text(config.width/2-60, config.height/2 + 100, 'Restarting in 2...', {fill: '#000000'});
        }, 2000);
        setTimeout(() => {
          text2.destroy();
          text3 = this.add.text(config.width/2-60, config.height/2 + 100, 'Restarting in 1...', {fill: '#000000'});
        }, 3000);
        setTimeout(() => {
          this.scene.restart();
        }, 4000);
      }

    }


    //debug
    if (gameState.cursors.shift.isDown) {
      console.log(gameState.activatedBarriers);
      //console.log(gameState.barriers.getChildren());
      //console.log(gameState.collidedBarrier);
      console.log(gameState.barriers.getChildren());
    }
  }
}
