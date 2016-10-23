var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = mongoose.model('User');
var Collection = mongoose.model('Collection');
var Password = mongoose.model('Password');
var SECRET = require('../../SECRET/config').secret;

router.get('/setup', (req, res) => {
    var kumin = new User({
        username: 'Kumin In',
        password: 'password',
        admin: true,
        Microsoft: {
            id: "sd23Gdf-432blla"
        }
    });

    kumin.save((err) => {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    })
});

router.post('/authenticate', (req, res) => {
    // Get userID from the body.
    var userID = req.body.userID;
    var password = req.body.password;

    // Check if userID exists from the body.
    if (!userID || userID.length == 0) {
        res.status(400).json({'error':'userID required in body.'});
        return;
    }
    if (!password || password.length == 0) {
        res.status(400).json({'error':'password required in body.'});
        return;
    }

    User.findOne({'Microsoft.id':userID}, (err, user) => {
        if (err) {
            res.status(500).json(err);
        } else if (!user) {
            res.status(404).json({'error':'User not found in database.'});
        } else {
            if (user.password != password) {
                res.status(401).json({'error': 'User not authorized'});
            } else {
                var token = jwt.sign(user, SECRET, {
                    expiresIn: 1440
                });
                res.status(201).json({'token': token});
            }
        }
    });
});

router.post('/user', (req, res) => {
    // Get userID from the body.
    var userID = req.body.userID;
    // Get username from the body.
    var username = req.body.username;
    // Get password from the body.
    var password = req.body.password;
    // Check if userID exists from the body.
    if (!userID || userID.length == 0) {
        res.status(400).json({'error':'userID required in body'});
        return;
    }
    // Check if username exists from the body.
    if (!username || username.length == 0) {
        res.status(400).json({'error':'username required in body'});
        return;
    }
    // Check if password exists from the body.
    if (!password || password.length == 0) {
        res.status(400).json({'error':'password required in body'});
        return;
    }
    // Find the user based on the userID and create a new user if
    // user doesn't exist.
    User.findOne({'Microsoft.id':userID}, (err, user) => {
        // There was an error finding the user.
        if (err) {
            // Respond with Server Error, since ther was an error finding
            // a user from this query, and the JSON Object.
            res.status(500).json(err);
        } else if (user) {
            // The user was found in the database.
            res.status(409).json({'error':'User already exists in database'});
        } else {
            var newUser = new User({
                'Microsoft.id': userID,
                'username': username,
                'password': password,
                'admin': false
            });
            newUser.save((err, user) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    var token = jwt.sign(user, SECRET, {
                        expiresIn: 1440
                    });
                    res.status(201).json({'token': token});
                }
            });
        }
    });
});

router.use((req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        res.status(401).json({'error':'Token required'});
        return;
    } else {
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                return res.status(500).json({'error': 'Failed to Authenticate Token'});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
});

router.get('/user', (req, res) => {
    if (req.decoded) {
        // Get userID passed into the query.
        var userID = req.decoded._doc.Microsoft.id;
        // Find user based upon the userID provided in the query.
        User
        .findOne({'Microsoft.id':userID})
        .populate('collections')
        .exec((err, user) => {
            // There was an error finding the user.
            if (err) {
                // Respond with Server Error since there was an error finding
                // a user from this query. Return json objectID.
                res.status(500).json(err);
            } else if (!user) {
                // Respond with Not Found status code since no user was found
                // with the given userID parameter.
                res.status(404).json({'error':'User was not found.'});
            } else {
                // Respond with OK status code, since there wasn't an error
                // and the user was found, and the user json Object.
                res.status(200).json(user);
            }
        });
    }
});

router.get('/user/collection', (req, res) => {
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
});

router.post('/user/collection', (req, res) => {
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
});

router.put('/user/collection', (req, res) => {
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
});

router.get('/user/collection/:name/password', (req, res) => {
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
});

router.post('/user/collection/:name/password', (req, res) => {
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
});

router.delete('/user/collection', (req, res) => {
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
                    res.status(400).json({'error':'No such collection exists'});
                } else {
                    var collectionID = thisCollection._id;
                    user.collections.splice(user.collections.indexOf(collectionID), 1);
                    Collection.findOneAndRemove(collectionID, (err, collection) => {
                        user.save((err, user) => {
                            if (err) {
                                res.status(500).json(err);
                            } else {
                                var passwordList = thisCollection.passwords;
                                passwordList.forEach((password) => {
                                    Password.findOneAndRemove({'_id':password}, (err, password) => {
                                        if (err) {
                                            res.status(500).json(err);
                                        }
                                    }).then(() => {
                                        res.status(201).json(collection);
                                    });
                                });
                            }
                        });
                    });
                }
            }
        });
    }
});

router.delete('/user/collection/:name/password', (req, res) => {
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
                  console.log(collection);
                  console.log(passID);
                  console.log(collection.passwords.indexOf(mongoose.Types.ObjectId(passID)));
                  collection.update({$pull: {passwords: mongoose.Types.ObjectId(passID)}});
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
});

module.exports = router;
