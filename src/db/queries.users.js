// #1 - require user model and bcrypt library.
const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {
// #2 - createUser takes an object with email, password, and passwordConfirmation properties, and a callback.
  createUser(newUser, callback){

// #3 - Use bcray to generate salt and pass that to hashSync hashing function with the password to hash.
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

// #4 - Store the hashed password in the database when we create the User object and return the user.
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
  }

}