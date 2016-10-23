"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// This schema represents the structure of password type objects
var passwordSchema = new Schema({
    // The field descriptor that describes the functionality of the password given by the user
    description: {
      type: String,
      maxlength: 200
    },The field
    username: {
        type: String,
        required: true
    },
    // The hashcode value associated with the password
    hash: {type: String, required: true},
    collections: {type: ObjectId, ref: 'Collection'}
});

mongoose.model('Password', passwordSchema);
