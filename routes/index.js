var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var passport = require('passport');
var auth = require('../utils/auth')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/login', function(req, res) {
    if(req.user) {
        req.flash('info', "You are already logged in");
        res.redirect('/');
    } else {
        res.render('login', { user: req.user,
            error: req.flash('error'),
            warning: req.flash('warning'),
            info: req.flash('info'),
            success: req.flash('success')
        });
    }
});


router.post('/login', passport.authenticate('local',
        {
            successRedirect: '/derp',
            failureRedirect: '/login',
            failureFlash: true,
            session: true
        })
);

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', "You have successfully logged out");
    res.redirect('/login');
});

module.exports = router;
