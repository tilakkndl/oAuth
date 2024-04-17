const express = require('express');
const passport = require('passport');

const userModel = require("./userModel")

const router = express.Router();

router.get('/', (req, res) => {
    // Render the login page (login.ejs)
    res.render('login');
  });

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));

  router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
  }), (req, res) => {
    res.redirect('/dashboard');
  });

  router.get('/dashboard', async (req, res) => {
    if (!req.user) {
      return res.redirect('/');
    }
    const user = await userModel.findById(req.user.id);
    res.render('dashboard', { user });
  });

  router.get('/logout', function(req, res){
    req.logout(function(err){
      if(err) return next(err);
      res.redirect('/');
    });
});


module.exports = router