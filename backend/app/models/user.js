"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, require: true},
    Microsoft: {
        id: {type: String, required: true}
    },
    admin: {type: Boolean, required: true},
    collections: [{ type: ObjectId, ref: 'Collection'}]
});

mongoose.model('User', userSchema);
