import express from 'express';
import userRoutes from './routes/useRoutes';
const PORT = 8000;
const app = express();

//middlewares
app.use('/api/v1/user',userRoutes);

app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`);
})