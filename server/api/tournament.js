var baucis = require('baucis');
var mongoose = require('mongoose');
var mongoUri = process.env.STBGFC_MONGO_URI || 'mongodb://localhost/tournamentApp';

var Tournament = require('../models/Tournament.js');
var Result = require('../models/Result.js');
var News = require('../models/News.js');
var Feedback = require('../models/Feedback.js');


/*
 * ==========================================================================
 * tournament api
 * ==========================================================================
 */
module.exports = function(app,io) {

    Tournament.locking(true);
    Result.locking(true);

    mongoose.connect(mongoUri, function(err) {
        if(err) {
            console.log('mongo connection error', err);
        } else {
            console.log('mongo connection successful to ' + mongoUri);
        }
    });

    baucis.rest(Tournament).methods('delete', false);
    baucis.rest(Result);
    baucis.rest(News);
    baucis.rest(Feedback);

    // mongoose middleware hook to emit the broadcast event after a successful save
    mongoose.model('News').schema.post('save', function(newsItem) {
        io.sockets.emit('news', newsItem);
    });

    mongoose.model('Result').schema.post('save', function(result) {
        io.sockets.emit('result', result);
    });

    mongoose.model('Result').schema.post('remove', function(result) {
        io.sockets.emit('remove', result);
    });

    // expose routes
    app.use('/api', baucis());

};
