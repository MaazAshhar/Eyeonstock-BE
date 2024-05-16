import express, { urlencoded } from "express";
import UserRoutes from './routes/UserRoutes.js';
import StockesRoutes from './routes/StocksRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from "body-parser";
import connectDB from "./config/database.js";


dotenv.config()

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(urlencoded({extended:false}));
app.use(cors());
connectDB();

app.use('/api', StockesRoutes);
app.use('/', UserRoutes);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});