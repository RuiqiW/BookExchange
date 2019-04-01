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
const Chat = require("./models/Message").Chat;

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

app.get('/404', (req, res, next) => {
    res.sendFile(__dirname + '/public/pages/404.html');
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
    //TODO: fix this when Eric finish modifying frontend
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


// create new chat between two users
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


// find the chat between two users
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


// find all chat histories belonging to a user
app.get('/api/allChats/:username', (req, res) => {
    const username = req.params.username;
    Chat.find({$or: [{user1: username}, {user2: username}]}).then((chats) => {
        if (!chats) {
            res.status(404).send();
        } else {
            res.send(chats);
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    })
});

// add a new message to chat history
app.post('/api/chat/:chatId', (req, res) => {
    // const username = req.params.username;
    // Chat.find({$or: [{user1: username}, {user2: username}]}).then((chats) => {
    //     if (!chats) {
    //         res.status(404).send();
    //     } else {
    //         res.send(chats);
    //     }
    // }).catch((error) => {
    //     console.log(error);
    //     res.status(500).send(error);
    // })
    const chatId = req.params.chatId;
    if (!ObjectID.isValid(chatId)) {
        res.status(404).send();
    }

    Chat.findById(chatId).then((chat) => {
        if (!chat) {
            res.status(404).send();
        }else{
            const newMessage = {
                time: req.body.time,
                sender: req.body.sender,
                content: req.body.content
            };
            chat.messages.push(newMessage);
            if(req.body.sender === chat.user1){
                chat.user1Messages.push(newMessage);
            }else{
                chat.user2Messages.push(newMessage);
            }
            chat.save().then((result) => {
                res.send(result);
            })
        }
    }).catch((error) => {
        res.status(500).send(error);
    })
});


// get a specific chat
app.get('/api/chat/:chatId', (req, res) => {
    const chatId = req.params.chatId;

    if (!ObjectID.isValid(chatId)) {
        res.status(404).send();
    }

    Chat.findById(chatId).then((chat) => {
        if (!chat) {
            res.status(404).send();
        } else {
            res.send(chat);
        }
    }).catch((error) => {
        res.status(500).send(error);
    })
});


// update chat history after loading new messages
app.post('/api/chat/:chatId/:username', (req, res) => {
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

app.post('/api/changeProfilePicture', upload.single("image"), (req, res) => {
    if (!req.session.user) {
        res.status(401).send();
    }
    User.findOne({username: req.session.user}).then((user) => {
        user.avatar = "/" + req.file.path;
        user.save().then((newUser) => {
            res.send({user: newUser});
        });
    })
});

app.get("/api/getCurrentUser", (req, res) => {
    if (!req.session.user) {
        res.status(401).send();
    }
    User.findOne({username: req.session.user}).then((user) => {
        res.send({user: user});
    })
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
