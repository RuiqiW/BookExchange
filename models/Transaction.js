const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    isComplete: {
        type: Boolean,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    buyer: {
        type: String,
        required: false
    },
    handleByUser: {
        type: Boolean,
        required: false
    }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = { Transaction, TransactionSchema };
