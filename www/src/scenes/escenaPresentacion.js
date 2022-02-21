


export class escenaIntro extends Phaser.Scene{
    constructor(){
        super({key:"intro", active:true});
        this.yellowbot = 0xFCCE1A;
    }
    preload()
    {
        this.load.image('background', 'http://147.182.166.122/assets/intro/background.jpg');
     
    }
    create()
    {

        this.background = this.add.tileSprite(centerw,centerh,game.config.width,game.config.height,'background');
    }

    update(time,delta)
    {
        this.background.tilePositionY += 0.5;
    }
}