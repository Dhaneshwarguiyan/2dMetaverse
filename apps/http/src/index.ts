import express from 'express';
import dotenv from 'dotenv';

//routes/middleware imports
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/useRoutes';
import authMiddleware from './middlewares/authMiddleware';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(express.json());
app.use(authMiddleware);

//routes
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/messages',messageRoutes)
app.get('/test',(req,res)=>{
    res.send("Test route");
})

app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`);
})