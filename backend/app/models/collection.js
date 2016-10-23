"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// This schema represents the structure of Collection type objects
var collectionSchema = new Schema({
    // A reference to the user that owns the collection of password objects
    user: { type: ObjectId, ref: 'User', required: true },
    // The name of the user that owns the collection of password objects
    name: { type: String, required: true },
    // A list of references to password objects
    passwords: [{ type: ObjectId, ref: 'Password'}]
});

mongoose.model('Collection', collectionSchema);
