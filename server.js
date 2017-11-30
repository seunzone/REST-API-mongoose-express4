// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
const express    = require('express');        // call express
const app        = express();                 // define our app using express
const bodyParser = require('body-parser');
const mongoose   = require('mongoose'); // require the mongoose ORM for transacting with MongoDB
mongoose.connect('mongodb://localhost/rester'); // connect to our database
const Player = require('./app/models/players');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000; // set our port

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router(); // get an instance of the express Router
// middleware to use for all requests
router.use((req, res, next) => {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', (req, res) => {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here
// on routes that end in /players
// ----------------------------------------------------


    // create a player (accessed at POST http://localhost:8080/api/players)
    router.post('/players', (req, res) => {

        const player = new Player();      // create a new instance of the PLayer model
        player.name = req.body.name;  // set the players name (comes from the request)

        // save the player and check for errors
        Player.save((err) => {
            if (err)
                res.send(err);

            res.json({ message: 'Player created!' });
        });

    });
     // get all the players (accessed at GET http://localhost:8080/api/players)
    router.get('/players', (req, res) => {
        Player.find((err, players) => {
            if (err)
                res.send(err);

            res.json(players);
        });
    });

      // get the player with that id (accessed at GET http://localhost:8080/api/playerss/:player_id)
    router.get('/players/:player_id', (req, res) => {
        Player.findById(req.params.player_id, (err, player) => {
            if (err)
                res.send(err);
            res.json(player);
        });
    });

    // Edit the player with that id (accessed at GET http://localhost:8080/api/playerss/:player_id)
    router.put('/players/:player_id', (req, res) => {

        // use our player model to find the player we want
        Player.findById(req.params.player_id, (err, player) => {

            if (err)
                res.send(err);

            player.name = req.body.name;  // update the players info

            // save the player
            player.save((err) => {
                if (err)
                    res.send(err);

                res.json({ message: 'Player updated!' });
            });

        });
    });

    // delete a specific player
    router.delete('/players/:player_id', (req, res) => {
        Player.remove({
            _id: req.params.player_id
        }, (err, bear) => {
            if (err)
                res.send(err);

            res.json({ message: 'Player deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
