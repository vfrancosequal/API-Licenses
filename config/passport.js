const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
  
passport.serializeUser((user , done) => {
    done(null , user);
})
passport.deserializeUser(function(user, done) {
    done(null, user);
});
  
passport.use(new GoogleStrategy({
    clientID:"919390246217-op9u8satfd0a1qfarpf1dk85mtj4a4g7.apps.googleusercontent.com", // Your Credentials here.
    clientSecret:"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", // Your Credentials here.
    callbackURL:"/google/callback",
    passReqToCallback:true,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(request, accessToken, refreshToken, profile, done) {
    //console.log("request: ",request,"accessToken: ", accessToken,"refreshToken: ", refreshToken,"profile: ", profile)
    profile.accessToken = accessToken;
    return done(null, profile);
  }
));