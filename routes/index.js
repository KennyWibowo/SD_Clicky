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
        res.redirect('/');
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

router.get('/register', function(req, res) {
    res.render('register', { user: req.user,
            error: req.flash('error'),
            warning: req.flash('warning'),
            info: req.flash('info'),
            success: req.flash('success')
        });
})

router.post('/login', passport.authenticate('local',
        {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
            session: true
        })
);

router.post('/register');

module.exports = router;
