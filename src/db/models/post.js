'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  Post.associate = function (models) {
    // associations can be defined here
    Post.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });

    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments"
    });

    Post.hasMany(models.Vote, {
      foreignKey: "postId",
      as: "votes"
    });

    Post.hasMany(models.Favorite, {
      foreignKey: "postId",
      as: "favorites"
    });

    Post.afterCreate((post, callback) => {
      return models.Favorite.create({
        userId: post.userId,
        postId: post.id
      });
    });

    Post.afterCreate((post, callback) => {
      return models.Vote.create({
        value: 1,
        postId: post.id,
        userId: post.userId
      });
    });

  };

  Post.prototype.getPoints = function () {

    // Check to see if the post has any votes. If not, return 0.
    if (!this.votes || this.votes.length === 0) return 0

    // If a post has votes, get a count of all values. Add those values
    // together and return the result. The `map` function transforms the 
    // array. `this.votes` is an array of `Vote` objects. `map` turns it
    // into an array of values. Finally, the reduce function goes over all
    // values, reducting them until one is left, the total.
    return this.votes
      .map((v) => { return v.value })
      .reduce((prev, next) => { return prev + next });
  };

  Post.prototype.hasUpvoteFor = function (userId, callback) {
    return this.getVotes({
      where: {
        userId: userId,
        postId: this.id,
        value: 1
      }
    })
      .then((votes) => {
        votes.length != 0 ? callback(true) : callback(false);
      });
  };

  Post.prototype.hasDownvoteFor = function (userId, callback) {
    return this.getVotes({
      where: {
        userId: userId,
        postId: this.id,
        value: -1
      }
    })
      .then((votes) => {
        votes.length != 0 ? callback(true) : callback(false);
      });
  };

  Post.prototype.getFavoriteFor = function (userId) {
    return this.favorites.find((favorite) => { return favorite.userId == userId });
  };

  // Define the scope by calling `addScope` on the model. `addscope` takes the
  // scope name as the first argument. The second argument can be an object
  // with the query or a function. Using a function in this case since the
  // `userId` will be variable.
  Post.addScope("lastFiveFor", (userId) => {
    // The function parameter returns the implemented query with the passed
    // in `userId`
    return {
      where: { userId: userId },
      // We set a `limit` which establishes the maximum number of records the
      // query will return. `order` tells Sequelize what attribute to sort by
      // and in which direction.
      limit: 5,
      order: [["createdAt", "DESC"]]
    }
  });

  return Post;
};