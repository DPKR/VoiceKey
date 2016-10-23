var mongoose = require('mongoose');
var User = mongoose.model('User');
var Collection = mongoose.model('Collection');
var Password = mongoose.model('Password');

module.exports.getCollection = (req, res) => {
    if (req.decoded) {
        var userID = req.decoded._doc.Microsoft.id;
        var collectionName = req.query.name;
        // Finds a Microsoft account with the matID and populates collection fields
        User
        .findOne({'Microsoft.id':userID})
        .populate('collections')
        .exec((err, user) => {
            // Prints error results of server failures
            if (err) {
                res.status(500).json(err);
            } else {
                // Retrieves all collection data types associated with the user
                var collectionList = user.collections;
                if (!collectionName) {
                    if (!collectionList || collectionList.length == 0) {
                        res.status(404).json({'error':'Collection not found'});
                    } else {
                        res.status(200).json(collectionList);
                    }
                } else {
                    // Checks if a collection exists such that collection name matches
                    // with each collection object
                    var collection = collectionList.find((collection) => {
                        return collection.name == collectionName;
                    });

                    if (!collection) {
                        res.status(404).json({'error':'Collection not found'});
                    } else {
                        res.status(200).json(collection);
                    }
                }
            }
        });
    }
};

module.exports.createNewCollection = (req, res) => {
    if (req.decoded) {
        // Checks if collectionName is a valid input value.
        var userID = req.decoded._doc.Microsoft.id;
        var collectionName = req.body.collectionName;
        if (!collectionName || collectionName.length == 0) {
            res.status(400).json({'error':'collectionName required in body'});
            return;
        }
        // Searches for one user Account among User context and finds the first
        // match where the userID matches the Microsoft ID. The field value collection
        // for the user object is populated.
        User
        .findOne({'Microsoft.id':userID})
        .populate('collections')
        .exec((err, user) => {
            if (err) {
                res.status(500).json(err);
            } else {
                // Finds all collections that match with request name
                var collection = user.collections.find((collection) => {
                    return collection.name == collectionName;
                });
                // if there were no matches, a new Collection object can be added
                if (!collection) {
                    var newCollection = new Collection({
                        'user': user._id,
                        'name': collectionName
                    });
                    // updates changes made to the collections context
                    user.collections.push(newCollection._id);
                    newCollection.save((err, collection) => {
                        if (err) {
                            res.status(500).json(err);
                        } else {
                            user.save((err, user) => {
                                if (err) {
                                    res.status(500).json(err);
                                } else {
                                    res.status(201).json(collection);
                                }
                            });
                        }
                    });
                // Cannot create a new Colleciton object if collection already exists
                } else {
                    res.status(409).json({'error':'Collection already exist.'});
                }
            }
        });
    }
};

module.exports.updateCollection = (req, res) => {
    if (req.decoded) {
        // Takes request bodies and ensures that the values are valid inputs
        var collectionName = req.body.collectionName;
        var newCollectionName = req.body.newCollectionName;
        var userID = req.decoded._doc.Microsoft.id;
        if (!collectionName || collectionName.length == 0) {
            res.status(400).json({'error':'collectionName required in body'});
            return;
        }
        if (!newCollectionName || newCollectionName.length == 0) {
            res.status(400).json({'error':'newCollectionName required in body'});
            return;
        }
        // Searches all users according to the MicrosoftID/ userID field and
        // populates the collections fields when a match is found
        User
        .findOne({'Microsoft.id':userID})
        .populate('collections')
        .exec((err, user) => {
            if (err) {
                res.status(500).json(err);
            } else {
                // Attempts to grab the current collection query and the "new"
                // collection query.
                var collection = user.collections.find((collection) => {
                    return collection.name == collectionName;
                });
                var otherCollection = user.collections.find((collection) => {
                    return collection.name == newCollectionName;
                });
                // Makes sure that the collection information update is valid
                // and that the corresponding collections exist before making
                // saving the changes made.
                if (!collection) {
                    res.status(404).json({'error':'Collection not found'});
                } else if (otherCollection) {
                    res.status(409).json({'error':'Collection name already exists'});
                } else {
                    collection.name = newCollectionName;
                    collection.save((err, collection) => {
                        if (err) {
                            res.status(500).json(err);
                        } else {
                            res.status(201).json(collection);
                        }
                    });
                }
            }
        });
    }
};

module.exports.deleteCollection = (req, res) => {
    if (req.decoded) {
        var collectionName = req.body.name;
        var userID = req.decoded._doc.Microsoft.id;
        if (!collectionName || collectionName.length == 0) {
            res.status(400).json({'error':'collectionName required from body'});
            return;
        }
        // Searches all users according to the MicrosoftID/ userID field and
        // populates the collections fields when a match is found
        User
        .findOne({'Microsoft.id':userID})
        .populate('collections')
        .exec((err, user) => {
            if (err) {
                res.status(500).json(err);
            } else {
                // Searches user's collections and returns a failing signal if
                // there are no collections to delete
                var thisCollection = user.collections.find((collection) => {
                    return collection.name == collectionName;
                });
                if (!thisCollection) {
                    res.status(404).json({'error':'No such collection exists'});
                } else {
                    // Search for index of collection to delete and remove it from
                    // the list of user's collection list
                    var collectionID = mongoose.Types.ObjectId(thisCollection._id);
                    user.collections.splice(user.collections.indexOf(collectionID), 1);
                    user.save((err, user) => {
                        if (err) {
                            res.status(500).json(err);
                        } else {
                            // Search for position of collection to delete
                            var listOfPasswords;
                            Collection.where().findOneAndRemove({'_id':collectionID}, (err, collection) => {
                                if (err) {
                                    res.status(500).json(err);
                                } else {
                                    // Remove and delete passwords from collection to delete
                                    collection.passwords.forEach((password) => {
                                        var passID = mongoose.Types.ObjectId(password);
                                        Password.findOneAndRemove({'_id':password}, (err, password) => {
                                            if (err) {
                                                res.status(500).json(err);
                                            }
                                        }).then(() => {
                                            res.status(201).json(null);
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }
};
