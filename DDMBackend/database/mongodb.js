const config = require('../config/config')
const {logger} = require('../utils/logger')
const mongoose = require('mongoose');
mongoose.connect(config.URL);
var db = mongoose.connection;
db.on('error', function(res,error) {
    console.log("There was an issue connecting,Please try later.");
    logger.error('error','Error occure while connecting',error);
});
db.once('open', function(res) {
    console.log("MongoDB connection successfully!!");
    logger.log('info','Mongodb Connected Successfully !!!')

});
module.exports = db;
