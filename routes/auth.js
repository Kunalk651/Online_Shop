const express = require("express");
const { check, body } = require("express-validator");
const authControllar = require("../controllers/auth");
const router = express.Router();
const User = require("../models/user");

router.get("/login", authControllar.getLogin);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter valid email address!")
      .normalizeEmail(),
    body("password", "invalid Password!")
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim()
  ],
  authControllar.postLogin
);

router.get("/signup", authControllar.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter valid email!")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email address is forbidden!");
        // }
        // return true;
        return User.findOne({ email: value }).then(isEmail => {
          if (isEmail) {
            return Promise.reject(
              "Email already exists, please pick different email."
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 6 characters!"
    )
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Confirm-Password have to match!");
        }
        return true;
      })
  ],
  authControllar.postSignup
);

router.post("/logout", authControllar.postLogout);

router.get("/reset", authControllar.getReset);

router.post("/reset", authControllar.postReset);

router.get("/reset/:token", authControllar.getNewPassword);

router.post("/new-password", authControllar.postNewPassword);

module.exports = router;
