var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var router = express.Router();
var userController = require('../controllers/user');
var collectionController = require('../controllers/collection');
var passwordController = require('../controllers/password');
var SECRET = require('../../SECRET/config').secret;

router.post('/authenticate', userController.authenticateUser);
router.post('/user', userController.loginUser);
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
