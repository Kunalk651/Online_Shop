module.exports = (req, res, next) => {
  if (!req.session.islogedin) {
    return res.redirect("/login");
  }
  next();
};
