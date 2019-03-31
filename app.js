"use strict";

const express = require('express');
const port = process.env.PORT || 3000;
const session = require('express-session');

const fs = require('fs');
const mongoose = require('./db/mongoose').mongoose;
const multer = require("multer");
const upload = multer({dest: "public/uploads/"});

const Post = require("./models/Post").Post;
const User = require("./models/User").User;
const Transaction = require("./models/Transaction").Transaction;

const app = express();
const ObjectID = require("mongodb").ObjectID;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static directories
app.use("/", express.static(__dirname + '/public'));
app.use("/pages", express.static(__dirname + '/public/pages'));
app.use("/styles", express.static(__dirname + '/public/styles'));
app.use("/scripts", express.static(__dirname + '/public/scripts'));
app.use("/images", express.static(__dirname + '/public/images'));
app.use("/public/uploads", express.static(__dirname + '/public/uploads'));
app.use("/public/images", express.static(__dirname + '/public/images'));

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

app.get('/login', (req, res) => {
   if (req.session.user) {
       console.log("has logged in!");
       res.redirect('profile');
   } else {
       res.sendFile(__dirname + '/public/pages/login.html');
   }
});

app.get('/api/search/:keyword', (req, res) => {
    const keyword = req.params.keyword;
    console.log("dsjakd");
    //TODO: currently just find anything in the database, need to be fixed once have a dataset
    Post.find().then((result) => {
        const payload = {result: result};
        if (!req.session.user) {
            payload.user = null;
            res.send(payload);
        } else {
            User.findOne({username: req.session.user}).then((result) => {
                payload.user = result;
               res.send(payload);
            });
        }
    });
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
            password: req.body.password,
            isAdmin: false,
            userName: req.body.username,
            avatar: "/public/images/user.png",
            bio: "Set your Bio",
            phone: "Set your PhoneNumber",
            sell: [],
            purchase: [],
            transaction: [],
            shortlist: []
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
    if (!req.session.user) {
        res.status(401).send();
    }
    // if user is logged in
    const files = req.files;
    const newPost = new Post({
        title: req.body.title,
        seller: req.session.user,
        image: [],
        condition: req.body.condition,
        ISBN: req.body.ISBN,
        edition: req.body.edition,
        description: req.body.description,
        price: req.body.price,
        postingDate: new Date(),
        isSold: false,
        byCreditCard: true
    });
    for (let i = 0; i < files.length; i++) {
        newPost.image.push(files[i].path);
    }
    newPost.save().then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log(error);
        res.status(500).send();
    });
});

app.post('/api/login', (req, res) => {
   const username = req.body.username;
   const password = req.body.password;
   User.findByEmailPassword(username, password).then((user) => {
      req.session.user = user.username;
      res.send();
   }).catch((error) => {
       res.status(401).send();
   });
});

app.get('/api/getUser/:username', (req, res) => {
    User.findOne({username: req.params.username}).then((result) => {
        if (!result) {
            res.status(404).send();
        }
        res.send({result});
    }).catch((error) => {
        console.log(error);
        res.status(500).send();
    });
});

app.post("/api/addToCart/:postId", (req, res) => {
   if (!req.session.user) {
       res.status(401).send();
   } else {
       if (!ObjectID.isValid(req.params.postId)) {
           res.status(600).send();
       }
       User.findOne({username: req.session.user}).then((user) => {
           if (!user) {
               res.status(404).send();
           }
           Post.findById(req.params.postId).then((post) => {
               user.shortlist.push(post);
               user.save().then((user) => {
                   res.send({user});
               }).catch((error) => {
                   console.log(error);
                   res.status(500).send();
               });
           });
       }).catch((error) => {
           console.log(error);
           res.status(500).send();
       });
   }
});

app.delete("/api/removeFromCart/:postId", (req, res) => {
    if (!req.session.user) {
        res.status(401).send();
    } else {
        if (!ObjectID.isValid(req.params.postId)) {
            res.status(600).send();
        }
        User.findOne({username: req.session.user}).then((user) => {
            if (!user) {
                res.status(404).send();
            }
            user.shortlist = user.shortlist.filter((post) => {
                return post._id !== req.params.postId;
            });
            user.save().then((newUser) => {
                res.send({newUser});
            }).catch((error) => {
                console.log(error);
                res.status(500).send();
            })
        }).catch((error) => {
            console.log(error);
            res.status(500).send();
        });
    }
});



app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
