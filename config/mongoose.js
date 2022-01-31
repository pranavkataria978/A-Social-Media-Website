const mongoose  = require("mongoose");

mongoose.connect('mongodb://localhost/social_media_development');

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error in Connecting to database"));

db.once('open',function(){

    console.log('Connected to Database');
});


module.exports = db;

