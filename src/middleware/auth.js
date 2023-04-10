const jwt = require('jsonwebtoken')
const User = require('../models/user')
const dotenv = require("dotenv");
dotenv.config();

const JWT = process.env.JWT_SECRET;

const auth =async(req,res,next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, JWT);
        const user =await User.findOne({_id:decode.id, 'tokens.token': token })
        if(!user){
            throw new Error()
        }
        req.token =token
        req.user = user
        next()
    } catch (error) {
       res.status(401).send({error:'please you are not authenticated'}) 
    }
}

module.exports = auth