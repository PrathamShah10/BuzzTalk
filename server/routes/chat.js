const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Conversation = mongoose.model('Conversation');
const User = mongoose.model('User');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const http = require('http');
const { EMAIL } = require('../config/keys.js');


//create conversation
router.post('/conversation', (req, res) => {
    Conversation.find({members:
        [req.body.senderId,req.body.recieverId]
    })
        .then((result) => {
            if (result.length) {
                return res.json({ message: "Conversation already exsists" });
            }
            const conversation = new Conversation({
                members: [req.body.senderId, req.body.recieverId]
            })
            conversation.save()
                .then((saved_conversation) => {
                    return res.status(200).json({ message: "Conversation added!" });
                })
        })

        .catch(err => console.log(err));
})


//get user conversation
router.get('/getconversation/:userId', (req, res) => {
    Conversation.find({
        members: {
            $in: [req.params.userId]
        }
    })
        .then((user) => {
            if (!user) {
                return res.status(422).json({ error: "No record exsist" });
            }
            res.status(200).json(user);
        })
        .catch(err => console.log(err));
})


router.get('/searchuser/:userId', (req, res) => {
    User.findOne({ _id: req.params.userId })
        .select("-password")
        .then((user) => {
            if (!user) {
                return res.status(422).json({ error: "No user exsist" });
            }
            res.status(200).json(user);
        })
        .catch(err => console.log(err));
})
module.exports = router;