"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    collections: [{ type: ObjectId, ref: 'Collection'}]
});

mongoose.model('User', userSchema);
