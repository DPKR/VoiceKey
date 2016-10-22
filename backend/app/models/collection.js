"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var collectionSchema = new Schema({
    user: { type: ObjectId, ref: 'User', required: true }
});

mongoose.model('Collection', collectionSchema);
