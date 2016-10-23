var mongoose = require('mongoose');
var User = mongoose.model('User');
var Collection = mongoose.model('Collection');
var Password = mongoose.model('Password');

module.exports.getCollection = (req, res) => {
    if (req.decoded) {
        var userID = req.decoded._doc.Microsoft.id;
        var collectionName = req.query.name;
        User
        .findOne({'Microsoft.id':userID})
        .populate('collections')
        .exec((err, user) => {
            if (err) {
                res.status(500).json(err);
            } else {
                var collectionList = user.collections;
                if (!collectionName) {
                    if (!collectionList || collectionList.length == 0) {
                        res.status(404).json({'error':'Collection not found'});
                    } else {
                        res.status(200).json(collectionList);
                    }
                } else {
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
        var userID = req.decoded._doc.Microsoft.id;
        var collectionName = req.body.collectionName;
        if (!collectionName || collectionName.length == 0) {
            res.status(400).json({'error':'collectionName required in body'});
            return;
        }
        User
        .findOne({'Microsoft.id':userID})
        .populate('collections')
        .exec((err, user) => {
            if (err) {
                res.status(500).json(err);
            } else {
                var collection = user.collections.find((collection) => {
                    return collection.name == collectionName;
                });
                if (!collection) {
                    var newCollection = new Collection({
                        'user': user._id,
                        'name': collectionName
                    });
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
                } else {
                    res.status(409).json({'error':'Collection already exist.'});
                }
            }
        });
    }
};

module.exports.updateCollection = (req, res) => {
    if (req.decoded) {
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
        User
        .findOne({'Microsoft.id':userID})
        .populate('collections')
        .exec((err, user) => {
            if (err) {
                res.status(500).json(err);
            } else {
                var collection = user.collections.find((collection) => {
                    return collection.name == collectionName;
                });
                var otherCollection = user.collections.find((collection) => {
                    return collection.name == newCollectionName;
                });
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
        User
        .findOne({'Microsoft.id':userID})
        .populate('collections')
        .exec((err, user) => {
            if (err) {
                res.status(500).json(err);
            } else {
                var thisCollection = user.collections.find((collection) => {
                    return collection.name == collectionName;
                });
                if (!thisCollection) {
                    res.status(404).json({'error':'No such collection exists'});
                } else {
                    var collectionID = mongoose.Types.ObjectId(thisCollection._id);
                    user.collections.splice(user.collections.indexOf(collectionID), 1);
                    user.save((err, user) => {
                        if (err) {
                            res.status(500).json(err);
                        } else {
                            var listOfPasswords;
                            Collection.where().findOneAndRemove({'_id':collectionID}, (err, collection) => {
                                if (err) {
                                    res.status(500).json(err);
                                } else {
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
