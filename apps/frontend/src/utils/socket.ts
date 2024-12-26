let socket: WebSocket | null = null;


export const getSocket = ():WebSocket | null => {
    return socket;
}

export const setWebSocket = (ws:WebSocket):void => {
    socket = ws;
}