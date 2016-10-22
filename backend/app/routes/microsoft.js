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
                    'Microsoft.id': userID
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


        User.findOneAndRemove({'Microsoft.id':userID}, (err, user, result) => {
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

    // Get ALL collections associated with this user
    app.get('/user/:id/collection', (req, res) => {
      // ensure the request provides a valid collectionName
      var collectionName = req.query.name;
      // if (!collectionName || collectionName.length == 0) {
      //     res.status(400).json({'error':'collectionName required in body'});
      //     return;
      // }
      // ensure the request provides a valid userID
      var userID = req.params.id;
      if (!userID || userID.length == 0) {
          res.status(400).json({'error':'id required in parameter'});
          return;
      }

      User
      .findOne({ 'Microsoft.id':userID })
      .populate('collections')
      .exec((err, user) => {
        if (err) {
            res.status(500).json(err);
        } else {
            var collectionList = user.collections;
            if (!collectionName) {
                if (!collectionList || collectionList.length == 0) {
                    res.status(404).json( {'error':'User has no Collection list'} );
                } else {
                    res.status(200).json(collectionList);
                }
            } else {
                var collection = collectionList.find((collection) => {
                    return collection.name == collectionName;
                });

                if (!collection) {
                    res.status(404).json( {'error':'Collection not found'} )
                } else {
                    res.status(200).json(collection);
                }
            }
        }
      });
    });

    // Please Code Review Kumin
    app.post('/user/:id/collection', (req, res) => {
        // ensure the request provides a valid collectionName
        var collectionName = req.body.collectionName;
        if (!collectionName || collectionName.length == 0) {
            res.status(400).json({'error':'collectionName required in body'});
            return;
        }
        // ensure the request provides a valid userID
        var userID = req.params.id;
        if (!userID || userID.length == 0) {
            res.status(400).json({'error':'id required in parameter'});
            return;
        }

        User.findOne({'Microsoft.id':userID})
        .populate('collections')
        .exec((err, user) => {
            if (err) {
                res.status(500).json(err);
            } else if (!user) {
                res.status(404).json({'error':'User not found.'});
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
                    res.status(409).json({'error':'Collection Already Exists'});
                }
            }
        });
    });

    app.put('/user/:id/collection', (req, res) => {
        var collectionName = req.body.name;
        var newCollectionname = req.body.newName;
        var userID = req.params.id;

        if (!collectionName || collectionName.length == 0) {
            res.status(400).json({'error':'collectionName required in body'});
            return;
        }
        if (!newCollectionname || newCollectionname.length == 0) {
            res.status(400).json({'error':'newCollectionname required in body'});
            return;
        }
        if(!userID || userID.length == 0) {
            res.status(400).json({'error':'userID required in params'});
            return;
        }

        User
        .findOne({ 'Microsoft.id':userID })
        .populate('collections')
        .exec((err, user) => {
            // i have THAT ONE user (user)
            // THAT user's collections list is populated (user.collections)
            if (err) {
                res.status(500).json( err );
            } else if(!user) {
                res.status(404).json( {'error':'User not found'} );
            } else {
                // i want to grab that collection with collectionName
                var collection = user.collections.find((collection) => {
                    return collection.name == collectionName;
                });

                if (!collection) {
                    res.status(404).json( {'error':'User not found'} );
                } else {
                    // did i assign properly?
                    // i want to update that collection
                    collection.name = newCollectionname;
                    // i want to save that collection
                    collection.save((err, collection) => {
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
                }
            }
        });
    });

    app.delete('/user/:id/collection', (req, res) => {
        var collectionName = req.body.name;
    });

    app.get('/user/:id/collection/:name/password', (req, res) => {
        // I WANT TO GET THE PASSWORD GIVEN THE USER ID AND COLLECTION NAME
        var userID = req.params.id;
        var collectionName = req.params.name;

        if (!userID || userID.length == 0) {
            res.status(500).json( {'error':'userID required in body'} );
        }
        if (!collectionName || collectionName.length == 0) {
            res.status(500).json( {'error':'collectionName required in body'} );
        }

        // I WANT TO GET ALL USERS ASSOCIATED WITH userID
        User
        .findOne( {'Microsoft.id':userID} )
        .populate('collections') // I WANT TO POPULATE ALL COLLECTION FIELDS IN USERS
        .exec((err, user) => {
            if (err) {
                res.status(500).json(err);
            } else if(!user) {
                res.status(404).json( {'error':'User not found'} );
            } else {
               // USER WAS FOUND
               // I WANT TO GET ALL COLLECTIONS ASSOCIATED WITH NAME
               var collection = user.collections.find((collection) => {
                  return collection.name == collectionName;
               });

               // ensure collection object exists for specified user
               if (!collection || collection.length == 0) {
                  res.status(404).json( {'error':'User has no specified Collection'} );
               } else {
                  // RETURN STATUS 201
                  if (!collection.password || collection.password == 0) {
                      res.status(404).json( {'error':'password(s) not found'} );
                  } else {
                      res.status(200).json(collection.password);
                  }
               }
            }
        });
    });

    // app.post('/user/:id/collection/:name/password', (req, res) => {
    //     var userID = req.params.id;
    //     var collectionName = req.params.name;
    //
    //     if (!userID || userID == 0) {
    //         res.status(500).json( {'error':'uresID required in body'} );
    //     }
    //     if (!collectionName || collectionName == 0) {
    //         res.status(500).json( {'error':'collectionName required in body'} );
    //     }
    //
    //     //
    // });

    app.put('/user/:id/collection/:name/password', (req, res) => {
    });

    app.delete('/user/:id/collection/:name/password', (req, res) => {

    });

};
