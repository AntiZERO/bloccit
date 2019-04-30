// #1 - Import Passport  and the local strategy to use in our implementation. Import User model and helper module. 
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../db/models").User;
const authHelper = require("../auth/helpers");

module.exports = {
  init(app){

// #2 - Initialize passport and tell it to use sessions to keep track of authenticated users.
    app.use(passport.initialize());
    app.use(passport.session());

// #3 - Instruct Passport to use local strategy. Passport looks for properties called 'username' and 'password' in the body of the request by default, so we pass an option called `usernameField` to specify what proeprty to use instead.
    passport.use(new LocalStrategy({
      usernameField: "email"
    }, (email, password, done) => {
      User.findOne({
        where: { email }
      })
      .then((user) => {

// #4 - If no user is found with the provided email, or if the password provided doesn't match the one stored in the database, return an error message.
        if (!user || !authHelper.comparePass(password, user.password)) {
          return done(null, false, { message: "Invalid email or password" });
        }
// #5 - If everything went well, return the authenticated user.
        return done(null, user);
      })
    }));

// #6 - Take the authenticated user's ID and store it in the session.
    passport.serializeUser((user, callback) => {
      callback(null, user.id);
    });

// #7 - Take the ID stored in the session and returns the user associated with it.
    passport.deserializeUser((id, callback) => {
      User.findById(id)
      .then((user) => {
        callback(null, user);
      })
      .catch((err =>{
        callback(err, user);
      }))

    });
  }
}