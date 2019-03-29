const mongoose = require("mongoose");
const ImageSchema = require("./Image.js").ImageSchema;

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
        required: true,
        minlength: 1
    },
    phone: {
        type: String,
        minlength: 4,
        required: true
    }
    //TODO: Three fields left: sell, purchase and shortlist
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = { UserProfile };
