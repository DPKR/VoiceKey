"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// This schema represents the structure of password type objects
var userSchema = new Schema({
    // The name of the user object represented by this schema
    username: {type: String, required: true},
    // The value of the password owned by the user
    password: {type: String, require: true},
    // Unique Identifier overriden for Microsoft application
    Microsoft: {
        id: {type: String, required: true}
    },
    admin: {type: Boolean, required: true},
    collections: [{ type: ObjectId, ref: 'Collection'}]
});

mongoose.model('User', userSchema);
