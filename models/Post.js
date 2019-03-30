const mongoose = require("mongoose");
const ImageSchema = require("./Image").ImageSchema;

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        unique: true
    },
    sellerUsername: {
        type: String,
        required: true,
        minlength: 1
    },
    image: [ImageSchema],
    condition: {
        type: String,
        required: true,
        enum: ['New', 'Like New', 'Very Good', 'Good', 'Acceptable']
    },
    ISBN: {
        type: String,
        required: false,
    },
    edition: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false,
        minlength: 1
    },
    price: {
        type: String,
        required: false,
        validate: {
            validator: function(price) {
                return price >= 0;
            },
            message: price => `${price} is not a valid price`
        }
    },
    postingDate: {
        type: Date,
        required: true
    },
    isSold: {
        type: Boolean,
        required: true
    },
    byCreditCard: {
        type: Boolean,
        required: true
    }
});

const Post = mongoose.model("Post", PostSchema);

module.exports = { Post };