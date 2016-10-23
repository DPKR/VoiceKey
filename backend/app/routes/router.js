var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var router = express.Router();
var userController = require('../controllers/user');
var collectionController = require('../controllers/collection');
var passwordController = require('../controllers/password');
var verifyController = require('../controllers/verify');

router.post('/authenticate', userController.authenticateUser);
router.post('/user', userController.loginUser);
router.use(verifyController);
router.get('/user', userController.getUser);
router.get('/user/collection', collectionController.getCollection);
router.post('/user/collection', collectionController.createNewCollection);
router.put('/user/collection', collectionController.updateCollection);
router.delete('/user/collection', collectionController.deleteCollection);
router.get('/user/collection/:name/password', passwordController.getPasswordFromCollection);
router.post('/user/collection/:name/password', passwordController.createNewPasswordInCollection);
router.delete('/user/collection/:name/password', passwordController.deletePasswordFromCollection);

module.exports = router;
