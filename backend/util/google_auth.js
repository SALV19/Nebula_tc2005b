const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/log_in/google/callback",
      scope: [
        "email",
        "profile",
        "https://www.googleapis.com/auth/calendar", 
      ],  
      accessType: "offline",
      prompt: "consent",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.fetchByEmail(profile.emails[0].value, function (err, user) {
        return cb(err, {profile, accessToken});
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
