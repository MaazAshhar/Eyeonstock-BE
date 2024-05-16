import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const userFromToken = async (req,res,next) =>{
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({error : 'Unauthorized - Token not provided'});
        }
        const token = authHeader.split(' ')[1];

        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
            if(err){
                return res.status(401).json({error : "Unauthorized - Invalid token"});
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(500).send({success : false, message : "Internal server error. Please try again !!"});
    }
}