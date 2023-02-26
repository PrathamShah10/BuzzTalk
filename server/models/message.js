const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const messageSchema = new mongoose.Schema({
    conversationId: {
        type:String,
    },
    sender: {
        type:String,
    },
    text: {
        type:String,
        // iv: String,
        // encryptedData: String
    }
},{
    timestamps:true
})

mongoose.model("Message",messageSchema);