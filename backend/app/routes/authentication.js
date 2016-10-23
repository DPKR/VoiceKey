var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = mongoose.model('User');
var Collection = mongoose.model('Collection');
// var Password = mongoose.model('Password');
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
                    expiresIn: 60
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
                        expiresIn: 60
                    });
                    res.status(201).json({'token': token});
                }
            });
        }
    });
});

router.use((req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log(token);
    if (!token) {
        res.status(401).json({'error':'Token required'});
        return;
    } else {
        jwt.verify(token, SECRET, (err, decoded) => {
            console.log(decoded);
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
        var collectionName = req.body.name;
        var newCollectionName = req.body.newName;
        var userID = req.decoded._doc.Microsoft.id;
    }
})

module.exports = router;
