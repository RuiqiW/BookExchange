const mongoose = require("mongoose");
const ImageSchema = require("./Image.js").ImageSchema;
const PostSchema = require("./Post").PostSchema;
const TransactionSchema = require("./Transaction").TransactionSchema;

const userProfileSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 1
    },
    avatar: {
        type: ImageSchema,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        minlength: 4,
        required: true
    },
    sell: [PostSchema],
    purchase: [PostSchema],
    transaction: [TransactionSchema],
    shortlist: [PostSchema]
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = { UserProfile };
