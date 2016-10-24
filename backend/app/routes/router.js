var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var router = express.Router();
var userController = require('../controllers/user');
var collectionController = require('../controllers/collection');
var passwordController = require('../controllers/password');
var SECRET = require('../../SECRET/config').secret;

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
router.get('/user', userController.getUser);
router.get('/user/collection', collectionController.getCollection);
router.post('/user/collection', collectionController.createNewCollection);
router.put('/user/collection', collectionController.updateCollection);
router.delete('/user/collection', collectionController.deleteCollection);
router.get('/user/collection/:name/password', passwordController.getPasswordFromCollection);
router.post('/user/collection/:name/password', passwordController.createNewPasswordInCollection);
router.delete('/user/collection/:name/password', passwordController.deletePasswordFromCollection);

module.exports = router;
