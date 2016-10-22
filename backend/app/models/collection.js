"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var collectionSchema = new Schema({
    user: { type: ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    password: [{ type: ObjectId, ref: 'Password'}]
});

mongoose.model('Collection', collectionSchema);
