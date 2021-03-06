const Post = require("./models").Post;
const Topic = require("./models").Topic;
const Comment = require("./models").Comment;
const User = require("./models").User;
const Vote = require("./models").Vote;
const Favorite = require("./models").Favorite;
const Authorizer = require("../policies/post.js");

module.exports = {

  addPost(newPost, callback) {
    return Post.create(newPost)
      .then((post) => {
        callback(null, post);
      })
      .catch((err) => {
        callback(err);
      })
  },

  getPost(id, callback) {
  // Pass an options object that sequelize uses when building the query. By passing
  // the include property, we are telling to to include all objects in the table
  // associated witht he model Comment and set them as a value to the property
  // comments. The nested include tells Sequelize that for each comment, also
  // include the associated User.
    return Post.findById(id, {
      include: [
        {model: Comment, as: "comments", include: [
            { model: User }
          ]}, { model: Vote, as: "votes"}, // eager load votes when `Post` is retrieved
                  { model: Favorite, as: "favorites"}
      ]
    })
      .then((post) => {
        callback(null, post);
      })
      .catch((err) => {
        callback(err);
      })
  },

  deletePost(req, callback) {
    return Post.findById(req.params.id)
      .then((post) => {
        const authorized = new Authorizer(req.user, post).destroy();

        if (authorized) {
          post.destroy()
            .then((deletedRecordsCount) => {
              callback(null, deletedRecordsCount);
            });

        } else {
          req.flash("notice", "You are not authorized to do that.")
          callback(401);
        }
      })
      .catch((err) => {
        callback(err);
      });
  },

  updatePost(req, updatedPost, callback) {
    return Post.findById(req.params.id)
      .then((post) => {
        if (!post) {
          return callback("Post not found");
        }

        const authorized = new Authorizer(req.user, post).update();

        if (authorized) {
          post.update(updatedPost, {
            fields: Object.keys(updatedPost)
          })
            .then(() => {
              callback(null, post);
            })
            .catch((err) => {
              callback(err);
            });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          callback("Forbidden");
        }
      });
  }

};