import { WebSocketServer,WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface player {
    socket:WebSocket;
    id:number;
    x:number;
    y:number;
    //for room logic will be implemented later
    //id:WebSocket
}

//No room logic implemented for now
//later implement the room logic
//const players  = new Map<string,player>();
const players = new Map<number,player>();

wss.on('connection', (socket) => {
  console.log(players);
  let myId = -1;
  //listen for messages from the client
  socket.on('message',(message)=>{
    const parsedData = JSON.parse(message.toString());
    
    if(parsedData.type === 'join'){
      const {id,x,y} = parsedData.payload;
      myId = id;
      if(id && x && y){
        players.set(id,{id,x,y,socket});
      }
      //initializing the current player details in the map
      socket.send(
        JSON.stringify(
          {
            type:'init',
            players:Array.from(players.values()),
          }
        )
      )
    }

    //for updating the player location
    if (parsedData.type === 'updatePlayer'){
      const {id, x, y } = parsedData.payload;
      players.set(id, { id,x,y,socket});

      //broadcast the updated position to all other clients
      //this is working fine but using the socket its not working
      wss.clients.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type:'updatePlayer',
            payload:{
              id,
              x,
              y
            }
          }));
        }
      });
    }
    //for messaging
    if(parsedData.type === 'message'){
      players.forEach((values)=>{
        if(values.socket.readyState === WebSocket.OPEN){
          values.socket.send(JSON.stringify({
            type:"message",
            payload:{
              sender:"me",
              message:"hello"
            } 
          }));
        }
        // values.socket.send(JSON.stringify({
        //     type:"message",
        //     payload:{
        //       sender:parsedData.payload.sender,
        //       message:parsedData.payload.message
        //     }
        // }))
      })
    }
  })

  //when the client is disconnected remove it from the map
  socket.on('close',()=>{
    console.log(`${myId} disconnected`);
    players.delete(myId);

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

  // socket.on('message', (message) => {
  //     const parsedData = JSON.parse((message.toString()));
  //     const x = parsedData.payload.x;
  //     const y = parsedData.payload.y;
  //     //type === join
  //   //   if(parsedData.type === "join"){
  //   //     //adding the player info with location
  //   //     players.set(socket,{x,y});
  //   //     //send to everyone except itself avoid ping pong
  //   //     //we are broadcasting the positio of 
  //   //     //this player to every other player
  //   //     players.forEach(({x,y},ws) => {
  //   //         if(ws !== socket){

  //   //             //player data will be sent in this format..
  //   //             const messageData = {
  //   //                 x,
  //   //                 y,
  //   //                 id:count
  //   //             }

  //   //             ws.send(JSON.stringify(messageData));
  //   //         }
  //   //     })
  //   //   }
  //     //type === update player
  //     if(parsedData.type === "updatePlayer"){
  //       players.set(socket,{x,y});
  //       players.forEach(({x,y},ws) => {
  //         if(ws !== socket){
  //               //player data will be sent in this format..
  //           const messageData = {
  //                 x,
  //                 y,
  //                 id:count
  //             }
                
  //             ws.send(JSON.stringify(messageData));
  //           }
  //         })
  //     }

  //     //type === test
  //     // if(parsedData.type === "test"){
  //     //   players.forEach(({},ws)=>{
  //     //       if(ws !== socket){
  //     //           ws.send("Test Passed");
  //     //       }
  //     //   })
  //     // }
  // });


});