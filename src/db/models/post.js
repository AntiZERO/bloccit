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

  return Post;
};