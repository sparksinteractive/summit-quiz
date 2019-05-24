// Express Init
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const auth = require('./auth');
// const redisClient = require('./redis');

// Socket Setup
const io = require('socket.io')(server);

var users = [];

app.use(cookieSession({
    name: 'session',
    keys: ['123']
}));
app.use(cookieParser());
auth(passport);
app.use(passport.initialize());


// Auth with Google Account
app.get('/login', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

// Callback and set token after successful auth
app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
        console.log("auth");

        var name = req.user.profile.displayName;
        var avatar = req.user.profile.photos[0].value
        var uid = req.user.token;

        var user = {
            name: name,
            photo_url: avatar,
            uid: uid
        }

        users.push(user);

        // console.log(name, avatar, uid);

        req.session.token = req.user.token;
        res.cookie('token', req.session.token);
        res.redirect('/');
    }
);

// Check whether oauth token is set
app.get('/cookie', (req, res) => {
    console.log("cookie");
    if (req.session.token) {
        res.cookie('token', req.session.token);
        res.json({
            cookie: req.session.token
        });
    } else {
        res.cookie('token', '')
        res.json({
            status: 'session cookie not set'
        });
    }
});


// Logout and Deauth
app.get('/logout', (req, res) => {
    req.logout();
    res.cookie('token', '');
    req.session = null;
    res.redirect('/');
});

// Catch unauth
app.use(function(req, res, next) {
    if (req.session.token == null && req.path.indexOf('/') === 0) {
        res.redirect('/login');
        // console.log("null")
    }
    next();
});


// Express static root
app.use("/", express.static(__dirname + '/dist/')); // Serve dist folder through express instead of NGINX


// var clients = [];
var clients = {}


function search(key, arr){
    for (var i=0; i < arr.length; i++) {
        if (arr[i].uid === key) {
            return arr[i];
        }
    }
}


// Socket Init
io.on('connection', function(client) {

    // Get Count of Connected Clients and Emit Count to each Client
    // console.log('New client connected; CURRENT COUNT: ', io.engine.clientsCount);
    // io.emit('clientCounter', io.engine.clientsCount, 'utf-8');

    // Get List of All Connected Client IDs
    // io.clients((error, clientss) => {
    //     if (error) throw error;
    //     console.log(clients);
    //
    //     io.emit('clientArray', clients); // Send Array of Clients to Connecting Client
    // });

    client.on('storeClientInfo', async function(data) {
        // var clientInfo = new Object();
        // clientInfo.customId = data.customId;
        // clientInfo.clientId = client.id;
        // clientInfo.timestamp = Date.now();

        // var k = "customID";
        // var v = data.customID;
        // await redisClient.setAsync(k, JSON.stringify(v));



        if (search(data.customId, users) != undefined) {
            console.log("search", search(data.customId, users));
            // var row = new Object();
            var row = search(data.customId, users);
            row.customId = data.customId;
            row.clientId = client.id;
            row.timestamp = Date.now();
        } else {
            var row = new Object();
            row.name = "lorem"
            row.uid = data.customId;
            row.photo_url = "https://placeimg.com/200/200/any"
            row.customId = data.customId;
            row.clientId = client.id;
            row.timestamp = Date.now();
        }

        // clients.push(clientInfo);
        clients[data.customId] = row;

        client.join(data.customId)
        client.emit('clientId', row.customId); // Send Unique ID to Connecting Client
        // console.log(clientInfo);
        // console.log(clients);
        io.emit('clientArray', clients);
    });

    // Receive Event
    client.on('sendToServer', function(data) {
        console.log("Received Event", data);
        io.emit('receiveFromServer', data);
    });

    client.on('disconnect', function(data) {
        console.log("disconnect", client.id);
        for (var property in clients) {
            if (clients.hasOwnProperty(property)) {
                // baseArray.push(clients[property]);
                // console.log(clients[property]);
                // console.log(data[tokenToPass].clientId);
                if (clients[property].clientId == client.id) {
                    delete clients[property];
                }
                console.log(clients[property]);
            }
        }
    });
});


// Start Express
server.listen(8080, function() {
    console.log('listening on *:3000');
});
