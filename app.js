"use strict";

const express = require('express');
const port = process.env.PORT || 3000;
const session = require('express-session');

const fs = require('fs');
const mongoose = require('./db/mongoose').mongoose;
const multer = require("multer");
const upload = multer({dest: "uploads/"});

const ImageSchema = require("./models/Image").ImageSchema;
const Post = require("./models/Post").Post;
const User = require("./models/User").User;
const UserProfile = require("./models/UserProfile").UserProfile;
const Transaction = require("./models/Transaction").Transaction;
const Chat = require('./models/Message').Chat;

const app = express();
const ObjectID = require("mongodb").ObjectID;
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Static directories
app.use("/", express.static(__dirname + '/public'));
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

app.get('/404', (req, res, next) => {
    res.sendFile(__dirname + '/public/pages/404.html');
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
        const defaultProfile = fs.readFileSync("./public/images/user.png");
        const newUserProfile = new UserProfile({
            userName: req.body.username,
            avatar: {
                data: defaultProfile,
                contentType: "image/png"
            },
            bio: "Set your Bio",
            phone: "Set your PhoneNumber",
            sell: [],
            purchase: [],
            transaction: [],
            shortlist: []
        });
        newUserProfile.save().catch((error) => {
            console.log(error);
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
    //TODO: Finish this after finishing the login route.
    if (!req.session.user) {
        // res.redirect()
    }
    // if user is logged in
    //TODO: fix this when Eric finish modyfying frontend
    const files = req.files;
    const newPost = new Post({
        title: req.body.title,
        seller: "haha",
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
        const fileData = fs.readFileSync(files[i].path);
        console.log(files[i].mimetype);
        newPost.image.push({
            data: fileData,
            contentType: files[i].mimetype
        });
    }
    newPost.save().then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log(error);
        res.status(500).send();
    });
});


app.get('/api/user/:username', (req, res) => {
    User.findOne({username: req.params.username}).then((user) => {
        if (!user) {
            res.status(404).send();
        } else {
            res.send(user);
        }
    }).catch((error) => {
        res.status(500).send(error);
    })
});


app.post('/api/createChat', (req, res) => {
    const user1 = req.body.user1;
    const user2 = req.body.user2;
    Chat.findOne({$or: [{user1: user1, user2: user2}, {user1: user2, user2: user1}]}).then((chat) => {
        if (chat !== null) {
            res.send(chat);
        } else {
            const newChat = new Chat({
                user1: user1,
                user2: user2,
                user1Messages: [],
                user2Messages: [],
                messages: []
            });

            newChat.save().then((result) => {
                if (!result) {
                    res.status(404).send();
                } else {
                    res.send(result);
                }
            }).catch((error) => {
                res.status(500).send(error)
            })
        }
    }).catch((error) => {
        res.status(500).send(error);
    });
});


app.get('/api/chat/:user1/:user2', (req, res) => {
    const user1 = req.params.user1;
    const user2 = req.params.user2;

    Chat.findOne({$or: [{user1: user1, user2: user2}, {user1: user2, user2: user1}]}).then((chat) => {
        if (!chat) {
            res.status(404).send();
        } else {
            res.send(chat);
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});

app.get('/api/allChats/:user', (req, res) => {
    const username = req.params.user;
    Chat.find({$or: [{user1: username}, {user2: username}]}).then((chats) => {
        if (!chat) {
            res.status(404).send();
        } else {
            res.send(chats);
        }
    }).catch((error) => {
        res.status(500).send(error);
    })
});

app.post('/api/chat/:chatId', (req, res) => {
    const chatId = req.params.chatId;

    if (!ObjectID.isValid(chatId)) {
        res.status(404).send();
    }

    Chat.findById(chatId).then((chat) => {
        if (!chat) {
            res.status(404).send();
        } else {
            chat.messages.push({time: req.body.time, sender: req.body.sender, content: req.body.content});
            if (req.body.sender === chat.user1) {
                chat.user1Messages.push({time: req.body.time, sender: req.body.sender, content: req.body.content});
            } else {
                chat.user2Messages.push({time: req.body.time, sender: req.body.sender, content: req.body.content});
            }
            chat.save().then((result) => {
                res.send(result)
            })
        }
    }).catch((error) => {
        res.status(500).send(error);
    })
});


app.patch('/api/chat/:chatId/:username', (req, res) => {
    const chatId = req.params.chatId;
    const user = req.params.username;

    if (!ObjectID.isValid(chatId)) {
        res.status(404).send();
    }

    Chat.findById(chatId).then((chat) => {
        if (!chat) {
            res.status(404).send();
        } else {
            if (user === chat.user1) {
                chat.user2Messages = [];
            } else if (user === chat.user2) {
                chat.user1Messages = [];
            }
            chat.save().then((result) => {
                res.send(result)
            })
        }
    }).catch((error) => {
        res.status(500).send(error);
    })
});


app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
