const express = require('express');
const app = express();
const mongoose = require('mongoose');
const crypto = require("crypto");
const Message = mongoose.model('Message');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');


const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex') + ':' + iv.toString('hex') + '=' + 
    key.toString('hex');
    //returns encryptedData:iv=key
}

function decrypt(text) {
    let iv = Buffer.from((text.split(':')[1]).split('=')[0], 'hex')//will return iv;
    let enKey = Buffer.from(text.split('=')[1], 'hex')//will return key;
    let encryptedText = Buffer.from(text.split(':')[0], 'hex');//returns encrypted Data
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(enKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
    //returns decryptedData
}
// var hw = encrypt("Some serious stuff")

//create message
router.post('/message', requireLogin, (req, res) => {
    // console.log("want", req.body)
    var encyptedFormat = encrypt(req.body.text)
    const message = new Message({
        ...req.body,
        text: encyptedFormat
    })
    message.save()
        .then((saved_message) => {
            const encyptedSending = {
                ...saved_message,
                text: req.body.text
            }
            return res.status(200).json(encyptedSending);
        })
        .catch(err => console.log(err));
})

//find messages of a conversation

router.get('/getmessage/:conversationId', (req, res) => {
    // console.log('trigger')
    Message.find({ conversationId: req.params.conversationId })
        .then((messages) => {
            if (!messages) {
                return res.status(422).json({ error: "no messages exsist" });
            }
            var decryptedMessage = []
            messages.map((msg) => {
                    // console.log("text",msg.text)
                    var newtext = decrypt(msg.text);
                    // console.log("decypted:", newtext);
                    var newMsg = {
                        ...msg,
                        text: newtext
                    }
                    // console.log("navu msg che: ",newMsg)
                    decryptedMessage.push(newMsg)
            })
            res.status(200).json(decryptedMessage);
        })
        .catch(err => console.log(err));
})


module.exports = router;