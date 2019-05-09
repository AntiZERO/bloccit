const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {
  signUp(req, res, next) {
    res.render("users/sign_up");
  },

  create(req, res, next) {
  
    let newUser = {
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        })
      }
    }); 
  },

  signInForm(req, res, next) {
    res.render("users/sign_in");
  },

  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function () {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  show(req, res, next){

    // call the getUser method, passing it the 
    // ID of a specific user to be located and displayed.
     userQueries.getUser(req.params.id, (err, result) => {
 
    // If the `user` property of `result` is not defined, that means no
    // user was was found matching the passed in ID.
       if(err || result.user === undefined){
         req.flash("notice", "No user found with that ID.");
         res.redirect("/");
       } else {
 
    // If the request is successfully handled, render the view and pass in
    // the unpacked object.
         res.render("users/show", {...result});
       }
     });
   }

}

