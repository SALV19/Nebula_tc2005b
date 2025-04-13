const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");

const scope_def = [
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar"
];

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/log_in/google/callback",
      scope: [...scope_def],
      accessType: "offline",
      prompt: "consent",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.fetchByEmail(profile.emails[0].value, function (err, [[user]]) {
        return cb(err, {profile, user, accessToken});
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

module.exports = scope_def;
