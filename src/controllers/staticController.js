/*Will define and export an object that contains multiple functions. 
Each function will contain a handler for a particular route.*/

module.exports = {
  index(req, res, next) {
    res.render("static/index", {title: "Welcome to Bloccit"});
  }
}