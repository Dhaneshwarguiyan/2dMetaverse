export interface assetsType {
    id:number;
    mapId:number;
    name:string;
    path:string
}

export interface layersType {
    id:number;
    name:string;
    depth:number;
    mapId:number;
}

export interface mapType {
    id:number;
    name:string;
    tileSet:string;
    layers:layersType[];
    assets:assetsType[];
}