var mongoose = require('mongoose');
var User = mongoose.model('User');
var Collection = mongoose.model('Collection');
var Password = mongoose.model('Password');

module.exports.getPasswordFromCollection = (req, res) => {
    if (req.decoded) {
        var userID = req.decoded._doc.Microsoft.id;
        var collectionName = req.params.name;

        if (!collectionName || collectionName.length == 0) {
            res.status(500).json( {'error':'collectionName required in body'} );
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

                if (!collection || collection.length == 0) {
                    res.status(404).json({'error':'User has no specified Collection.'});
                } else {
                    if (!collection.passwords || collection.passwords == 0) {
                        res.status(404).json({'error':'No passwords stored in specified collection'});
                    } else {
                        Collection
                        .findOne(collection)
                        .populate('passwords')
                        .exec((err, collection) => {
                            if (err) {
                                res.status(500).json(err);
                            } else {
                                res.status(200).json(collection.passwords);
                            }
                        });
                    }
                }
            }
        });
    }
};

module.exports.createNewPasswordInCollection = (req, res) => {
    if (req.decoded) {
        var userID = req.decoded._doc.Microsoft.id;
        var collectionName = req.params.name;
        var username = req.body.username;
        var hash = req.body.hash;
        var description = req.body.description;

        if (!collectionName || collectionName.length == 0) {
            res.status(400).json( {'error':'collectionName required in body'});
            return;
        }
        if (!username || username.length == 0) {
            res.status(400).json( {'error':'username required in body'});
            return;
        }
        if (!hash || hash.length == 0) {
            res.status(400).json( {'error':'hash required in body'});
            return;
        }
        if (!description || description.length == 0) {
            res.status(400).json( {'error':'description required in body'});
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
                if (!collection || collection.length == 0) {
                    res.status(404).json({'error':'Collection not found'});
                } else {
                    Collection
                    .findOne(collection)
                    .populate('passwords')
                    .exec((err, collection) => {
                        if (err) {
                            res.status(500).json(err);
                        } else {
                            var password = collection.passwords.find((password) => {
                                return password.description == description && password.hash == hash && password.username == username;
                            });
                            if (!password) {
                                var newPassword = new Password({
                                    'username': username,
                                    'hash': hash,
                                    'description': description,
                                    'collections': collection._id
                                });
                                newPassword.save((err, pass) => {
                                    if (err) {
                                        res.status(500).json(err);
                                    } else {
                                        collection.passwords.push(newPassword._id);
                                        collection.save((err, collection) => {
                                            if (err) {
                                                res.status(500).json(err);
                                            } else {
                                                res.status(201).json(collection);
                                            }
                                        });
                                    }
                                });
                            } else {
                                res.status(409).json({'error':'Cannot have duplicate entries'});
                            }
                        }
                    });
                }
            }
        });
    }
};

module.exports.deletePasswordFromCollection = (req, res) => {
    // DELETE PASSWORD given collection name
    var userID = req.decoded._doc.Microsoft.id;
    var collectionName = req.params.name;
    var passID = req.body.passID;

    if (!collectionName || collectionName.length == 0) {
        res.status(400).json({'error':'collectionName required from body'});
        return;
    }
    if (!passID || passID.length == 0) {
        res.status(400).json({'error':'passID required from body'});
        return;
    }

    User
    .findOne({'Microsoft.id':userID})
    .populate('collections')
    .exec((err, user) => {
        if(err) {
            res.status(500).json(err);
        } else if (!user || user.length == 0) {
            res.status(404).json({'error':'User not found'});
        } else {
            var collection = user.collections.find((collection) => {
                return collection.name == collectionName;
            });
            if (!collection || collection.length == 0) {
                res.status(404).json({'error':'Collection does not exist'});
            } else {
                Collection.findOne({'_id':collection._id}, function(err, collection) {
                  var passIdIndex = collection.passwords.indexOf(mongoose.Types.ObjectId(passID));
                  collection.passwords.splice(passIdIndex, 1);
                  // avorite.update( {cn: req.params.name}, { $pullAll: {uid: [req.params.deleteUid] } } )
                    // collection.passwords.slice(collection.passwords.indexOf(mongoose.Types.ObjectId(passID)), 1);
                    collection.save((err, collection) => {
                        if (err) {
                            res.status(500).json(err);
                        } else {
                          Password.findOneAndRemove(passID, (err, password) => {
                              if (err) {
                                  res.status(500).json(err);
                              } else {
                                  res.status(201).json(null);
                              }
                          });
                       }
                    });
                });
            }
        }
    });
};
