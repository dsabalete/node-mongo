var express = require('express');
var morgan = require('morgan');
var cookieParser =  require('cookie-parser');

var hostname = process.env.IP || 'localhost';
var port = process.env.PORT || 3000;

var app = express();

app.use(morgan('dev'));
app.use(cookieParser('12345-67890-09876-54321')); // secret key

function auth(req, res, next) {
    console.log(req.headers);

    if (!req.signedCookies.user) { // there is no signed cookie
        var authHeader = req.headers.authorization;
        if (!authHeader) {
            var err = new Error('You are not authenticated!!!');
            err.status = 401;
            next(err);
            return;
        }
        var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
        console.log(auth);
        var user = auth[0];
        var pass = auth[1];
        if (user == 'admin' && pass == 'password') { // if user is admin and 'pass' is 'password' we set a cookie
            res.cookie('user','admin', {signed:true});
            next(); // authorized
        } else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    } else { // there is a signed cookie
        if (req.signedCookies.user === 'admin') { // the cookie is from user admin
            console.log(req.signedCookies);
            next();
        } else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
}

app.use(auth);

app.use(express.static(__dirname + '/public'));


// general error handling
app.use(function (err, req, res, next) {
    res.writeHead(err.status || 500, {
        'WWW-Authenticate': 'Basic',
        'Content-Type': 'text/plain'
    });
    res.end(err.message);
});

app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}`);
});