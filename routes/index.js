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

router.get('/studentInput', function(req, res) {
    res.render('studentInput', { user: req.user,
            error: req.flash('error'),
            warning: req.flash('warning'),
            info: req.flash('info'),
            success: req.flash('success')
        });
});

router.post('/teacherInput', function(req, res){
    console.dir(req.body);

})
router.get('/teacherInput', function(req, res) {
    res.render('teacherInput');
});

router.post('/login', passport.authenticate('local',
        {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
            session: true
        })
);

router.post('/studentInput', function(req, res) {
    req.flash('success', 'Submitted!');
    res.redirect('/studentInput');
})

router.post('/register', function (req, res, next)
    {
        if (req.body.username && req.body.name && req.body.email && req.body.password && req.body.password_conf)
        {
            if (req.body.password != req.body.password_conf)
            {
                req.flash('error', "Your passwords don't match ")
                res.redirect('/register')
            }
            else
            {
                auth.registerUser(req.body.username, req.body.password, req.body.email, req.body.name, req.body.type,
                function(err)
                {
                    if (err)
                    {
                        req.flash('error', err.message)
                        res.redirect('/register')
                    }
                })
            }
        }
        else
        {
            req.flash('error', "Please have an input for all of the entry boxes")
            res.redirect('/register')
        }

    });

module.exports = router;
