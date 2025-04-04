import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    refreshTokens: [ {
        token:String,
        expires:Date
        }
       
    ],
    oauthProviders:[{
        provider:String,
        providerId:String
    }],
    lastLogin:Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil:{type:Date},

    createdAt:Date

}, {timestamps:true});

//password hashing middleware
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

//method for the compare password
userSchema.methods.compareParePassword = async function (candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
}

export default mongoose.model('User', userSchema);