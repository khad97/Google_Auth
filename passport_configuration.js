const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose')
const User = require('./DataBase/User')

passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    */
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recieves the id 
    then we use the id to select the user from the db and pass the user object to the done callback
    we can later access this data in any routes in: req.user
    */
    done(null, user);
});

passport.use(new GoogleStrategy({
        clientID: "157224789203-n554b4i9j3g183e59ka9qjvdkrbo9ida.apps.googleusercontent.com",
        clientSecret: "3PtGbloDDEuh8Vf7uWirRGK9",
        callbackURL: "http://localhost:3000/login/callback"
    },
    async(accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
        }

        try {
            let user = await User.findOne({ googleId: profile.id })

            if (user) {
                done(null, user)
            } else {
                user = await User.create(newUser)
                done(null, user)
            }
        } catch (err) {
            console.error(err)
        }
    }
));