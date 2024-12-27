import { WebSocketServer,WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface player {
    id:number;
    x:number;
    y:number;
    room:string;
}


const players = new Map<number,player>();
//to get the info of the clients connected to the room
const clientsMessage = new Map<string,WebSocket[]>();
// const clientsGame = new Map<string,WebSocket[]>();

wss.on('connection', (socket) => {
  let myId = -1;
  //listen for messages from the client
  socket.on('message',(message)=>{
    const parsedData = JSON.parse(message.toString());

    //this will initialize a room containing all the sockets


    //join message
    if(parsedData.type === "joinmessage"){
      const {room} = parsedData.payload;
      if(clientsMessage.has(room)){
        const clientArray = clientsMessage.get(room);
        if(clientArray && !clientArray?.includes(socket)){
          clientsMessage.set(room,[...clientArray,socket])
        }
      }else{
        clientsMessage.set(room,[socket]);
      }
    }

    //join game
    if(parsedData.type === 'joingame'){
      const {id,x,y,room} = parsedData.payload;

      //logic to store the socket w.r.t room
      // if(clientsMessage.has(room)){
      //   const clientArray = clientsMessage.get(room);
      //   if(clientArray && !clientArray?.includes(socket)){
      //     clientsMessage.set(room,[...clientArray,socket])
      //   }
      // }else{
      //   clientsMessage.set(room,[socket]);
      // }


      myId = id;

      if(id && x && y){
        players.set(id,{id,x,y,room});
      }

      //get only those players where the room id is same
      const playersArray = Array.from(players.values()).filter((player)=>{
        return player.room === room;
      })
      //initializing the current player details in the map
      socket.send(
        JSON.stringify(
          {
            type:'init',
            players:playersArray,
          }
        )
      )
    }

    //for updating the player location
    if (parsedData.type === 'updatePlayer'){
      const {id, x, y ,room} = parsedData.payload;
      players.set(id, { id,x,y,room});

      //broadcast the updated position to all other clients
      const messageData = {
        type:'updatePlayer',
        payload:{
          id,
          x,
          y
        }
      }
      const playerArray = clientsMessage.get(room);
      playerArray?.forEach((ws)=>{
        if(ws !== socket){
          ws.send(JSON.stringify(messageData))
        }
      })
    }

    //message
    if(parsedData.type === "message"){
      const {sender,message,room} = parsedData.payload;
      const messageData = {
        type:"message",
        payload:{
          sender,
          message,
          room
        }
      }
      if(clientsMessage.has(room)){
        const clientArray = clientsMessage.get(room);
        clientArray?.forEach((clients)=>{
          if(clients && clients.readyState === WebSocket.OPEN && clients !== socket){
            clients.send(JSON.stringify(messageData));
          }else{
            console.log("couldnt send the message")
          }
        })
      }else{
        console.log("no room exists");
      }
    }

  })

  //when the client is disconnected remove it from the map
  socket.on('close',()=>{
    console.log(`${myId} disconnected`);
    players.delete(myId);

    //removing socket instance from message memory



    // broadcasting the removal of the client
    wss.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type:'removePlayer',
          payload:{
            id:myId
          }
        }));
      }
    });
  })


});