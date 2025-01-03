import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

//creating sprite assets
router.post('/create/assets',async(req,res) => {
    try {
        const {path,frameWidth,frameHeight} = req.body;
        const response = await prisma.spriteAssets.create({
            data:{
                path,
                frameWidth,
                frameHeight
            }
        })
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Internal server error"});
    }
})

//creating sprites
router.post('/create/sprite',async (req,res)=>{
    try {
        const {key,initialState} = req.body;
        const response = await prisma.sprites.create({
            data:{
                key,
                initialState
            }
        })
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Internal server error"});
    }
})

//creating animations
router.post('/create/animations',async (req,res) => {
    try {
        const {animations} = req.body;
        const response = await prisma.spriteAnimations.createMany({
            data:animations
        })
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Internal server error"});
    }
})

//getting all sprites
router.get('/get/sprites',async (req,res) => {
    try {
        const response = await prisma.sprites.findMany({
            include:{
                animations:true,
            }
        });
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Internal server error"});
    }
})

router.get('/get/assets',async (req,res) => {
    try {
        const response = await prisma.spriteAssets.findMany({});
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Internal server error"});
    }
})

export default router;