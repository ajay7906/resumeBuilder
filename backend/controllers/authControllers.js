import jwt from 'jsonwebtoken';
import User from '../modal/User';
import crypto from 'crypto'

//generate tokens
const generateTokens = (userId) =>{
    const accessTokens = jwt.sign(
       {id: userId},
       process.env.ACCESS_TOKEN_SECRET,
       {
        expiresIn:'24h'
       }
    )
}