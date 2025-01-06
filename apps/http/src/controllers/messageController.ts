import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express";

const prisma = new PrismaClient();

export const setMessage = async (req:Request, res:Response) => {
    const id = req.userId;
    const { message, room, sender } = req.body;
    try {
      await prisma.messages.create({
        data: {
          sender: sender,
          message: message,
          room: room,
          userId: Number(id),
        },
      });
      res.status(200).send({ message: "Message Sent successfully" });
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