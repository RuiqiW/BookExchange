"use strict";

const express = require('express');
const port = process.env.PORT || 3000;
const session = require('express-session');
const mongoose = require('./db/mongoose');

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

app.use(session({
    secret: "UofTExchange",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
    }
}));




app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});