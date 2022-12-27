const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Message = mongoose.model('Message');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');


//create message
router.post('/message',requireLogin,(req,res)=> {
    const message = new Message(req.body)
    message.save()
    .then((saved_message) => {
        return res.status(200).json(saved_message);
    })
    .catch(err=>console.log(err));
})

//find messages of a conversation

router.get('/getmessage/:conversationId',(req,res)=> {
    Message.find({conversationId:req.params.conversationId})
    .then((messages)=> {
        if(!messages) {
            return res.status(422).json({error:"no messages exsist"});
        }
        res.status(200).json(messages);
    })
    .catch(err=>console.log(err));
})


module.exports = router;