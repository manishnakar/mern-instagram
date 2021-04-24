'use strict'
import { Schema, model } from 'mongoose';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const userSchema = new Schema({
    name: {
        type: String, 
        required: true, 
        trim: true
    },

    email : {
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true, 
        minlength:6
    }, 
    token: {        
        type: String                 
    },
    TokenExpiration: Date
},{
    timestamps:true
})

userSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete user.password
    delete user.token
    return user;
}
userSchema.methods.generateAuthToken = async function () {
    const user = this
    user.token = await sign({ _id: user._id.toString() }, process.env.JWT_SECRET)          
    user.TokenExpiration = Date.now() + parseInt(process.env.JWT_EXPIRES);
    await user.save();
    return user.token;
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await hash(user.password, 8);
    }
    next();
})

const User =  model('User',userSchema)

export default User

