const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult} = require("express-validator");
const passport = require("passport");

// Bring in User model
let User = require("../models/user");

// Register Form
router.get("/register", function(req, res){
  res.render("register");
});

// Register Process
router.post("/register", [
  check("name", "Name is required").isLength({ min: 1 }),
  check("email", "Email is required").isLength({ min: 1 }),
  check("email", "Email is not valid").isEmail(),
  check("username", "Username is required").isLength({ min: 1 }),
  check("password", "Password is required").isLength({ min: 1 }),
  check("password2", "Please confirm password").custom((value, {req, loc, path}) => {
     if (value !== req.body.password) {
       throw new Error("Passwords don't match");
      } else { return value; }
    })
  ],
  function(req, res){

    const name = req.body.name
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      console.log("errors");
      res.render("register", {
        errors:errors
      });
    } else {
      let newUser = new User();
      newUser.name = req.body.name
      newUser.email = req.body.email
      newUser.username = req.body.username
      newUser.password = req.body.password

      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
          if(err){
            console.log(err);
          }
          newUser.password = hash;
          newUser.save(function(err){
            if(err){
              console.log(err);
              return;
            } else {
              req.flash("success", "You are now registered and can log in");
              res.redirect("/users/login");
            }
          });
        });
      });
    }
  });

// Login Form
router.get("/login", function(req, res){
  res.render("login");
});

// Login Process
router.post("/login", function(req, res, next){
  passport.authenticate("local", {
    successRedirect:"/",
    faliureRedirect:"/users/login",
    faliureFlash: true
  })(req, res, next);
});

// Logout
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged out");
  res.redirect("/users/login");
})


module.exports = router;
