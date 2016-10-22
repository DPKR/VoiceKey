var mongoose = require('mongoose');
var User = mongoose.model('User');
var Collection = mongoose.model('Collection');
// var Password = mongoose.model('Password');

module.exports = function(app) {
    app.get('/user', (req, res) => {
        // Get userID passed into the query.
        var userID = req.query.userID;
        // Check if the userID was passed to the query.
        if (!userID || userID.length == 0) {
            res.status(400).json({'error':'userID required in query.'});
            return;
        }
        // Find user based upon the userID provided in the query.
        User.findOne({'_id':userID}, (err, user) => {
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
    });

    app.post('/user', (req, res) => {
        // Get userID from the body.
        var userID = req.body.userID;
        // Check if userID exists from the body.
        if (!userID || userID.length == 0) {
            res.status(400).json({'error':'userID required in body'});
            return;
        }
        // Find the user based on the userID and create a new user if
        // user doesn't exist.
        User.findOne({'_id':userID}, (err, user) => {
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
                    _id: userID
                });
                newUser.save((err, user) => {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        res.status(201).json(user);
                    }
                });
            }
        });
    });

    app.delete('/user', (req, res) => {
        // make sure user id exists
        var userID = req.body.userID;

        if (!userID || userID.length == 0) {
            res.status(400).json({'error':'userID required in body'});
            return;
        }


        User.findOneAndRemove({'_id':userID}, (err, user, result) => {
            if (err) {
                res.status(500).json(err);
            } else if (!user) {
                res.status(404).json({'error':'User was not found'});
            } else {
                Collection.find({'user':userID}, (err, collection) => {
                    console.log(collection);
                    res.status(201).json(null);
                });
            }
        });
        //else good userID

    });

    app.get('/user/:id/collection', (req, res) => {
        var userID = req.param.id;
        if (!userID || userID.length == 0) {
            res.status(400).json({'error':'id required in parameter'});
            return;
        }
        Collection.find({'user':userID}, (err, collection) => {
            if (err) {
                res.status(500).json(err);
            } else if (!collection) {
                res.status(404).json({'Error':'No collection for specified user.'});
            } else {
                res.status(200).json(collection);
            }
        });
    });

    // app.get('/user/:id/collection/:name', (req, res) => {
    //
    // });

    app.post('/user/:id/collection', (req, res) => {
        var collectionName = req.body.name;
        if (!collectionName || collectionName.length == 0) {
            res.status(400).json({'error':'collectionName required in body'});
            return;
        }

    });

    app.put('/user/:id/collection', (req, res) => {
        var collectionName = req.body.name;
        var newCollectionname = req.body.newName;
        if (!collectionName || collectionName.length == 0) {
            res.status(400).json({'error':'collectionName required in body'});
            return;
        }
        if (!newCollectionname || newCollectionname.length == 0) {
            res.status(400).json({'error':'newCollectionname required in body'});
            return;
        }
    });

    app.delete('/user/:id/collection', (req, res) => {
        var collectionName = req.body.name;
    });
    //
    // app.get('/user/:id/collection/:name/password', (req, res) => {
    //
    // });
    //
    // app.put('/user/:id/collection/:name/password', (req, res) => {
    //
    // });
    //
    // app.delete('/user/:id/collection/:name/password', (req, res) => {
    //
    // });
    //
    // app.post('/user/:id/collection/:name/password', (req, res) => {
    //
    // });
};
