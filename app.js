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
            shortlist: [],
            byCreditCard: true
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
    const files = req.files;
    let price;
    if (req.body.isFree) {
        price = 0;
    } else {
        price = req.body.price;
    }
    let byCreditCard;
    User.findOne({username: req.session.user}).then((result) => {
        byCreditCard = result.byCreditCard;
        const newPost = new Post({
            title: req.body.title,
            seller: req.session.user,
            image: [],
            condition: req.body.condition,
            ISBN: req.body.ISBN,
            edition: req.body.edition,
            description: req.body.description,
            price: price,
            postingDate: new Date(),
            isSold: false,
            byCreditCard: byCreditCard
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
        res.redirect("/login");
    } else {
        if (!ObjectID.isValid(req.params.postId)) {
            res.status(600).send();
        }
        User.findOne({username: req.session.user}).then((user) => {
            if (!user) {
                res.status(404).send();
            }
            if (user.shortlist.filter((post) => {
                return post._id.equals(req.params.postId);
            }).length !== 0) {
                console.log("jsakjds");
                res.send({user});
                return;
            }
            Post.findById(req.params.postId).then((post) => {
                if (!post) {
                    res.status(404).send();
                }
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
        res.redirect("/login");
    } else {
        console.log("sdddd");
        if (!ObjectID.isValid(req.params.postId)) {
            res.status(600).send();
        }
        User.findOne({username: req.session.user}).then((user) => {
            if (!user) {
                res.status(404).send();
            }
            const temp = user.shortlist.filter((post) => {
                return !post._id.equals(req.params.postId);
            });
            if (temp.length === user.shortlist.length) {
                console.log("sdjkahfff");
                res.send({newUser: user});
                return;
            } else {
                user.shortlist = temp;
            }
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


/********************** for chat *************************/

// Middleware for authentication for resources
const authenticate = (req, res, next) => {
    if (req.session.user) {
        User.findOne({username: req.session.user}).then((user) => {
            if (!user) {
                return Promise.reject()
            } else {
                req.user = user;
                next()
            }
        }).catch((error) => {
            res.redirect('/login')
        })
    } else {
        res.redirect('/login')
    }
};


// create new chat between two users
app.post('/api/createChat', authenticate, (req, res) => {
    const user1 = req.user.username;
    const user2 = req.body.user1;
    if(user1 === user2){
        res.status(404).send();
    }
    Chat.findOne({$or: [{user1: user1, user2: user2}, {user1: user2, user2: user1}]}).then((chat) => {
        if (chat !== null) {
            res.send({user: user1, chat: chat});
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
                    res.send({user: user1, chat: result});
                }
            }).catch((error) => {
                res.status(500).send(error)
            })
        }
    }).catch((error) => {
        res.status(500).send();
    });
});


// find the chat between two users
app.get('/api/startChat/:user', authenticate, (req, res) => {
    const user2 = req.params.user;
    const user1 = req.user.username;

    Chat.findOne({$or: [{user1: user1, user2: user2}, {user1: user2, user2: user1}]}).then((chat) => {
        if (!chat) {
            res.status(404).send();
        } else {
            res.send({user: user1, chat: chat});
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).send();
    });
});


// find all chat histories belonging to a user
app.get('/api/allChats', authenticate, (req, res) => {
    const username = req.user.username;
    Chat.find({$or: [{user1: username}, {user2: username}]}).then((chats) => {
        if (!chats) {
            res.status(404).send();
        } else {
            res.send({user: username, chats: chats});
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).send();
    })
});

// add a new message to chat history
app.post('/api/chat/:chatId', authenticate,(req, res) => {
    const chatId = req.params.chatId;
    const username = req.user.username;
    if (!ObjectID.isValid(chatId)) {
        res.status(404).send();
    }

    Chat.findById(chatId).then((chat) => {
        if (!chat) {
            res.status(404).send();
        } else {
            const newMessage = {
                time: req.body.time,
                sender: username,
                content: req.body.content
            };
            if(username === chat.user1 || username === chat.user2){
                chat.messages.push(newMessage);
                if (username === chat.user1) {
                    chat.user1Messages.push(newMessage);
                } else {
                    chat.user2Messages.push(newMessage);
                }
                chat.save().then((result) => {
                    res.send(result);
                })
            } else {
                // unauthorized access
                res.status(401).send();
            }
        }
    }).catch((error) => {
        res.status(500).send();
    })
});


// get a specific chat
app.get('/api/chat/:chatId', authenticate, (req, res) => {
    const chatId = req.params.chatId;
    const username = req.user.username;

    if (!ObjectID.isValid(chatId)) {
        res.status(404).send();
    }

    Chat.findById(chatId).then((chat) => {
        if (!chat) {
            res.status(404).send();
        } else {
            if(username === chat.user1 || username === chat.user2) {
                res.send({user: username, chat: chat});
            }else{
                res.status(401).send();
            }
        }
    }).catch((error) => {
        res.status(500).send();
    })
});


// update chat history after loading new messages
app.post('/api/loadChat/:chatId',authenticate, (req, res) => {
    const chatId = req.params.chatId;
    const user = req.user.username;

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
            }else{
                res.status(401).send();
                return;
            }
            chat.save().then((result) => {
                res.send(result)
            })
        }
    }).catch((error) => {
        res.status(500).send();
    })
});

app.post('/api/changeProfilePicture', upload.single("image"), (req, res) => {
    if (!req.session.user) {
        res.redirect("/login");
    }
    User.findOne({username: req.session.user}).then((user) => {
        user.avatar = "/" + req.file.path;
        user.save().then((newUser) => {
            res.redirect("/pages/userProfile.html");
        });
    })
});

app.get("/api/getCurrentUser", (req, res) => {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        User.findOne({username: req.session.user}).then((user) => {
            res.send({user: user});
        })
    }
});


app.get("/api/findSeller/:postId", (req, res) => {
    const postId = req.params.postId;
    if (!ObjectID.isValid(postId)) {
        res.status(404).send();
    }

    Post.findById(postId).then((post) => {
        if (!post) {
            res.status(404).send();
        } else {
            res.send({username: post.seller});
        }
    }).catch((error) => {
        res.status(500).send(error);
    })
});

app.post("/api/updatePhoneNumber/:newNumber", (req, res) => {
    const newNumber = req.params.newNumber;
    console.log(newNumber);
    if (!req.session.user) {
        res.redirect("/login");
    }
    if (isNaN(parseInt(newNumber)) || newNumber.trim().length !== 10) {
        res.status(600).send();
    }
    User.findOne({username: req.session.user}).then((user) => {
        user.phone = newNumber;
        user.save().then((newUser) => {
            res.redirect("/pages/userProfile.html");
        }).catch((error) => {
            console.log(error);
            res.status(500).send();
        })
    });
});

app.post("/api/updateBio/:newBio", (req, res) => {
    const newBio = req.params.newBio;
    if (!req.session.user) {
        res.redirect("/login");
    }
    User.findOne({username: req.session.user}).then((user) => {
        user.bio = newBio;
        user.save().then((newUser) => {
            res.redirect("/pages/userProfile.html");
        }).catch((error) => {
            console.log(error);
            res.status(500).send();
        })
    });
});

app.post("/api/updatePayment/:newPayment", (req, res) => {
    if (!req.session.user) {
        res.redirect("/login");
    }
    const newPayment = req.params.newPayment;
    console.log(newPayment);
    let byCreditCard = false;
    if (newPayment === 'credit') {
        byCreditCard = true;
    } else {
        byCreditCard = false;
    }
    User.findOne({username: req.session.user}).then((user) => {
       user.byCreditCard = byCreditCard;
       user.save().then((res.redirect("/pages/userProfile.html")));
    });

});

/****************** for dashboard *****************/
// Middleware for authentication for resources
const adminAuthenticate = (req, res, next) => {
    if (req.session.user) {
        User.findOne({username: req.session.user}).then((user) => {
            if (!user) {
                return Promise.reject()
            } else {
                if(user.isAdmin){
                    req.user = user;
                    next();
                }else{
                    return Promise.reject();
                }
            }
        }).catch((error) => {
            res.redirect('/login')
        })
    } else {
        res.redirect('/login')
    }
};


app.get("/api/dashboard/posts", adminAuthenticate, (req, res) => {
    Post.find().then((posts) => {
        if(!posts){
            res.status(404).send();
        }else{
            res.send(posts);
        }
    }).catch((error)=> {
        res.status(500).send();
    });
});

app.delete("/api/dashboard/post/:postId", adminAuthenticate, (req, res) => {
    Post.findByIdAndDelete(postId).then((post) => {
        if(!post){
            res.status(404).send();
        }else{
            res.send(post);
        }
    }).catch((error)=> {
        res.status(500).send();
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
