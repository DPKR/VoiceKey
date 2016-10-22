"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var passwordSchema = new Schema({
    description: {
      type: String,
      maxlength: 200
    },
    username: {
        type: String,
        required: true
    },
    hash: {type: String, required: true},
    collection: {type: ObjectId, ref: 'Collection'}
});

mongoose.model('Password', passwordSchema);
