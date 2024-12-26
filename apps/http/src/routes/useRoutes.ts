import express from 'express';

const router = express.Router();

router.post("/login",(req,res)=>{
    const {email,password} = req.body;
    res.send("Logged in")
})

router.post('signup',(req,res)=>{
    res.send("signed up");
})

export default router;