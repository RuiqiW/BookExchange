/* This is the schema to save the images into database */
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    img: {
        data: Buffer,
        contentType: String
    }
});

module.exports = { ImageSchema };