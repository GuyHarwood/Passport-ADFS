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
        realm: '<clientId from azure portal>',
        homeRealm: '', // specify an identity provider to avoid showing the idp selector
        identityProviderUrl: ''

        // setup either a certificate base64 encoded (cer) or just the thumbprint of the certificate if public key is embedded in the signature

        ,cert: '<cert body>'
//        ,thumbprint: ''
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
