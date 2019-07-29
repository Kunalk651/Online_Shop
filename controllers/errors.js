exports.get404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "error",
    path: "/404",
    isAuthenticated: req.session.islogedin
  });
};
exports.get500 = (req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "unexpected error",
    path: "/500",
    isAuthenticated: req.session.islogedin
  });
};
