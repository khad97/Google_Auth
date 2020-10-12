const express = require('express')
const app = express()
const connectDB = require('./DataBase/Connection')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./passport_configuration');
require('dotenv/config');

connectDB();

// later we can configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
    name: 'login-session',
    keys: ['key1', 'key2']
}))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// protected and unprotected routes
app.get('/', (req, res) => res.send('Home page!'))
app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route we can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome mr/ms ${req.user.displayName}!`))

// Auth Routes
app.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/login/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    function(req, res) {
        // Successful authentication, redirect to home.
        res.redirect('/good');
    }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

app.listen(process.env.Port, () => console.log(`Example app listening on port ${process.env.Port}!`))