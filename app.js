"use strict";

const express = require('express');
const port = process.env.PORT || 3000;
const session = require('express-session');
const mongoose = require('./db/mongoose').mongoose;
const multer = require("multer");
const upload = multer({dest: "uploads/"});

const ImageSchema = require("./models/Image").ImageSchema;
const Post = require("./models/Post").Post;
const User = require("./models/User").User;
const UserProfile = require("./models/UserProfile").UserProfile;
const Transaction = require("./models/Transaction").Transaction;

const app = express();
const ObjectID = require("mongodb").ObjectID;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static directories
app.use("/pages", express.static(__dirname + '/public/pages'));
app.use("/styles", express.static(__dirname + '/public/styles'));
app.use("/scripts", express.static(__dirname + '/public/scripts'));
app.use("/images", express.static(__dirname + '/public/images'));

app.use(session({
    secret: "UofTExchange",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
    }
}));

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/createAccount', (req, res) => {
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    User.findOne({$or: [{username: username}, {email: email}]}).then((result) => {
        if (result !== null) {
            if (result.username === username) {
                // 600 to indicate username exist
                res.status(600).send();
                return;
            } else if (result.email === email) {
                // 601 to indicate email exist
                res.status(601).send();
                return;
            }
        }
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: req.body.email,
            isAdmin: false
        });
        newUser.save().then((result) => {
            res.send(result)
        }).catch((error) => {
            console.log(error);
            res.status(500).send();
        });
    }).catch((error) => {
        console.log(error);
        res.status(500).send();
    });
});

app.post('/api/postAd', upload.array("image", 4), (req, res) => {
    const files = req.file;
    const newPost = new Post({
        title: req.body.title,
        category: req.body.category,
        condition: req.body.condition,
        description: req.body.description,
        price: req.body.price
    });

});

app.post('/api/test', (req, res) => {
    console.log(req.body);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});