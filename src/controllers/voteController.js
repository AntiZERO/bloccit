// load dependencies
const voteQueries = require("../db/queries.votes.js");

module.exports = {
  upvote(req, res, next) {

    // Check for signed-in user and if so, calls `createVote` method
    // passing the request as well as `1` to indicate it as an upvote.
    // If an error is returned a flash message is loaded. Otherwise
    // user is redirected to the referring page. 
    if (req.user) {
      voteQueries.createVote(req, 1, (err, vote) => {
        if (err) {
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });

      // If user is not signed in, a message is flashed and is redirected.
    } else {
      req.flash("notice", "You must be signed in to do that.")
      res.redirect(req.headers.referer);
    }
  },
  downvote(req, res, next) {

    if (req.user) {
      voteQueries.createVote(req, -1, (err, vote) => {
        if (err) {
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });
    } else {
      req.flash("notice", "You must be signed in to do that.")
      res.redirect(req.headers.referer);
    }
  }
}