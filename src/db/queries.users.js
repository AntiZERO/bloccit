// #1 - require user model and bcrypt library.
const User = require("./models").User;
const Post = require("./models").Post;
const Comment = require("./models").Comment;
const bcrypt = require("bcryptjs");

module.exports = {
// createUser takes an object with email, password, and passwordConfirmation properties, and a callback.
  createUser(newUser, callback){

// Use bcrypt to generate salt and pass that to hashSync hashing function with the password to hash.
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

// Store the hashed password in the database when we create the User object and return the user.
    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getUser(id, callback){
    // define a `result` object to hold the `user`, `posts`, and `comments` that
    // will be returned and request the `User` object from the database.
       let result = {};
       User.findById(id)
       .then((user) => {
    // If no user returns, return an error.
         if(!user) {
           callback(404);
         } else {
    // Otherwise, store the resulting user. 
           result["user"] = user;
    // Execute the scope on `Post` to get the last five posts made my the user.
           Post.scope({method: ["lastFiveFor", id]}).all()
           .then((posts) => {
    // we store the result in the `result` object.
             result["posts"] = posts;
    // Execute the scope on "Comment" to get the last five comments made by the user.
             Comment.scope({method: ["lastFiveFor", id]}).all()
             .then((comments) => {
    // Store the result as before and send the object to the callback.
               result["comments"] = comments;
               callback(null, result);
             })
             .catch((err) => {
               callback(err);
             })
           })
         }
       })
     }

}