var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = mongoose.model('User');
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

module.exports = router;
