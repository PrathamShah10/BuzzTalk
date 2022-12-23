const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;
const postSchema=new mongoose.Schema({
    title: {
        type:String,
        required:true,
    },
    body: {
        type:String,
        required:true,
    },
    photo: {
        type:String,
        required: true
    },
    likes: [{
        type:ObjectId,
        ref:"User"
    }],
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"}
    }],
    postedBy:{
        type:ObjectId,
        ref:"User" //the postedBy thing here has type of objectId of User database.
    }
},{
    timestamps:true
})

mongoose.model("Post",postSchema);