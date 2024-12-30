import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

//routes/middleware imports
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/useRoutes';
import authMiddleware from './middlewares/authMiddleware';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(express.json());
app.use(cors({
    origin:'*',
    credentials:true,
    methods:['GET','POST','DELETE'],
    allowedHeaders:['Authorization','Content-type']
}))

//routes
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/messages',authMiddleware,messageRoutes)
app.get('/test',(req,res)=>{
    res.send("Test route");
})

app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`);
})