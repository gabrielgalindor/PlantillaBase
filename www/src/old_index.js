
var config = {
    width: fwidth,
	height: fheight,
    type: Phaser.WEBGL,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/intro/decorador1.png');
}

function create() {
    this.background = this.add.tileSprite(centerw,centerh,game.config.width,game.config.height,'background');
}    
