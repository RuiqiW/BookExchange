const mongoose = require('mongoose');

// Connect to our database
// NOTE: This is a cloud deployed database, the username and password are both "server"
const mongoDB = 'mongodb+srv://server:server@cluster0-pyppi.mongodb.net/test?retryWrites=true';

mongoose.connect(mongoDB, { useNewUrlParser: true }).catch((error) => {
    console.log("Error Connecting Database Server!");
});


module.exports = { mongoose };
