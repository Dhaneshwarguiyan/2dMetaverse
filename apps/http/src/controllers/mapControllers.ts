import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express";

const prisma = new PrismaClient();

export const createMaps =  async (req:Request,res:Response) => {
    try {
      const { name, tileSet } = req.body;
      const response = await prisma.maps.create({
        data: {
          name,
          tileSet,
        },
      });
      res.send(response);
    } catch (error: any) {
      if (error.code === "P2002") {
        const target = error.meta.target;
        res.status(400).send({ message: `${target} already exists` });
        return;
      }
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  export const createLayers = async (req:Request,res:Response) => {
    try {
      const { layers } = req.body; //layers will contain the id of the map also
      const response = await prisma.mapLayers.createMany({
        data: layers,
        skipDuplicates: true,
      });
      res.send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  export const createAssets = async (req:Request,res:Response) => {
    try {
      const { assets } = req.body; //assets will contain the id of the map in mapId
      const response = await prisma.mapAssets.createMany({
        data: assets,
        skipDuplicates: true,
      });
      res.send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

export const createSpaces = async (req:Request,res:Response) => {
    try {
      const { room, mapId } = req.body;
      const id = req.userId;
      const response = await prisma.rooms.create({
        data: {
          room,
          mapId,
          userId: Number(id),
        },
      });
      res.send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

export const deleteSpaces = async(req:Request,res:Response)=>{
    try {
      const { room } = req.body;
      const id = req.userId;
      const messages = prisma.messages.deleteMany({
        where:{
          room:room
        }
      })
      const rooms  =  prisma.rooms.delete({
        where:{
          room,
          userId:Number(id)
        }
      })
      const response = await prisma.$transaction([messages,rooms])
      res.send(response);
    } catch (error) {
      console.log(error);
    }
}

export const getUserSpaces = async (req:Request,res:Response) => {
    try {
      const userId = req.userId;
      const response = await prisma.rooms.findMany({
        where: {
          userId: Number(userId),
        },
      });
      res.send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

export const addVisitedSpaces = async (req:Request,res:Response) => {
  try {
    const id = req.userId;
    const { room } = req.body;
    console.log(room)
    const response = await prisma.user.update({
      where:{id:Number(id)},
      data:{
        visitedRooms:{
          push:[room]
        }
      }
    })
    console.log(response);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Internal server error"});
  }
}

export const removeVisitedSpaces = async (req:Request,res:Response)=>{
  try {
    const id = req.userId;
    const { room } = req.body; //room = ["room1","room2","room3"]
    const response = await prisma.user.update({
      where:{id:Number(id)},
      data:{
        visitedRooms:{
          set:room
        }
      }
    })
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Internal server error"});
  }
}

export const getVisitedSpaces = async (req:Request, res:Response) => {
  try {
    const id = req.userId;
    const response = await prisma.user.findUnique({
      where:{id:Number(id)},
      select:{
        visitedRooms:true
      }
    })
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Internal server error"})
  }
}

export const checkSpace =  async (req:Request,res:Response) => {
    try {
      const room = req.params.spaceId;
      const response = await prisma.rooms.findUnique({
        where: {
          room: room,
        },
      });
      if (response) {
        res.send({ message: true });
        return;
      }
      res.send({ message: false });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

export const getMap = async (req:Request,res:Response) => {
    try {
      const room = req.params.spaceId;
      const response1 = await prisma.rooms.findUnique({
        where: {
          room: room,
        },
        select: {
          mapId: true,
        },
      });
      if (response1) {
        const response2 = await prisma.maps.findUnique({
          where: {
            id: response1.mapId,
          },
          include: {
            layers: true,
            assets: true,
          },
        });
        res.send(response2);
        return;
      }
      res.status(404).send({ message: "No room found" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  export const getAllMaps = async (req:Request,res:Response) => {
    try {
      const response = await prisma.maps.findMany({});
      res.status(200).send(response);
    } catch (error) {
      res.send({ message: "Internal Server Error" });
    }
  }