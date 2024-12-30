import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

router.get('/test',(req,res)=>{
    res.send("test route");
})


router.post("/login", async (req,res)=>{
    const {email,password} = req.body;
    try {
        const response = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(response){
            if(response.password === password){
                const token = jwt.sign({id:response.id},JWT_SECRET as string);
                res.status(200).send({token,username:response.username});
                return;
            }
        }
        //401 Unauthorized: The user is not authenticated against the API
        res.status(401).send({message:"Incorrect Credentials"});
        
    } catch (error) {
        
    }
})

router.post('/signup', async (req,res)=>{
    const {username,firstName,lastName,email,password} = req.body;
    try {
        await prisma.user.create({
            data:{
                username,
                firstName,
                lastName,
                email,
                password
            }
        })
        res.status(200).send({message:"User created Successfully"});
    } catch (error:any) {
        //validating only unique constraints
        if(error.code === 'P2002'){
            const target = error.meta?.target;
            //400 Bad Request: The request was not formatted correctly
            res.status(400).send({message:`${target} already exists`})
        }
    }
})

export default router;