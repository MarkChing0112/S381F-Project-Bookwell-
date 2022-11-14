const { ObjectID } = require('bson');
var mongoose = require('mongoose');

var booksSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectID,
	Bookname: String,
	Author: String,
    Description: String,
    img:{
        data: Buffer,
        contentType: String
    }
});

module.exports = booksSchema;