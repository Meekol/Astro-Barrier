const gameState = {

};

function create() {
  this.add.text(config.width/2-30, config.height/2, "test", {
    font: "40px Times New Roman",
    fill: "#ffa0d0",
  });

}
//const barriers = this.physics.add.group();
var physicsConfig = {
  default: 'arcade',
  arcade: {
    debug: true
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  backgroundColor: "#5f2a55",
  pixelArt: true,
  physics: physicsConfig,
  scene: [StartScene, GameScene, GameScene2, InstructionsScene1]
};

/*window.onload = function() {
  var game = new Phaser.Game(config);
}*/

const game = new Phaser.Game(config);

/*window.onload = function() {
  var game = new Phaser.Game();
}*/
