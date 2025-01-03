import Phaser from "phaser";
import { mapType } from "../../types/types";
import { spriteType } from "../../types/types";
import { spriteAssetsType } from "../../types/types";

interface keyType {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
}

// interface animationType {
//   key: string;
//   frames: number[];
// }

// interface spriteType {
//   key: string;
//   initialState: number;
//   animations: animationType[];
// }

// interface spriteSheetType {
//   key: string;
//   path: string;
//   frameWidth: number;
//   frameHeight: number;
// }

//spriteSheet
// const spriteSheetArray: spriteSheetType[] = [
//   {
//     key: "player",
//     path: "assets/sprite.png",
//     frameWidth: 16,
//     frameHeight: 16,
//   },
// ];
//sprite
// const mySprite = {
//   key: "player", //same as the sprite sheet key/reference to sprite sheet
//   initialState: 6,
//   animations: [
//     {
//       key: "right",
//       frames: [1, 7, 1, 13],
//     },
//     {
//       key: "left",
//       frames: [1, 7, 1, 13],
//     },
//     {
//       key: "up",
//       frames: [2, 8, 2, 14],
//     },
//     {
//       key: "down",
//       frames: [0, 6, 0, 12],
//     },
//   ],
// };
// const mySprite2 = {
//   key: "player", //same as the sprite sheet key/reference to sprite sheet
//   initialState: 3,
//   animations: [
//     {
//       key: "right",
//       frames: [4, 10, 4, 16],
//     },
//     {
//       key: "left",
//       frames: [4, 10, 4, 16],
//     },
//     {
//       key: "up",
//       frames: [5, 11, 5, 17],
//     },
//     {
//       key: "down",
//       frames: [3, 9, 3, 15],
//     },
//   ],
// };
// const mySprite11 = {
//   key: "player", //same as the sprite sheet key/reference to sprite sheet
//   initialState: 21,
//   animations: [
//     {
//       key: "right",
//       frames: [22, 28, 22, 34],
//     },
//     {
//       key: "left",
//       frames: [22, 28, 22, 34],
//     },
//     {
//       key: "up",
//       frames: [23, 29, 23, 35],
//     },
//     {
//       key: "down",
//       frames: [21, 27, 21, 33],
//     },
//   ],
// };
// const mySprite1 = {
//   key: "player", //same as the sprite sheet key/reference to sprite sheet
//   initialState: 18,
//   animations: [
//     {
//       key: "right",
//       frames: [19, 25, 19, 31],
//     },
//     {
//       key: "left",
//       frames: [19, 25, 19, 31],
//     },
//     {
//       key: "up",
//       frames: [20, 26, 20, 32],
//     },
//     {
//       key: "down",
//       frames: [18, 24, 18, 30],
//     },
//   ],
// };
export default class WorldScene extends Phaser.Scene {
  socket!: WebSocket | null;
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  otherPlayer!: Map<string, Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>;
  private _id!: string;
  map!: Phaser.Tilemaps.Tilemap;
  name!: string;
  room!: string;
  messageListener!: (event: { data: string }) => void;
  cursors: keyType | undefined;
  spawnArea: Phaser.Types.Tilemaps.TiledObject[] | undefined;
  mapData: mapType;
  spriteAssets: spriteAssetsType[];
  sprites: spriteType[];
  mySpriteId!: number;

  constructor({
    scene,
    mapData,
    spritesAssets,
    sprites,
  }: {
    scene: string;
    mapData: mapType;
    spritesAssets: spriteAssetsType[];
    sprites: spriteType[];
  }) {
    super({ key: scene });
    this.mapData = mapData;
    this.spriteAssets = spritesAssets;
    this.sprites = sprites;
    this.otherPlayer = new Map();
  }

  init(data: { socket: WebSocket; name: string; room: string }) {
    this.socket = data.socket;
    this.name = data.name;
    this.room = data.room;
  }

  preload() {
    //assets such as tile image
    this.mapData.assets?.forEach((asset) => {
      this.load.image(asset.id.toString(), asset.path);
    });

    //load tileset
    this.load.tilemapTiledJSON("map", this.mapData.tileSet);

    //load character
    this.spriteAssets.forEach((sprite) => {
      this.load.spritesheet(sprite.key.toString(), sprite.path, {
        frameWidth: sprite.frameWidth,
        frameHeight: sprite.frameHeight,
      });
    });
  }
  generateRandomPosition() {
    if (this.spawnArea) {
      const randomZoneIndex = Math.floor(Math.random() * this.spawnArea.length);
      const randomZone = this.spawnArea[randomZoneIndex];
      if (
        randomZone &&
        randomZone.width &&
        randomZone.x &&
        randomZone.height &&
        randomZone.y
      ) {
        const x = Math.floor(Math.random() * randomZone.width + randomZone.x);
        const y = Math.floor(Math.random() * randomZone.height + randomZone.y);
        return { x, y };
      }
    }
    return { x: 300, y: 400 };
  }
  generateId = (len: number) => {
    const random = "abcdefghijklmnopqrstuvwxyz1234567890";
    let answer = "";
    for (let i = 0; i < len; i++) {
      answer = answer + random[Math.floor(Math.random() * 36)];
    }
    return answer;
  };

  create() {
    this.map = this.make.tilemap({ key: "map" });
    const tiles: Phaser.Tilemaps.Tileset[] = [];
    const layers: Phaser.Tilemaps.TilemapLayer[] = [];
    this.mySpriteId = Math.floor(Math.random()*4);
    const mySprite = this.sprites[this.mySpriteId];
    this.spawnArea = this.map.getObjectLayer("spawn")?.objects;
    // const spawnPoints = this.map.findObject('spawn zone',(obj) => obj.name)

    //loading assetsl into the screen
    this.mapData.assets?.forEach((assets) => {
      const temp = this.map.addTilesetImage(assets.name, assets.id.toString());
      if (temp) {
        if (tiles) tiles.push(temp);
      }
    });

    //creating layers
    if (tiles) {
      this.mapData.layers?.forEach((layerObj) => {
        const layer = this.map.createLayer(layerObj.name, tiles, 0, 0);
        layer?.setDepth(layerObj.depth);
        if (layer) {
          layers.push(layer);
        }
      });
    }
    const position = this.generateRandomPosition();
    //adding player sprite
    this.player = this.physics.add.sprite(
      position.x,
      position.y,
      mySprite.key.toString(),
      mySprite.initialState,
    );

    //setting depth of layers above sprite
    // layers[layers.length - 1].setDepth(1); //spawn should be the last layer in the array
    //no need of this will remove later..... after fixing layer in tiled images
    layers[layers.length - 2].setDepth(1); //foreground should

    //setting collision of the sprite with obstacles
    const obstacles = layers[layers.length - 1];
    obstacles?.setCollisionByExclusion([-1]);

    //increase the size of the spirite
    this.player.displayWidth = 27;
    this.player.scaleY = this.player.scaleX;

    this._id = this.generateId(8);

    //spirite animations
        this.sprites.map((sprite) => {
          sprite.animations.map((animations)=>{
              this.anims.create({
                key: `${animations.key}-${animations.spriteId}`,
                frames: this.anims.generateFrameNumbers(mySprite.key.toString(), {
                  frames: animations.frames,
                }),
                frameRate: 10,
                repeat: -1,
              });
          })
      })

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "joingame",
          payload: {
            id: this._id,
            x: this.player.x,
            y: this.player.y,
            initialState: mySprite.initialState,
            key: mySprite.key.toString(),
            room: this.room,
          },
        }),
      );
      console.log("client connected to server");
    }
    //listen for the updates for other players from server
    this.messageListener = (event: { data: string }) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.type === "init") {
        //initializing other players
        parsedData.players.forEach(
          (playerData: {
            id: string;
            x: number;
            y: number;
            initialState: number;
            key: string;
          }) => {
            if (playerData.id !== this._id && playerData.x && playerData.y) {
              const otherPlayer = this.physics.add.sprite(
                playerData.x,
                playerData.y,
                playerData.key,
                playerData.initialState,
              );
              otherPlayer.displayWidth = 27;
              otherPlayer.scaleY = otherPlayer.scaleX;
              this.otherPlayer.set(playerData.id, otherPlayer);
            }
          },
        );
      } else if (parsedData.type === "updatePlayer") {
        const { id, x, y, initialState, key } = parsedData.payload;
        //check if the player being updated is present in the map or not
        if (!this.otherPlayer.has(id)) {
          //create a new player if not already in the map
          const otherPlayer = this.physics.add.sprite(x, y, key, initialState);
          otherPlayer.displayWidth = 27;
          otherPlayer.scaleY = otherPlayer.scaleX;
          this.otherPlayer.set(id, otherPlayer);
        } else {
          const otherPlayer = this.otherPlayer.get(id);
          if (otherPlayer) {
            otherPlayer.setPosition(x, y);
          }
        }
      } else if (parsedData.type === "removePlayer") {
        const { id } = parsedData.payload;
        const otherPlayer = this.otherPlayer.get(id);
        if (otherPlayer) {
          otherPlayer.destroy(); //destroy the spirit
          this.otherPlayer.delete(id); //remove from the map
        }
      } else if (parsedData.type === "updateAnimation") {
        const { key, id } = parsedData.payload;
        const otherPlayer = this.otherPlayer.get(id);
        if (otherPlayer) {
          if(key === "stop"){
            otherPlayer.anims.stop();
          }else{
            if(key === "left"){
              otherPlayer.flipX = true;
              otherPlayer.anims.play(key,true);
            }else if(key === "right"){
              otherPlayer.anims.play(key,true);
              otherPlayer.flipX = false;
            }else {
              otherPlayer.anims.play(key,true);
            }
          }
        }
      }
    };

    this.socket?.addEventListener("message", this.messageListener);

    // emit player position to the server in regular interval
    this.time.addEvent({
      delay: 10,
      callback: () => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(
            JSON.stringify({
              type: "updatePlayer",
              payload: {
                id: this._id,
                x: this.player.x,
                y: this.player.y,
                initialState: mySprite.initialState,
                key: mySprite.key.toString(),
                room: this.room,
              },
            }),
          );
        }
      },
      loop: true,
    });


    //setting player bound

    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;
    this.player.setCollideWorldBounds(true);

    //adding colliding physics with obstacles

    if (obstacles) this.physics.add.collider(this.player, obstacles);

    //adding cursor keys for our spirits
    this.cursors = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    }) as keyType;

    //camera controls
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels,
    );
    this.cameras.main.setZoom(2.5);
    this.cameras.main.startFollow(this.player);
  }

  update(): void {
    this.player.body.setVelocity(0);

    //movements
    if (this.cursors && this.cursors.left.isDown) {
      this.player.body.setVelocityX(-80);
    } else if (this.cursors && this.cursors.right.isDown) {
      this.player.body.setVelocityX(80);
    } else if (this.cursors && this.cursors.down.isDown) {
      this.player.body.setVelocityY(80);
    } else if (this.cursors && this.cursors.up.isDown) {
      this.player.body.setVelocityY(-80);
    }

    //animations
    const myAnimations = this.sprites[this.mySpriteId].animations[0];
    if (this.cursors && this.cursors.left.isDown) {
      this.player.anims.play(`left-${myAnimations.spriteId}`, true);
      this.player.flipX = true;
    } else if (this.cursors && this.cursors.right.isDown) {
      this.player.anims.play(`right-${myAnimations.spriteId}`, true);
      this.player.flipX = false;
    } else if (this.cursors && this.cursors.down.isDown) {
      this.player.anims.play(`down-${myAnimations.spriteId}`, true);
    } else if (this.cursors && this.cursors.up.isDown) {
      this.player.anims.play(`up-${myAnimations.spriteId}`, true);
    } else {
      this.player.anims.stop();
    }

    //propagate animations
    // let prevKey;
    // let clock;
    if (
      this.cursors &&
      (this.cursors.left.isDown ||
        this.cursors.right.isDown ||
        this.cursors.up.isDown ||
        this.cursors.down.isDown)
      ) {
        let key;
        if (this.cursors.down.isDown) {
        key = "down";
      } else if (this.cursors.up.isDown) {
        key = "up";
      } else if (this.cursors.left.isDown) {
        key = "left";
      } else {
        key = "right";
      }
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(
          JSON.stringify({
            type: "updateAnimation",
            payload: {
              id: this._id,
              key: `${key}-${myAnimations.spriteId}`,
              room: this.room,
            },
          }),
        );
      }
    } else {
          if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(
              JSON.stringify({
                type: "updateAnimation",
                payload: {
                  id: this._id,
                  key: "stop",
                  room: this.room,
                },
              }),
            );
          }
    }
  }

  shutdown() {
    if (this.socket) {
      this.socket.removeEventListener("message", this.messageListener);
    }
  }
}
