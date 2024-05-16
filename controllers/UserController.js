import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import dotenv from 'dotenv';

dotenv.config();

export const signup = async (req,res) =>{
    try {
        const {user} = req.body;
        const salt = 10;
        user['password'] = await bcrypt.hash(user.password,salt);
        const newUser = await User.create(user);
        res.status(201).send({success:true});
    } catch (error) {
        if(error?.name === 'MongoServerError' && error?.code === 11000){
            return res.status(400).send({success : false, message : "A user already exist with this email id"});
        }
        return res.status(500).send({success:false, message: "Internal server error. Please try again!!"});
    }
}

export const login = async(req,res)=>{
    try {
        const {user}=req.body;
        const myUser = await User.findOne({email: user.email});
        if(myUser && await bcrypt.compare(user.password,myUser.password)){
            const payload = {
                id : myUser._id,
                name : myUser.name,
                email : myUser.email
            };
            const token = jwt.sign(payload,process.env.JWT_SECRET_KEY);
            return res.status(200).send({success : true, status : "Login successfull", token : token});
        }
        return res.status(400).send({success : false, error : "wrong email/password"});
    } catch (error) {
        res.status(500).send({success : false, message:"Internal server error. Please try again later!!"});
    }
}

export const addStockToWatchlist = async(req, res) => {
    const user = req.user;
    const {selectedStock} = req.body;
    if (selectedStock) {
        try {
            await User.findOneAndUpdate({ _id: user.id }, { $push: { watchlist: selectedStock }});
            return res.status(200).json({ status: 200, message: "Stock Added to Watchlist"});
        } catch (error) {
            console.log(error);
        }
    }
    return res.status(500).json({status: 500, message: "Something Went Wrong"});
}