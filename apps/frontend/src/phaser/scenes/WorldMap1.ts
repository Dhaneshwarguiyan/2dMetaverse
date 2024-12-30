import Phaser from "phaser";

interface keyType {
    up: Phaser.Input.Keyboard.Key, 
    down: Phaser.Input.Keyboard.Key, 
    left: Phaser.Input.Keyboard.Key, 
    right: Phaser.Input.Keyboard.Key 
}

interface animationType {
    key:string;
    frames:number[]
}

interface spriteType {
    key:string;
    initialState:number;
    animations:animationType[]
}

interface tileAssetType {
    key:string; //each key should be unique
    path:string;
    name:string; //the name should be same as the name in the file path
}

interface spriteSheetType {
    key:string,
    path:string,
    dimensions:{
        frameWidth:number,
        frameHeight:number
    }
}

//this is the data that will be passed to the constructor
const imageAssets:tileAssetType[] = [{
    key:"tile1", //this can be anything and dont need user intervention and unique
    path:"assets/magecity.png", //path must be specified
    name:"magecity" //this will probably figure out if user intervention is needed or not
},
{
    key:"tile2",
    path:"assets/container.png",
    name:"container"
},
]

const layersArray:{name:string,depth:number}[] = 
    [{name:"floor",depth:0},
    {name:"border",depth:0},
    {name:"decoration1",depth:0},
    {name:"decoration2",depth:0},
    {name:"decoration3",depth:0},
    {name:"foreground",depth:1},
    {name:"obstacles",depth:1},
    {name:"spawn",depth:0}
];


//spriteSheet
const spriteSheetArray:spriteSheetType[] = [
        {
            key:"player",
            path:"assets/sprite.png",
            dimensions:{
                frameWidth:16,
                frameHeight:16
            }
        }
    ]
//sprite
const mySprite:spriteType = 
    {
    key:"player", //same as the sprite sheet key/reference to sprite sheet
    initialState:6,
    animations:[{
        key:"right",
        frames:[1,7,1,13]
    },
    {
        key:"left",
        frames:[1,7,1,13]
    },
    {
        key:"up",
        frames:[2,8,2,14]
    },
    {
        key:"down",
        frames:[0,6,0,12]
    }
    ]
    }

export default class WorldScene extends Phaser.Scene{
    socket!:WebSocket | null;
    player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    otherPlayer!: Map<string, Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>;
    private _id!: string;
    map!: Phaser.Tilemaps.Tilemap;
    name!: string;
    room!: string;
    messageListener!: (event: { data: string; }) => void;
    cursors: keyType | undefined;
    spawnArea: Phaser.Types.Tilemaps.TiledObject[] | undefined;
    
    constructor(scene:string){
        super({key:scene});
        this.otherPlayer = new Map(); 
    }

    init (data:{socket:WebSocket,name:string,room:string}){
        this.socket = data.socket;
        this.name = data.name;
        this.room = data.room;
    }
    
    preload(){
        //assets such as tile image
        imageAssets.forEach(asset => {
            this.load.image(asset.key,asset.path);

        })

        //load tileset
        this.load.tilemapTiledJSON('map','assets/forest3.json');

        //load character
        spriteSheetArray.forEach(sprite => {
            this.load.spritesheet(sprite.key,sprite.path,sprite.dimensions);
        });
        // this.load.spritesheet('player',"assets/sprite.png",{
        //     frameWidth:16,
        //     frameHeight:16
        // });
    }
    generateRandomPosition(){
       if(this.spawnArea){
        const randomZoneIndex = Math.floor(Math.random()*this.spawnArea.length);
        const randomZone = this.spawnArea[randomZoneIndex]
        if(randomZone && randomZone.width && randomZone.x && randomZone.height && randomZone.y){
            const x = Math.floor(Math.random()*randomZone.width + randomZone.x);
            const y = Math.floor(Math.random()*randomZone.height + randomZone.y);
            return {x,y};
        }
       }
       return {x:300,y:400};
    }
    generateId = () => {
        const random = "abcdefghijklmnopqrstuvwxyz1234567890";
        let answer = "";
        for(let i = 0;i<8;i++){
            answer = answer + random[Math.floor(Math.random()*36)];
        }
        return answer;
    }

    create(){

        this.map = this.make.tilemap({key:'map'});
        const tiles:Phaser.Tilemaps.Tileset[] = [];
        const layers:Phaser.Tilemaps.TilemapLayer[] = [];
        this.spawnArea = this.map.getObjectLayer('spawn')?.objects;
        // const spawnPoints = this.map.findObject('spawn zone',(obj) => obj.name)

        //loading assetsl into the screen
        imageAssets.forEach((assets) => {
            const temp = this.map.addTilesetImage(assets.name,assets.key);
            if(temp){
                if(tiles) tiles.push(temp);
            }
        })

        //creating layers
        if(tiles){
            layersArray.forEach((layerObj) => {
                const layer = this.map.createLayer(layerObj.name,tiles,0,0);
                layer?.setDepth(layerObj.depth);
                if(layer){
                    layers.push(layer);
                }
            })
        }
        const position = this.generateRandomPosition();
        //adding player sprite
        this.player = this.physics.add.sprite(position.x,position.y,mySprite.key,mySprite.initialState);
        //setting depth of layers above sprite
        layers[layers.length - 1].setDepth(1); //foreground should be the last layer in the array
        //no need of this will remove later..... after fixing layer in tiled images
        layers[layers.length - 2].setDepth(1); //obstacles should

        //setting collision of the sprite with obstacles
        const obstacles = layers[layers.length - 1];
        obstacles?.setCollisionByExclusion([-1]);

        
        //increase the size of the spirite
        this.player.displayWidth = 27;
        this.player.scaleY = this.player.scaleX;


        

        this._id = this.generateId();

        if(this.socket && this.socket.readyState === WebSocket.OPEN){
            this.socket.send(JSON.stringify({
                type:"joingame",
                payload:{
                    id:this._id,
                    x:this.player.x,
                    y:this.player.y,
                    room:this.room
                }
            }))
            console.log("client connected to server");
        }
        
        //listen for the updates for other players from server
        this.messageListener = (event: { data: string; }) => {
            const parsedData = JSON.parse(event.data);
            if(parsedData.type === 'init'){
                //initializing other players
                parsedData.players.forEach((playerData:{id:string,x:number,y:number}) => {
                   if(playerData.id !== this._id && playerData.x && playerData.y){
                        const otherPlayer = this.physics.add.sprite(playerData.x,playerData.y,'player',6);
                        otherPlayer.displayWidth = 27;
                        otherPlayer.scaleY = otherPlayer.scaleX;
                        this.otherPlayer.set(playerData.id,otherPlayer);
                   }
                }  
            )} else if (parsedData.type === "updatePlayer"){
                console.log(parsedData.payload);
                const {id ,x , y} = parsedData.payload;
                //check if the player being updated is present in the map or not
                if(!this.otherPlayer.has(id)){
                    //create a new player if not already in the map
                    const otherPlayer = this.physics.add.sprite(x,y,'player',6);
                    otherPlayer.displayWidth = 27;
                    otherPlayer.scaleY = otherPlayer.scaleX;
                    this.otherPlayer.set(id,otherPlayer);
                }else {
                    const otherPlayer = this.otherPlayer.get(id);
                    if(otherPlayer){
                        otherPlayer.setPosition(x,y);
                    }
                }
            }  else if (parsedData.type === "removePlayer"){
                const {id} = parsedData.payload;
                const otherPlayer = this.otherPlayer.get(id);
                if(otherPlayer){
                    otherPlayer.destroy(); //destroy the spirit
                    this.otherPlayer.delete(id); //remove from the map
                }
            } else if ( parsedData.type === "updateAnimation"){
                const {key,id} = parsedData.payload;
                console.log(parsedData.payload);
                const otherPlayer = this.otherPlayer.get(id);
                if(otherPlayer){
                    if(key !== "stop") {
                        otherPlayer.anims.play(key);
                        if(key === "left"){
                            otherPlayer.flipX =  true;
                        }
                        if(key === "right"){
                            otherPlayer.flipX =  false;
                        }
                    }
                    else otherPlayer.anims.stop();
                }
            }
          };

        this.socket?.addEventListener('message',this.messageListener);

        // emit player position to the server in regular interval
        this.time.addEvent({
            delay:60,
            callback: () => {
                if(this.socket && this.socket.readyState === WebSocket.OPEN){

                    this.socket.send(JSON.stringify({
                        type:"updatePlayer",
                        payload:{
                            id:this._id,
                            x:this.player.x,
                            y:this.player.y,
                            room:this.room
                        }
                    }));
                }
            },
            loop:true,
        });



        //spirite animations
        mySprite.animations.forEach((animations) => {
            this.anims.create({
                key:animations.key,
                frames: this.anims.generateFrameNumbers(mySprite.key,{
                    frames: animations.frames
                }),
                frameRate: 10,
                repeat: -1
            })
        })


        //setting player bound

        this.physics.world.bounds.width = this.map.widthInPixels;
        this.physics.world.bounds.height = this.map.heightInPixels;
        this.player.setCollideWorldBounds(true);
        
        //adding colliding physics with obstacles

        if(obstacles) this.physics.add.collider(this.player,obstacles);

        //adding cursor keys for our spirits
        this.cursors = this.input.keyboard?.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        }) as keyType;

        //camera controls
        this.cameras.main.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
        this.cameras.main.setZoom(2.5);
        this.cameras.main.startFollow(this.player);
    }

    update(): void {
        
        this.player.body.setVelocity(0);

        //movements
        if (this.cursors && this.cursors.left.isDown){
            this.player.body.setVelocityX(-80);
        }else if(this.cursors && this.cursors.right.isDown){
            this.player.body.setVelocityX(80);
        }
        else if(this.cursors && this.cursors.down.isDown){
            this.player.body.setVelocityY(80);
        }else if(this.cursors && this.cursors.up.isDown){
            this.player.body.setVelocityY(-80);
        }

        //animations
        
        if (this.cursors && this.cursors.left.isDown){
            this.player.anims.play('left',true);
            this.player.flipX =  true;
        }else if(this.cursors && this.cursors.right.isDown){
            this.player.anims.play('right',true);
            this.player.flipX = false;
        }
        else if(this.cursors && this.cursors.down.isDown){
            this.player.anims.play("down",true);
        }else if(this.cursors && this.cursors.up.isDown){
            this.player.anims.play("up",true);
        }else{
            this.player.anims.stop();
        }

        //propagate animations
        if(this.cursors && (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown)){
            let key;
            if(this.cursors.down.isDown){
                key = "down"
            }else if(this.cursors.up.isDown){
                key = "up"
            }else if (this.cursors.left.isDown){
                key = "left"
            }else{
                key = "right"
            }
            if(this.socket && this.socket.readyState === WebSocket.OPEN){
                this.socket.send(JSON.stringify({
                    type:"updateAnimation",
                    payload:{
                        id:this._id,
                        key:key,
                        room:this.room
                    }
                }));
            }
        }
        else
        {
            if(this.socket && this.socket.readyState === WebSocket.OPEN){
                this.socket.send(JSON.stringify({
                    type:"updateAnimation",
                    payload:{
                        id:this._id,
                        key:"stop",
                        room:this.room
                    }
                }));
            }
        }

    }

    shutdown() {
        if(this.socket){
            this.socket.removeEventListener('message',this.messageListener);
        }
    }
}





        // this.anims.create({
        //     key:'right',
        //     frames: this.anims.generateFrameNumbers('player',{
        //         frames: [1,7,1,13]
        //     }),
        //     frameRate: 10,
        //     repeat: -1
        // })
        // this.anims.create({
        //     key:"left",
        //     frames:this.anims.generateFrameNumbers("player",{
        //         frames:[1,7,1,13],
        //     }),
        //     frameRate:10,
        //     repeat:-1,
        // })
        // this.anims.create({
        //     key:'up',
        //     frames:this.anims.generateFrameNumbers('player',{
        //         frames:[2,8,2,14],
        //     }),
        //     frameRate:10,
        //     repeat:-1,
        // })
        // this.anims.create({
        //     key:"down",
        //     frames:this.anims.generateFrameNumbers("player",{
        //         frames:[0,6,0,12]
        //     }),
        //     frameRate:10,
        //     repeat:-1
        // })