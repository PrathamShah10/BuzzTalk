const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
        type:String,
        default:"https://res.cloudinary.com/bdg77jk4eui/image/upload/v1668519820/noimg_uafufg.png"
    },
    followers:[{
        type:ObjectId,ref:"User"
    }],
    following:[{
        type:ObjectId,ref:"User"
    }]
})

mongoose.model("User",userSchema)