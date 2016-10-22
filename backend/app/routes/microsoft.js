var mongoose = require('mongoose');
var User = mongoose.model('User');
var Collection = mongoose.model('Collection');
// var Password = mongoose.model('Password');

export function(app) {
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

    });

    app.put('/user', (req, res) => {

    });

    app.delete('/user/:id', (req, res) => {

    });

    app.get('/user/:id/collection', (req, res) => {

    });

    app.get('/user/:id/collection/:name', (req, res) => {

    });

    app.post('/user/:id/collection/:name' (req, res) => {

    });

    app.put('/user/:id/collection/:name', (req, res) => {

    });

    app.delete('/user/:id/collection/:name', (req, res) => {

    });

    app.get('/user/:id/collection/:name/password', (req, res) => {

    });

    app.put('/user/:id/collection/:name/password', (req, res) => {

    });

    app.delete('/user/:id/collection/:name/password', (req, res) => {

    });

    app.post('/user/:id/collection/:name/password', (req, res) => {

    });
};
