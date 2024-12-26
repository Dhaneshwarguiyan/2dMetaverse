let socket: WebSocket | null = null;
import Phaser from "phaser";


export const getSocket = ():WebSocket | null => {
    return socket;
}

export const setWebSocket = (ws:WebSocket):void => {
    socket = ws;
}


const messageEvents = (_id) => {
    return (event: { data: string; }) => {
        const parsedData = JSON.parse(event.data);
        if(parsedData.type === 'init'){
            //initializing other players
            parsedData.players.forEach((playerData:{id:string,x:number,y:number}) => {
               if(playerData.id !== _id && playerData.x && playerData.y){
                    const otherPlayer = this.physics.add.sprite(playerData.x,playerData.y,'player',6);
                    otherPlayer.displayWidth = 27;
                    otherPlayer.scaleY = otherPlayer.scaleX;
                    this.otherPlayer.set(playerData.id,otherPlayer);
               }
            }  
        )} else if (parsedData.type === "updatePlayer"){
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
        }
}