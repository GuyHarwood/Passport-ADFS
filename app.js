var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var AdfsStrategy = require('passport-wsfed-saml2').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.get('/login',
    passport.authenticate('wsfed-saml2', { failureRedirect: '/', failureFlash: true }),
    function(req, res) {
        res.redirect('/');
    }
);

app.post('/login/callback',
    function(req, res) {
        res.redirect('/');
    }
);

passport.use(new AdfsStrategy(
    {
        path: '/login/callback',
        realm: 'f6097489-c3a7-40cd-a138-368076bbc0c6',
        homeRealm: '', // specify an identity provider to avoid showing the idp selector
        identityProviderUrl: 'https://login.windows.net/e95889f4-718e-412f-a5b8-136f0b6d4b02/wsfed'

        // setup either a certificate base64 encoded (cer) or just the thumbprint of the certificate if public key is embedded in the signature

        ,cert: 'MIICWTCCAcICCQDdb4l2Evr4CDANBgkqhkiG9w0BAQUFADBxMQswCQYDVQQGEwJVSzETMBEGA1UEBxMKTm90dGluZ2hhbTERMA8GA1UEChMITWlsa0NoaXAxFjAUBgNVBAMTDWV4cHJlc3MubG9jYWwxIjAgBgkqhkiG9w0BCQEWE2dwaGFyd29vZEBnbWFpbC5jb20wHhcNMTQwODA3MTMxNjM1WhcNMTUwODA3MTMxNjM1WjBxMQswCQYDVQQGEwJVSzETMBEGA1UEBxMKTm90dGluZ2hhbTERMA8GA1UEChMITWlsa0NoaXAxFjAUBgNVBAMTDWV4cHJlc3MubG9jYWwxIjAgBgkqhkiG9w0BCQEWE2dwaGFyd29vZEBnbWFpbC5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAK/WPpQtG4Iqk11jrt88U+68umiB+grwbqRZi4G28qsQAXepzpii85vMXYwZ9O2/z3xkRk6bbl4Tpm/nrs5W7E8+cpsIINEh7HpXv4LlB5KYaT+7HaUNcSGLaeLPimT/7ahPaCTghmIddag57AwCQFxMHAmVji+j2aEKifnyBZU1AgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAYnyg66tJ+h61/I8+6pxRiesWYipZmVt/l1WQqxEkkTOgDHzeQTOqi6wZ/WVkEwsOnFiNBaY0yHJWVHfPQAYoceREPYWqpQkmLS51mHvknT8qX7rs061ZvQCTO0apncCuYnxupguu11fwLr7dcUKI3I9rDLjRBzk7WqcyyNTIkQs='
//        ,thumbprint: 'a3cff17cbf7e793a97861390eb698d00e9598537'
    },
    function(profile, done) {
        console.log("Auth with", profile);
        if (!profile.email) {
            return done(new Error("No email found"), null);
        }
        return done(null, profile);
    }
));


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
