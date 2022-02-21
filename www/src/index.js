export const fwidth = 1280;
export const fheight = 720;
export const centerw = fwidth/2;
export const centerh = fheight/2;
export const centerhroad = centerh - 100;


export class BallenasChoko  extends Phaser.Scene{
    
    constructor(){
        super({key:"BallenasChoko", active:false});
        this.speed = 1;
        this.seaObjects = [];
        this.CreateSeaObject = false;
        this.CreateSeaTimer = 0;
        //test
        //Variables que manejan la presentación por 3 secuencias
        this.update_secuence = 0;
        this.timer_update = 0;

        //Variables de puntaje
        this.score = 0;

        //Variables de manejo de los sprites
        this.velocidad_caida = 5;
        this.limiteY = 720;
        //Delay principal que distancia la creación de basura en segundos
        this.delay_basura = 5;
        this.call_basura_seconds = 5;
        this.primer_cambio = 28;
        this.primer_cambio_flag = true;
        this.segundo_cambio = 30;
        this.segundo_cambio_flag = false;
        //Limites para el carro (el personaje del usuario)
        this.leftLimit = 100;
        this.rightLimit = 900;

    }

    preload()
    {
        this.load.image('bg-ballenaschoco','./assets/ballenaschoco/background.jpg');
        this.load.image('seaballenas','./assets/ballenaschoco/sea8bits.jpg');
        this.load.image('whale', './assets/ballenaschoco/whal02.png');
        this.load.image('mountains', './assets/ballenaschoco/layer2.png');
        this.load.image('leaves', './assets/ballenaschoco/layer_front.png');
        //Cargar imagenes 
        this.load.image('basura1', './assets/ballenaschoco/basura1.png');
        this.load.image('basura2', './assets/ballenaschoco/basura2.png');
        this.load.image('basura3', './assets/ballenaschoco/basura3.png');

        this.load.image('barco','./assets/ballenaschoco/barco.png');

        this.load.atlas('title-choko','./assets/ballenaschoco/title-choko.png','./assets/ballenaschoco/title-choko.json');
    }
    create()
    {
        this.background_layer = this.add.layer();
        this.front_layer = this.add.layer();

        this.background = this.add.tileSprite(centerw,centerh,game.config.width,game.config.height,'bg-ballenaschoco');
        this.mountains = this.add.tileSprite(0,centerh+120,2711,204,'mountains');
        this.sea = this.add.tileSprite(0,centerh+200,2711,204,'seaballenas');
        this.leaves = this.add.tileSprite(0,0,2711,204,'leaves');
        this.seaObjects.push("1");

        this.title = this.add.sprite(200,centerh-300,'title-choko','titleChoko0.png');

        this.anims.create({
            key:'title-choko',
            repeat:-1,
            frameRate:24,
            frames:this.anims.generateFrameNames('title-choko',{
                prefix:'titleChoko',
                suffix:'.png',
                start:0,
                end:4
            })
        });

        this.title.play({ key: 'title-choko', repeat: -1 });
    }

    update(time,delta)
    {        
        this.backgroundHandler();
        this.seaHandler();

        //Revision de secuencias
        //Secuencia = 0 --- Realiza la presentacion
        if(this.update_secuence == 0)
        {
            this.timer_update += delta;
            //Revisa si ya han pasado 2 segundos (o 2.000 milisegundos)
            //Para cambiar a la secuencia de pseudocrear
            if(this.timer_update>=2000)
            {
                this.update_secuence=1;
            }
        }    
        
        if(this.update_secuence==1)
        {
            this.title.destroy();
            this.pseudocreate();
            this.update_secuence = 2;
        }

        if(this.update_secuence==2)
        {
            this.pseudoupdate(delta);
        }
    }
    //Método que remplaza la función del método create
    pseudocreate(){
        // Creación de textos de score y tiempo 
        this.textTime = this.add.text(centerw-100, 50, '02:59', { fontFamily: 'Bitwise, "Arial", Times, serif', fontSize: '5rem', color: '#fdaffc', stroke: "#0000fa", strokeThickness :2});
        this.textScore = this.add.text(100, 50, 'Puntaje: 0', { fontFamily: 'Bitwise, "Arial", Times, serif', fontSize: '2rem', color: '#ffffff', stroke: "#0000fa", strokeThickness :2});
        
        //Variables del tiempo
        this.minutes = 1;
        this.seconds = 59;
        this.miliseconds = 1000;

       
        
        //Array de sprites clicleables (Basuras) que obtendrán los puntajes
        this.basuras = [];
        

        //Crea la opcion de usar el teclado
        this.cursor = this.input.keyboard.createCursorKeys();

        this.barco = this.physics.add.sprite(400,480,"barco");
        // Set el tamano del Collider
        this.barco.body.setSize(297,50);
        // Set la posición del collider
        this.barco.body.setOffset(0,250);
    }
    //Método que remplaza la función normal del Update
    pseudoupdate(delta){
        this.miliseconds -= delta;
        this.printTimeText();

        //Controles del barco 
        this.controlBarco();

        /* Se llama el método que sigue la lógica que maneja el array de las basuras
           con el fin de revisar si lo puede eliminar o continúa la animación
        */
        this.secuenciaBasura();
        //Revisa si tiene que crear un nuevo elemento de basura
        //Este contador está basado en this.call_basura_seconds
        if(this.crear_basura)
        {
            this.createBasura();
        }
    }
    controlBarco(){
        if(this.cursor.left.isDown)
        {
            if(this.barco.x >= this.leftLimit)
            {
                this.barco.x-=10;
            }
        }

        if(this.cursor.right.isDown)
        {
            if(this.barco.x <= this.rightLimit)
            {
                this.barco.x+=10;
            }
        }
    }
    //Todos los siguientes métodos están relacionados al ciclo del minijuego

    //Metodo que permite crear los objetos clicleables
    createBasura(){
        console.log("Se creo basura");
        let lucky =Math.floor(Math.random()*300);
        let lucky_x = Math.floor(Math.random()*700);
        let texture_string = 'basura1';
        if(lucky < 100)
        {
            texture_string = 'basura1';
        }

        if(lucky >= 100 && lucky < 200)
        {
            texture_string = 'basura2';
        }

        if(lucky >= 200 && lucky <= 300)
        {
            texture_string = 'basura3';
        }
        //Crea Sprite con física de imagen
        let basura1 = this.physics.add.image(50+lucky_x, 100, texture_string).setInteractive();
        basura1.setScale(0.30);
        console.log(this.score);
        this.physics.add.collider( basura1, 
            this.barco,
             function(){
                basura1.destroy();
                this.score +=10;
                this.textScore.setText('Puntaje: '+this.score);
             },
             null,
            this);
        basura1.on('pointerdown', (pointer) => {

            basura1.destroy();
            this.score +=10;
            this.textScore.setText('Puntaje: '+this.score);
        }, this);
        this.basuras.push(basura1);
        this.crear_basura = false;
    }

    secuenciaBasura(){
        let array_pointer = 0;
        //Velocidad de la caida
        this.basuras.forEach((item, index, object)=> {
            item.y+=this.velocidad_caida;
            //limite de caida
            if(item.y>this.limiteY)
            {
                item.destroy();
                object.splice(index,1);
            }
        });
    }

    backgroundHandler()
    {
        //Efecto de mover el fondo
        this.background.tilePositionX +=1*this.speed;
        this.mountains.tilePositionX +=0.25*this.speed;
        this.sea.tilePositionX +=10*this.speed;
    }
    seaHandler()
    {
        if(this.CreateSeaTimer<100)
        {
            this.CreateSeaTimer+=1;
        }else{
            
            this.CreateSeaTimer=-100;
        }

        let index = 0;

        this.seaObjects.forEach(element => {
               if(index!=0)
               {
                   element.x+=10*this.speed;
                   if(element.x>1400)
                   {
                       element.destroy();
                       this.removeElementSea(element);
                   }
               }
               index+=1;
        });
    }
    removeElementSea(ELEMENT)
    {
        let isFind = this.seaObjects.indexOf(ELEMENT);
        this.seaObjects.splice(isFind,1);
    }

    printTimeText(){
        if(this.miliseconds < 0)
        {
            this.miliseconds = 1000;
            this.seconds -=1;
            this.call_basura_seconds-=1;
            if(this.seconds < 0)
            {
                this.minutes -=1;
                this.seconds =59;
            }
           

            //Se coloca este condicional con el fin de cuando los segundos sean
            // menor a 10 se muestre un 0 al lado de los segundos
            if(this.seconds >= 10)
            {
                this.textTime.setText('0'+this.minutes+':'+this.seconds);
            }else{
                this.textTime.setText('0'+this.minutes+':0'+this.seconds);
            }

             //Contador de llamar la creación de nueva basura
             if(this.call_basura_seconds<=0)
             {
                 this.call_basura_seconds = this.delay_basura;
                 this.crear_basura = true;
             }
             //Detecta si ya pasó el tiempo para acelerar el juego
            if(this.primer_cambio_flag)
            {
                
                if(this.primer_cambio>0)
                {
                    this.primer_cambio-=1;
                }else{
                    //Acelerar el juego
                    this.delay_basura=2;
                    this.velocidad_caida+=3;
                    this.primer_cambio_flag=false;
                    this.segundo_cambio_flag = true;
                }
            }
            //Detecta si ya paso el segundo tiempo para acelerar el juego
            if(this.segundo_cambio_flag)
            {
                if(this.segundo_cambio>0)
                {
                    this.segundo_cambio-=1;
                }else{
                    this.delay_basura=1;
                    this.velocidad_caida+=4;
                    this.segundo_cambio_flag=false;
                }
            }


        }
    }
}


export class escenaLobby extends Phaser.Scene{
    constructor(){
        super({key:"Lobby", active:false});
    }
    preload()
    {
        // this.load.image('caminos', './assets/caminos.png'); 
        // this.load.image('puertas', './assets/puertas.png');
        // this.load.atlas('personaje', './assets/sprite1.png','./assets/sprite1atlas.json');
        // this.load.image('bloques', './assets/bloquesAvion.png');

        // // this.load.atlas('personaje', './assets/sprite1.png','./assets/sprite1atlas.json');
        // // this.load.image('block', './assets/carro.png');

        this.load.image('tiles', 'assets/map/lobby.png');
        
        
        this.load.tilemapTiledJSON('map', 'assets/map/lobby.json');
        
        
        this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });

    }
    create()
    {
        

        // this.cameras.main.setBounds(0, 0, 1024, 2048);
    
    
        // var block = this.physics.add.staticImage(0, 0, 'bloques').setOrigin(0);
        // this.add.image(0, 0, 'caminos').setOrigin(0);
        // this.personaje = this.physics.add.sprite(160,230,"personaje","s0.png").setScale(0.5);
        // this.add.image(0, 0, 'puertas').setOrigin(0);

        // // var block = this.physics.add.staticImage(300, 300, 'block');
        // // // block.setCollisionByExclusion([-1]);
        // // this.personaje = this.physics.add.sprite(160,230,"personaje","s0.png").setScale(0.5);
        // this.physics.add.collider( this.personaje, block);
        
        // // var collider = this.physics.add.overlap(this.personaje, this.block, function ()
        // // {
        // // // marioOnBlock.body.stop();

        // // this.physics.world.rfemoveCollider(collider);
        // // }, null, this);

        // //Comentar
        

        // this.cameras.main.setZoom(1);
        // this.cameras.main.centerOn(80, 160);
        
        // console.log(this.cameras.main.getScroll(767, 1096));
            
        // this.text = this.add.text(304, 230).setText('Testeado Ms Bot');
        // this.text.setShadow(1, 1, '#000000', 2);
        
        // this.cursor = this.input.keyboard.createCursorKeys();
        // this.panx = 5;
        // this.pany= 5;

        // this.anims.create({
        //     key:'walk',
        //     repeat:-1,
        //     frameRate:24,
        //     frames:this.anims.generateFrameNames('personaje',{
        //         prefix:'s',
        //         suffix:'.png',
        //         start:0,
        //         end:2
        //     })
        // });
        
        var map = this.make.tilemap({ key: 'map' });
        
        
        var tiles = map.addTilesetImage('lobby', 'tiles');
        
        
        var grass = map.createStaticLayer('Caminos', tiles, 0, 0);
        var obstacles = map.createStaticLayer('Obstaculos', tiles, 0, 0);
        this.minGame1 = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        this.minGame2 = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        this.minGame3 = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        // this.start1 = map.createDynamicLayer('Start1', tiles, 0, 0);
        // // var start2 = map.createStaticLayer('Start2', tiles, 0, 0).setOrigin(0).setInteractive();
        // // var start3 = map.createStaticLayer('Start3', tiles, 0, 0).setOrigin(0).setInteractive();
        // // this.spawns = this.physics.add(start1);
        
        
        obstacles.setCollisionByExclusion([-1]);
        // start1.setCollisionByExclusion([0]);
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
            frameRate: 10,
            repeat: -1
        });
        
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 6, 0, 12 ] }),
            frameRate: 10,
            repeat: -1
        });        

        
        this.player = this.physics.add.sprite(800, 1500, 'player', 6).setScale(2);

        var door = map.createStaticLayer('Puertas', tiles, 0, 0);

        // var tile = this.start1.getTileAtWorldXY(this.player.x, this.player.y);
        // if (tile == 1) {
        //     console.log('start');
        // };

        // this.physics.overlapTiles(this.player, this.start1, function () {
        //     console.log('start');
        // });

        // this.physics.add.collider( this.player, start1);

        // this.physics.add.overlap(this.player, this.start1, function() {
        //     console.log('start1')
        // }, false, this);

        // this.physics.add.overlap(this.player, start1, function (block){
        //     block.body.stop();
		//     console.log('detenido');
        //     }, null, this);

        // start1.on('videojuego1', function() {
        //     console.log('escena activa');
        // },this);

        
        
        
    
        // if (this.physics.add.overlap( this.player, this.spawns1)) {
        //     // this.scene.start('videojuego1')
        //     console.log('se activo escena')
        // }
        
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);
        
        
        this.physics.add.collider(this.player, obstacles);

        
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; 
        this.cameras.main.setZoom(1.2);
    
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // var start1 = this.findObjectsByType('start1', map)[0];
        // var start2 = this.findObjectsByType('start2', map)[0];
        // var start3 = this.findObjectsByType('start3', map)[0];

       

        this.minGame1.create(200, 265, 32, 4);
        this.minGame2.create(425, 265, 32, 4);
        this.minGame3.create(600, 265, 32, 4);
        // this.spawns.create(start2.x, start2.y, 16, 16); 
        // this.spawns.create(start3.x, start3.y, 16, 16); 
        
        // this.physics.add.overlap(this.player, this.spawns1, this.startMinGame, null, this);
        this.physics.add.overlap(this.player, this.minGame1, this.playMinGame1, null, this);
        this.physics.add.overlap(this.player, this.minGame2, this.playMinGame2, null, this);
        this.physics.add.overlap(this.player, this.minGame3, this.playMinGame3, null, this);

    }

    playMinGame1() { 
        this.scene.start('Status', {votos: 0, niveles_dictonary: {'nivel1': true, 'nivel2': true}}); 
    }

    playMinGame2() { 
        this.scene.start('Status', {votos: 0, niveles_dictonary: {'nivel1': true, 'nivel2': true}}); 
    }
    
    playMinGame3() { 
        this.scene.start('Status', {votos: 0, niveles_dictonary: {'nivel1': true, 'nivel2': true}}); 
    }
    // findObjectsByType(type, tilemap, layer) {
    //     const result = [];

    //     tilemap.objects.forEach(function (element) {
    //         if (element.name === 'startMinGames') {
    //             element.objects.forEach(function (element2) {
    //                 if (element2.type === type) {
    //                     element2.y -= tilemap.tileHeight;
    //                     result.push(element2);
    //                 }
    //             });
    //         }
    //     });
    //     return result;
    // }

    // playerAlcanzaMeta() {

    //     this.scene.start('SosAmazonas');

    //     // if (i==1) {
    //     //     this.scene.start('SosAmazonas');
    //     // } 

    //     // if (i==2) {
    //     //     this.scene.start('RutaCorrupsol');
    //     // } 

    //     // if (i==3) {
    //     //     this.scene.start('SalvemosBallenas');
    //     // } 
        
    // }
    // startMinGame(){
    //     console.log('hola');
    // }

    update(time,delta)
    {
        // const cam = this.cameras.main;
        // this.personaje.body.setVelocity(0);  
        // //Pan Y
        // if(this.cursor.down.isDown)
        // {
        //     this.pany+=1;
        //     this.personaje.y+=1;
        //     cam.pan(this.panx,this.pany,30);
        //     this.personaje.body.setVelocityY(80);
            
        // }
        // if(this.cursor.up.isDown)
        // {
        //     this.pany-=1;
        //     this.personaje.y-=1;
        //     cam.pan(this.panx,this.pany,30);
        //     this.personaje.body.setVelocityY(-80);
       
        // }
        // //Pan X
        // if(this.cursor.left.isDown)
        // {
        //     this.panx-=1;
        //     this.personaje.x-=1;
        //     cam.pan(this.panx,this.pany,30);
        //     this.personaje.body.setVelocityX(-80);
         
        // }
        // if(this.cursor.right.isDown)
        // {
        //     this.panx+=1;
        //     this.personaje.x+=1;
        //     cam.pan(this.panx,this.pany,30);
        //     this.personaje.body.setVelocityX(80);
           
        // }
        // this.text.setText(['Click to move', 'x: ' + cam.scrollX, 'y: ' + cam.scrollY ]);

        // if (this.x<0)
        // {
        //     this.x=0;
        // }

        // if(this.y<0)
        // {
        //     this.y=0;
        // }
        
        // cam.pan(this.panx,this.pany,30);

        this.player.body.setVelocity(0);

     
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-100);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(100);
        }

        
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-100);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(100);
        }        

        
        if (this.cursors.left.isDown)
        {
            this.player.anims.play('left', true);
            this.player.flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.anims.play('right', true);
            this.player.flipX = false;
        }
        else if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.stop();
        }
    }
}


// class FinEscena extends Phaser.Scene {
//     constructor() {
//         super({
//             key: 'finScene'
//         });
//     }
//     preload() {
//         this.load.image('fin', 'assets/game-over.jpg');
//     }

//     create() {
//         this.add.image(480, 320, 'fin');
//     }
// }



class minGame1 extends Phaser.Scene {
    constructor() {
        super({
            key: 'SosAmazonas'
        });
    }
    preload() {
        this.load.image('fin1', 'assets/sosAmazonas.jpg');
    }

    create() {
        this.add.image(400, 300, 'fin1');
    }
}

class minGame2 extends Phaser.Scene {
    constructor() {
        super({
            key: 'RutaCorrupsol'
        });
    }
    preload() {
        this.load.image('fin2', 'assets/rutaCorrupsol.jpg');
    }

    create() {
        this.add.image(400, 300, 'fin2');
    }
}


class minGame3 extends Phaser.Scene {
    constructor() {
        super({
            key: 'SalvemosBallenas'
        });
    }
    preload() {
        this.load.image('fin3', 'assets/salvemosBallenas.jpg');
    }

    create() {
        this.add.image(400, 300, 'fin3');
    }
}




export class escenaMenu1 extends Phaser.Scene{
    constructor(){
        super({key:"menu1", active:false});
        this.temporalScenePoint= "Lobby";
    }
    preload()
    {
        this.load.image('bg-menu1', './assets/menu1/fondo_menu1.png');
        this.load.image('bg-menu2', './assets/menu1/fondo_2_menu1.jpg');

        this.load.image('deco1_menu1', './assets/menu1/barra_deco1.png');
        this.load.image('deco2_menu1', './assets/menu1/barra_deco2.png');

        this.load.image('logo-menu1', './assets/menu1/logo1.png');
        //imagenes de botones
        this.load.image('btn1-menu1', './assets/menu1/btn1.png');
        this.load.image('btn2-menu1', './assets/menu1/btn2.png');
        this.load.image('btn3-menu1', './assets/menu1/btn3.png');
    }
    create()
    {
        this.behind_back = this.add.tileSprite(centerw,centerh,game.config.width,game.config.height,'bg-menu2');
        this.background1 = this.add.tileSprite(centerw,centerh,game.config.width,game.config.height,'bg-menu1');
        this.deco1 = this.add.tileSprite(0,200,128,1200,'deco1_menu1');
        this.deco1.setAngle(45);
        this.deco2 = this.add.tileSprite(1050,500,128,900,'deco2_menu1');
        this.deco2.setAngle(55);

        this.logo = this.add.tileSprite(600,100,627,199,'logo-menu1');
        //Alpha para manejar la opacidad del logo
        this.logoAlpha = 0;
        this.logo.setAlpha(this.logoAlpha);
        this.logoDelay = 0;

        //Booleano que dispara escena
        this.NextScene=false;

        //creación de botones
        this.modoHistoria = this.add.image(300, 250, 'btn1-menu1').setInteractive();
        this.modoHistoria.on('pointerdown', function (event) {
            this.scene.start( this.temporalScenePoint);
        }, this);
        this.modoMultiplayer = this.add.image(300, 350, 'btn2-menu1').setInteractive();
        this.modoMultiplayer.on('pointerdown', function (event) {
            this.scene.start( this.temporalScenePoint);
        }, this);
        this.settings = this.add.image(300, 450, 'btn3-menu1').setInteractive();
        this.settings.on('pointerdown', function (event) {
            this.scene.start( this.temporalScenePoint);
        }, this);

    }

    update(time,delta)
    {
        //Comparacion que da un offset de 10 para iniciar la animación
        if(this.logoDelay<20)
        {
            this.logoDelay+=1;
        }else{
            //Animación del logo inicio
            if(this.logoAlpha<1)
            {
                this.logoAlpha+=0.05;
                this.logo.setAlpha(this.logoAlpha);
            }
        }

        this.behind_back.tilePositionX+=10;
        //this.deco1.tilePositionX+=1;
        this.deco1.tilePositionY-=5;
        this.deco2.tilePositionY+=10;
        //fin del ciclo update
    }
}



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
class escenaJuego1 extends Phaser.Scene{
    constructor(){
        super({key:"Lobby", active:true});
    }
    preload()
    {
        this.load.atlas('character-01', './assets/sprite-character1.png','./assets/character1.json');
    }
    create()
    {
        this.player = this.add.sprite(0,0,"character-01","c0.png").setScale(0.5);
        // this.anims.create({
        //     key:'walk',
        //     repeat:-1,
        //     frameRate:24,
        //     frames:this.anims.generateFrameNames('samus',{
        //         prefix:'s',
        //         suffix:'.png',
        //         start:0,
        //         end:3
        //     })
        // });

        // samus.play({ key: 'walk', repeat: -1 });

        // cursor = this.input.keyboard.createCursorKeys();
    }

    update(time,delta)
    {
        // if(cursor.down.isDown)
        // {
        //     samus.y+=5;
        // }
        // if(cursor.up.isDown)
        // {
        //     samus.y-=5;
        // }
    }
}

export class RutaCorrupsol extends Phaser.Scene{
    
    constructor(){
        super({key:"RutaCorrupsol", active:false});
        this.speed = 1;
        //Variables para intentar crear el hueco al Azar
        this.createTramp = true;
        this.checkcamera3DForElement1 = false;
        //Variable para hacer la animación del choque
        this.isDefeated = false;
        //Limites para el carro (el personaje del usuario)
        this.leftLimit = 100;
        this.rightLimit = 900;
        //Puntaje
        this.score = 0;
        //Oportunidades
        this.opportunities=7;
        this.master_method = 0;
        //Variables que manejan la presentación por 3 secuencias
        this.update_secuence = 1;
        this.timer_update = 0;
       
    }

    init(data)
    {
        this.votos = data.votos;
        this.niveles_dictonary = data.niveles_dictonary;
    }

    preload()
    {
        this.load.image('bg-corrupsol', './assets/rutacorrupsol/bg-corrupsol.jpg');
        this.load.atlas('rc-ruta2', './assets/rutacorrupsol/carretera-v02.png','./assets/rutacorrupsol/bg-road-atlas.json');
        this.load.atlas('rc-palmeras', './assets/rutacorrupsol/palmeras.png','./assets/rutacorrupsol/palmeras.json');
        this.load.atlas('spritecar','./assets/rutacorrupsol/sprite-car.png','./assets/rutacorrupsol/spritecar-atlas.json');
        this.load.image('rc-car', './assets/rutacorrupsol/car-test.png');
        this.load.image('rc-hueco', './assets/rutacorrupsol/hueco.png');
        this.load.atlas('rc-title', './assets/rutacorrupsol/allframes_rutaCorrupsol.png','./assets/rutacorrupsol/title_rc_anim.json');
        this.load.scenePlugin('Camera3DPlugin', './src/js/camera3d.min.js', 'Camera3DPlugin', 'cameras3d');

    }
    create()
    {
        //Animación de la carretera
        this.background = this.add.tileSprite(centerw,centerh,game.config.width,game.config.height,'bg-corrupsol');
        this.carretera = this.add.sprite(0,centerhroad+5,'rc-ruta2','cposition1.png');
        this.palmeras = this.add.sprite(-200,centerhroad-200,'rc-palmeras','palm-rc0x.png');
        this.carreteraAnimA = true;
        this.carrteraAnimB = false;
        //Animación de presentación
        this.title = this.add.sprite(0,centerh-300,'rc-title','title_rc0x.png');

        this.anims.create({
            key:'road-a',
            repeat:-1,
            frameRate:12,
            frames:this.anims.generateFrameNames('rc-ruta2',{
                prefix:'cposition',
                suffix:'.png',
                start:0,
                end:2
            })
        });

        this.anims.create({
            key:'title-rc',
            repeat:-1,
            frameRate:12,
            frames:this.anims.generateFrameNames('rc-title',{
                prefix:'title_rc',
                suffix:'x.png',
                start:0,
                end:7
            })
        });

        this.anims.create({
            key:'palmeras-rc',
            repeat:-1,
            frameRate:12,
            frames:this.anims.generateFrameNames('rc-palmeras',{
                prefix:'palm-rc',
                suffix:'x.png',
                start:0,
                end:1
            })
        });

        this.anims.create({
            key:'palmeras-rc2',
            repeat:-1,
            frameRate:24,
            frames:this.anims.generateFrameNames('rc-palmeras',{
                prefix:'palm-rc',
                suffix:'x.png',
                start:0,
                end:1
            })
        });

        this.carretera.play({ key: 'road-a', repeat: -1 });
        this.title.play({key: 'title-rc', repeat: 0});
        this.palmeras.play({key: 'palmeras-rc', repeat: -1});

    }

    update(time,delta)
    {        
        console.log(delta);
        //Revisa secuencia para ver si ya presentó el título
        //update_secuence = 0 significa que todavía no ha terminado el tiempo de la presentación
        if(this.update_secuence == 0)
        {
            this.timer_update += delta;
            //Revisa si ya han pasado 2 segundos (o 2.000 milisegundos)
            //Para cambiar a la secuencia de pseudocrear
            if(this.timer_update>=2000)
            {
                this.update_secuence=1;
            }
        }    
        
        if(this.update_secuence==1)
        {
            this.title.destroy();
            this.pseudocreate();
            this.update_secuence = 2;
        }

        if(this.update_secuence==2)
        {
            this.pseudoupdate(delta);
        }
    }
    //PseudoCreate: Create cicle for gaming
    // This method goes after the process presentation of the game
    pseudocreate(){
        
        //Crear el personaje como carro
        //Set Depth permite manejar las capas
        this.carcharacter = this.physics.add.sprite(400,590,"spritecar","carsprite1-1.png");
        this.carcharacter.setScale(2.5,2.5);
        this.carcharacter.body.setSize(80,20);
        this.carcharacter.setDepth(3);
        
        
        //Logica de crear las trampas, el elemento0 es el carro de la maquina, elemento1 es el hueco que aparece al azar
        this.createElement0();
        this.tryToCreateElement1();

       

        this.anims.create({
            key:'road-b',
            repeat:-1,
            frameRate:24,
            frames:this.anims.generateFrameNames('rc-ruta2',{
                prefix:'cposition',
                suffix:'.png',
                start:0,
                end:2
            })
        });
      

        this.anims.create({
            key:'spritecar-a',
            repeat:-1,
            frameRate:24,
            frames:this.anims.generateFrameNames('spritecar',{
                prefix:'carsprite1-',
                suffix:'.png',
                start:0,
                end:2
            })
        });

        this.anims.create({
            key:'spritecar-r',
            repeat:-1,
            frameRate:24,
            frames:this.anims.generateFrameNames('spritecar',{
                prefix:'carsprite2-',
                suffix:'.png',
                start:0,
                end:3
            })
        });

        this.anims.create({
            key:'spritecar-l',
            repeat:-1,
            frameRate:24,
            frames:this.anims.generateFrameNames('spritecar',{
                prefix:'carsprite3-',
                suffix:'.png',
                start:0,
                end:3
            })
        });
       

        
        this.carcharacter.play({ key: 'spritecar-a', repeat: -1 });

        this.cursor = this.input.keyboard.createCursorKeys();
        //Texto que lleva el tiempo
        this.textTime = this.add.text(centerw-100, 50, '02:59', { fontFamily: 'Bitwise, "Arial", Times, serif', fontSize: '5rem', color: '#ffd147'});
        //Texto que lleva el puntaje
        this.textScore = this.add.text(100, 50, '02:59', { fontFamily: 'Bitwise, "Arial", Times, serif', fontSize: '2rem', color: '#ffffff'});
        this.textOppor = this.add.text(centerw + 200, 50, 'Vidas: 7', { fontFamily: 'Bitwise, "Arial", Times, serif', fontSize: '2rem', color: '#ffffff'});
        //Variables del tiempo
        this.minutes = 0;
        this.seconds = 59;
        this.miliseconds = 1000;

    }
    //-------------------------------------------
    //-------End PseudoCreate Method -----------

    
    //PseudoUpdate: Normal cicle Update for gaming 
    // This method goes after the process presentation of the game and after PseudoCreate
    pseudoupdate(delta){
        //Logica de pseudocamaras
        this.camera3Deffect();

        this.controlCar();
        //Logica de manejar el cronometro del juego
        this.miliseconds -= delta;
        //Logica de los textos que ve el usuario
        this.printScoreText();
        this.printTimeText();
        //Revisa si tiene que crear el hueco, porque se tiene que hacer al AZAR
        this.tryToCreateElement1();
        //fin del ciclo update
    }

    //Camera 3D methods
    camera3Deffect(){
        this.camera3D_element0();
        //Revisa si el hueco fue creado para hacer un efecto de 3D
        if(this.checkcamera3DForElement1)
        {
            this.camera3D_element1();
        }
        
    }

    camera3D_element0(){
        if(this.transformScale<2)
        {
            this.transformScale += 0.025*this.speed;
            this.elemento.y+=5*this.speed;
            this.elemento.x+=this.posx/40;
            this.elemento.setScale(this.transformScale,this.transformScale);
        }else{
            this.elemento.destroy();
            this.score += this.scoreElement0;
            this.createElement0();
        }
    }

    camera3D_element1(){
        if(this.transformScale1<2)
        {
            this.transformScale1 += 0.015*this.speed;
            this.elemento1.y+=5*this.speed;
            this.elemento1.x+=-10/40;
            this.elemento1.setScale(this.transformScale1,this.transformScale1);
        }else{
            this.elemento1.destroy();
            this.score += this.scoreElement1;
            this.checkcamera3DForElement1 = false;
            this.createTramp = true;
            this.tryToCreateElement1();
        }
    }

    tryToCreateElement1(){
        let lucky =Math.floor(Math.random()*100);
        if(lucky<2 && this.createTramp)
        {
            this.createElement1();
            this.createTramp = false;
            this.checkcamera3DForElement1 = true;
        }
    }

    createElement0(){
        this.posx =Math.random()*200 -50;
        this.elemento = this.physics.add.image(centerw+this.posx, centerhroad, 'rc-car');
        this.elemento.setDepth(2);
        this.elemento.setScale(0.25,0.25);
        this.transformScale = 0.25;
        this.scoreElement0 = 50;
        this.physics.add.collider(this.carcharacter, 
            this.elemento,
             function(){
                this.scoreElement0 = -50;
                this.defeatLogic();
             },
             null,
            this);
    }

    createElement1(){
        let lucky =Math.floor(Math.random()*100);
        this.posx1 = 400;
        if(lucky<=50)
        {
            this.posx1 = 300;
        }else{
            this.posx1 = 900;
        }
        
        this.elemento1 = this.physics.add.image(this.posx1, centerhroad, 'rc-hueco');
        this.elemento1.setScale(0.25,0.25);
        this.transformScale1 = 0.15;
        this.scoreMinus = true;
        this.scoreElement1 = 50;
        this.physics.add.collider(this.carcharacter, 
            this.elemento1,
             function(){
                this.scoreElement1= -50;
                this.opportunities -=1;
                 this.defeatLogic();
             },
             null,
            this);
    }

    printTimeText(){
        if(this.miliseconds < 0)
        {
            this.miliseconds = 1000;
            this.seconds -=1;
            if(this.seconds < 0)
            {
                this.minutes -=1;
                this.seconds =59;
            }
            
            if(this.minutes <= 0 && this.seconds <= 0)
            {
                //Secuencia de game over
                // const enviar_data es lo que debe recibir cada escena para iniciar
                this.niveles_dictonary['nivel1'] = false;
                this.votos+=this.score;
                const enviar_data =  {votos: this.votos, niveles_dictonary: this.niveles_dictonary};
                this.scene.start('Status',enviar_data);
            }

            //Se coloca este condicional con el fin de cuando los segundos sean
            // menor a 10 se muestre un 0 al lado de los segundos
            if(this.seconds >= 10)
            {
                this.textTime.setText('0'+this.minutes+':'+this.seconds);
            }else{
                this.textTime.setText('0'+this.minutes+':0'+this.seconds);
            }
        }
    }

    printScoreText()
    {
        this.textScore.setText('Puntaje: '+this.score);
    }
    //Funcion sobre la animacion del carro cuando choca
    defeatLogic(){
        if(this.carcharacter.x >= centerw)
        {
            this.carcharacter.x-=200;
        }else{
            this.carcharacter.x+=200;
        }

    }

    controlCar(){

        //Inicio de controles 
            if(this.cursor.left.isDown)
            {
                if(this.carcharacter.x >= this.leftLimit)
                {
                    this.carcharacter.x-=10;
                }
                this.carcharacter.play({ key: 'spritecar-l', repeat: 1 });
            }
            
            if(this.cursor.right.isDown)
            {
                if(this.carcharacter.x <= this.rightLimit)
                {
                    this.carcharacter.x+=10;
                }
                this.carcharacter.play({ key: 'spritecar-r', repeat: 1 });
            }

            if(!this.cursor.left.isDown && !this.cursor.right.isDown)
            {
                this.carcharacter.play({ key: 'spritecar-a', repeat: -1 });
            }

            if(this.cursor.up.isDown)
            {
                if(this.speed < 2)
                {
                    this.speed+=0.05;
                }
            }else{
                if(this.speed>1)
                {
                    this.speed-=0.1;
                }
            }

            if(this.speed>2 && this.carreteraAnimA)
            {
                this.carretera.play({ key: 'road-b', repeat: -1 });
                this.palmeras.play({key: 'palmeras-rc2', repeat: -1})
                this.carreteraAnimA = false;
                this.carreteraAnimB = true;
            }

            if(this.speed<1.5 && this.carreteraAnimB)
            {
                this.carretera.play({ key: 'road-a', repeat: -1 });
                this.palmeras.play({key: 'palmeras-rc', repeat: -1})
                this.carreteraAnimA = true;
                this.carreteraAnimB = false;
            }
             //Fin de controles
             
    }
}


export class Status extends Phaser.Scene{
    constructor(){
        super({key:"Status", active:false});
        this.temporalScenePoint= "Lobby";
    }

    init(data)
    {
        this.votos = data.votos;
        this.niveles_dictonary = data.niveles_dictonary;
    }

    preload()
    {
        this.load.image('statusBackground', 'assets/status/background.jpg');
        this.load.image('statusBtn', 'assets/status/button.png');
        this.load.image('MapaIcon', 'assets/status/mapa1.png');

        
        //this.votos = 5;
        //this.niveles_dictonary = {'nivel1': true, 'nivel2': true};
    }
    create()
    {
        this.background1 = this.add.tileSprite(centerw,centerh,game.config.width,game.config.height,'statusBackground');
        this.mapIcon = this.add.tileSprite(263,380,525,682,'MapaIcon');
        //Textos
        this.texTitle = this.add.text(650, 20, 'Escoge un juego', { fontFamily: 'Bitwise, "Arial", Times, serif', fontSize: '4rem', color: '#ffffff', stroke: "#0000fa", strokeThickness :2});
        this.texTitle = this.add.text(650, 120, 'Votos Conseguidos: '+ this.votos, { fontFamily: 'Bitwise, "Arial", Times, serif', fontSize: '2rem', color: '#ffffff', stroke: "#0000fa", strokeThickness :2});

        if(this.niveles_dictonary['nivel1'])
        {
            this.texTitle = this.add.text(725, 200, 'Ruta Corrupsol', { fontFamily: 'Bitwise, "Arial", Times, serif', fontSize: '3rem', color: '#fad08f', stroke: "#0000fa", strokeThickness :2});
            this.nivel1 = this.add.sprite(900, 300, 'statusBtn').setInteractive();
            
            this.nivel1.on('pointerdown', (pointer) => {
                const enviar_data =  {votos: this.votos, niveles_dictonary: this.niveles_dictonary};
                this.scene.start('RutaCorrupsol',enviar_data);
            }, this);
        }

        if(this.niveles_dictonary['nivel2'])
        {
            this.texTitle = this.add.text(625, 500, 'Salvar Ballenas Choko', { fontFamily: 'Bitwise, "Arial", Times, serif', fontSize: '3rem', color: '#fad08f', stroke: "#0000fa", strokeThickness :2});
            this.nivel2 = this.add.sprite(900, 600, 'statusBtn').setInteractive();
            this.nivel2.on('pointerdown', (pointer) => {
                const enviar_data =  {votos: this.votos, niveles_dictonary: this.niveles_dictonary};
                this.scene.start('BallenasChoko',enviar_data);
            }, this);
        }

        
    }

    update(time,delta)
    {
        //Comparacion que da un offset de 10 para iniciar la animación
        this.background1.tilePositionY+=2;
        this.background1.tilePositionX-=5;

        //fin del ciclo update
    }
}


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
    this.load.image('background', 'http://147.182.166.122/assets/intro/background.jpg');
}

function create() {
    this.background = this.add.tileSprite(centerw,centerh,game.config.width,game.config.height,'background');
}    
