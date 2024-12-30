import express from 'express'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/',async (req,res) => {
    const {name,room,layers,assets} = req.body;
    try {
        const response = await prisma.maps.create({
            data:{
                name,
                room,
                layers:{
                    create:layers
                },
                assets:{
                    create:assets
                }
            }
        })
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Internal server error"});
    }
})

router.get('/',async (req,res)=>{
    try {
        const response = await prisma.maps.findMany({
            include:{
                layers:true,
                assets:true
            }
        });
        res.send(response);
    } catch (error) {
        console.log(error);
        res.send("error")
    }
})

export default router;