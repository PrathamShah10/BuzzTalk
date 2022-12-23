const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const User = mongoose.model('User');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {SENDGRID_API} = require('../config/keys.js');
const {EMAIL} = require('../config/keys.js');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))
router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!email || !password || !name) {
        return res.status(422).json({ error: 'please add all fields' });
    }
    User.findOne({ email: email })
        .then((saved) => {
            if (saved) {
                return res.status(422).json({ error: "already exsits" });
            }
            bcrypt.hash(password, 12)
                .then(hashedpass => {
                    const user = new User({
                        email,
                        password: hashedpass,
                        name,
                        pic
                    })
                    user.save()
                        .then(user => {
                            transporter.sendMail({
                                to: user.email,
                                from: "sirpras1958@gmail.com",
                                subject: "signup success",
                                html: "<h1>welcome to my social media application</h1>"
                            })
                            res.json({ message: "saved successfully" });
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })
        })
        .catch(e => {
            console.log(e);
        })
})
router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "enter all details" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: 'invalid credentials' });
            }
            bcrypt.compare(password, savedUser.password)
                .then(match => {
                    if (match) {
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                        const { _id, name, email, following, followers, pic } = savedUser
                        res.json({ token, user: { _id, name, email, following, followers, pic } });
                    }
                    else
                        res.status(422).json({ error: 'invalid credentials' });
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })
})
router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User dont exists with that email" })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    transporter.sendMail({
                        to: user.email,
                        from: "sirpras1958@gmail.com",
                        subject: "password reset",
                        html: `
                    <p>You requested for password reset</p>
                    <h5>click on this link <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                    `
                    })
                    res.json({ message: "check your email" })
                })

            })
    })
})

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try again session expired" })
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((saveduser) => {
                    res.json({ message: "password updated success" })
                })
            })
        }).catch(err => {
            console.log(err)
        })
})

module.exports = router;
