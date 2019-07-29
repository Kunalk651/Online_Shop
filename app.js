const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const errorController = require("./controllers/errors");
const shopControllers = require("./controllers/shop");
const isAuth = require("./middleware/is-auth");
const User = require("./models/user");

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@e-shop-3t942.mongodb.net/${
  process.env.MONGO_DEFAULT_DATABASE
}?retryWrites=true&w=majority`;

const app = express();
const store = new mongoDBStore({
  uri: MONGO_URI,
  databaseName: "online-shop",
  collection: "sessions"
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    let currentDate = new Date().toISOString();
    let customizedDate = currentDate.replace(/:/g, "-");
    cb(null, customizedDate + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.islogedin;
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.post("/order-now", isAuth, shopControllers.postOrder);

app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/", require("./routes/shop"));
app.use("/admin", require("./routes/admin"));
app.use("/", require("./routes/auth"));

app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.redirect("/500");
  console.log(error);
  res.status(500).render("500", {
    pageTitle: "unexpected error",
    path: "/500",
    isAuthenticated: req.session.islogedin
  });
});

port = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(result => {
    console.log("Mongodb Connected...");
    app.listen(port, () => console.log("Server Started at Port: " + port));
  })
  .catch(err => console.log(err));
