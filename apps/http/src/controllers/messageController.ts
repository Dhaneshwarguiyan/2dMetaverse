import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express";

const prisma = new PrismaClient();

export const setMessage = async (req:Request, res:Response) => {
    const id = req.userId;
    const { message, room, sender } = req.body;
    try {
      const response = await prisma.messages.create({
        data: {
          sender: sender,
          message: message,
          room: room,
          read:[sender],
          userId: Number(id),
        },
      });
      res.status(200).send({ message: "Message Sent successfully",response:response });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

export const getMessages = async (req:Request, res:Response) => {
    //this message will only be fetched first time the chat component got rendered
    const { room } = req.body;
    try {
      const message = await prisma.messages.findMany({
        where: {
          room: room,
        },
        select:{
          sender:true,
          message:true,
          read:true
        }
      });
      if (message) {
        res.status(200).send(message);
        return;
      }
      res.status(200).send({});
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  //bug in this fix it high priority
export const setAsRead = async (req:Request,res:Response) => {
  // try {
  //   await prisma.messages.updateMany({
  //     where:{
  //       read:false
  //     },
  //     data:{
  //       read:true
  //     }
  //   })
  //   res.send({messag:"Successfully marked as true"});
  // } catch (error) {
  //   res.status(500).send({message:"Internal server error"});
  // }
}

export const deleteAllMessages = async (req:Request,res:Response) => {
  try {
    await prisma.messages.deleteMany({});
    res.send({message:"Successfully deleted all messages"});
  } catch (error) {
    res.status(500).send({message:"Internal server error"});
  }
}