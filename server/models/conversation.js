const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const conversationSchema = new mongoose.Schema({
    members: {
        type:Array,
    }
},{
    timestamps:true
})

mongoose.model("Conversation",conversationSchema);

//this model will save the id of 2 users involved in a conversation