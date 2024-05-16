import { connect } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = () => {
    connect(process.env.DB)
    .then(() => {})
    .catch((err) => {
        console.log("No Database Connection");
    });
}

export default connectDB;