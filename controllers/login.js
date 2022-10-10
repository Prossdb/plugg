const schemas = require('../models/schemas.js')
const bcrypt = require('bcrypt')
const passport = require("passport");
const validator = require("validator");
//const User = require("../models/User");

exports.getLogin = (req, res) => {
    res.render('login', {title: 'Login', loggedIn: false, error:null})
}

exports.getSignup = (req, res) => {
    res.render('new-acct', {title: 'New Account', loggedIn: false, error:null})
}

exports.getLogout = (req, res) => {
    req.session.destroy ()
    res.redirect('/')
}

exports.postLogin = async (req, res) => {
    let email = req.body.emailInput
    let pass = req.body.pwdInput
    let loginSuccess = false
    let sesh = req.session
    sesh.loggedIn = false
    console.log(pass)

    let users = schemas.users;
    let qry = {email:email};

    if (email !== '' && pass !== '' ) {
        let usersResult = await users.findOne(qry)
        .then( async(data) => {
            if (data) {
                let passResult = await bcrypt.compare(pass, data.pwd)
                .then((isMatch) => {
                    if (isMatch) {
                    sesh.loggedIn = true
                    loginSuccess = true 
                }
                }
                )
            }
        })


    }
    if (loginSuccess === true){
        res.redirect('/')
    } else {
        res.render('login', {title:'Login', loggedIn: false, error: 'Invalid Login'})
    }
}

    exports.postSignup = (req, res, next) => {
        const validationErrors = [];
        if (!validator.isEmail(req.body.email))
          validationErrors.push({ msg: "Please enter a valid email address." });
        if (!validator.isLength(req.body.password, { min: 8 }))
          validationErrors.push({
            msg: "Password must be at least 8 characters long",
          });
        if (req.body.password !== req.body.confirmPassword)
          validationErrors.push({ msg: "Passwords do not match" });
      
        if (validationErrors.length) {
          req.flash("errors", validationErrors);
          return res.redirect("../signup");
        }
        req.body.email = validator.normalizeEmail(req.body.email, {
          gmail_remove_dots: false,
        });
        const user = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
          });
        
          User.findOne(
            { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
            (err, existingUser) => {
              if (err) {
                return next(err);
              }
              if (existingUser) {
                req.flash("errors", {
                  msg: "Account with that email address or username already exists.",
                });
                return res.redirect("../signup");
              }
              user.save((err) => {
                if (err) {
                  return next(err);
                }
                req.logIn(user, (err) => {
                  if (err) {
                    return next(err);
                  }
                  res.redirect("/profile");
                });
              });
            }
          );
        };
