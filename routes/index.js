var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var passport = require('passport');
var auth = require('../utils/auth');

/* GET home page. */
router.get('/', auth.ensureUserLoggedIn, function(req, res, next) {
    res.render('login', { user: req.user,
            error: req.flash('error'),
            warning: req.flash('warning'),
            info: req.flash('info'),
            success: req.flash('success')
        });
});

router.get('/login', function(req, res){
    if(req.user) {
        req.flash('info', "You are already logged in");
        res.redirect('/derp');
    } else {
        console.log("not logged in!");
        res.render('login', { user: req.user,
            error: req.flash('error'),
            warning: req.flash('warning'),
            info: req.flash('info'),
            success: req.flash('success')
        });
    }
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', "You have successfully logged out");
    res.redirect('/login');
});

router.post('/login', passport.authenticate('local',
        {
            successRedirect: '/derp',
            failureRedirect: '/',
            failureFlash: true,
            session: true
        })
);

module.exports = router;
