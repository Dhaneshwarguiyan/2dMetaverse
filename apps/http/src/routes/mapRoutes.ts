import express from 'express'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/',async (req,res) => {
    try {
        const {name,tileSet} = req.body;
        const response = await prisma.maps.create({
            data:{
                name,
                tileSet,
            }
        })
        res.send(response);
    } catch (error:any) {
        if(error.code === "P2002"){
            const target = error.meta.target;
            res.status(400).send({message:`${target} already exists`})
            return;
        }
        res.status(500).send({message:"Internal Server Error"});
    }
})

//Layers
router.post('/layers',async(req,res)=>{
    try {
        const {layers} = req.body; //layers will contain the id of the map also
        const response = await prisma.mapLayers.createMany({
            data:layers,
            skipDuplicates:true
        })
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Internal Server Error"});
    }
})

//assets
router.post('/assets',async(req,res)=>{
    try {
        const {assets} = req.body; //assets will contain the id of the map in mapId
        const response = await prisma.mapAssets.createMany({
            data:assets,
            skipDuplicates:true
        })
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Internal Server Error"});
    }
})

//rooms
router.post('/rooms',async(req,res)=>{
    try {
        const {room,mapId} = req.body;
        const response = await prisma.rooms.create({
            data:{
                room,
                mapId
            }
        })
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Internal Server Error"});
    }
})

router.get('/room',async(req,res)=>{
    try {
        const {room} = req.body;
        const response1 = await prisma.rooms.findUnique({
            where:{
                room:room
            },
            select:{
                mapId:true
            }
        })
        if(response1){
            const response2 = await prisma.maps.findUnique({
                where:{
                    id:response1.mapId
                },
                include:{
                    layers:true,
                    assets:true
                }
            })
            res.send(response2);
            return;
        }
        res.status(404).send({message:"No room found"});
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Internal Server Error"});
    }
})

//Not yet implemented completely
router.get('/',async (req,res)=>{
    try {
        const response = await prisma.maps.findMany({
            include:{
                rooms:true,
                layers:true,
                assets:true
            }
        });
        res.status(200).send(response);
    } catch (error) {
        res.send({message:"Internal Server Error"});
    }
})

export default router;