const mongoose = require('mongoose');

// Connect to our database
const mongoDB = 'mongodb+srv://team25:team25@csc309-tciyp.mongodb.net/uoft_exchange?retryWrites=true';

mongoose.connect(mongoDB, { useNewUrlParser: true });


module.exports = mongoose;
