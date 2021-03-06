var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var passport = require('passport');
var auth = require('../utils/auth');
var utils = require('../utils/utils')
var thisclass;

/* GET home page. */
router.get('/', auth.ensureUserLoggedIn, function(req, res, next) {
    if (req.user.type == "student") {
        res.redirect('/studentProfile')
    } else if (req.user.type == "teacher") {
        res.redirect('/teacherAdmin')
    }
});

router.get('/login', function(req, res) {
    if (req.user) {
        req.flash('info', "You are already logged in");
        res.redirect('/');
    } else {
        console.log("not logged in!");
        res.render('login', {
            user: req.user,
            error: req.flash('error'),
            warning: req.flash('warning'),
            info: req.flash('info'),
            success: req.flash('success')
        });
    }
});
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    session: true
}));

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', "You have successfully logged out");
    res.redirect('/login');
});

router.get('/register', function(req, res) {
    res.render('register', {
        user: req.user,
        error: req.flash('error'),
        warning: req.flash('warning'),
        info: req.flash('info'),
        success: req.flash('success')
    });
})
router.post('/register', function(req, res, next) {
    if (req.body.username && req.body.name && req.body.email && req.body.password && req.body.password_conf) {
        if (req.body.password != req.body.password_conf) {
            req.flash('error', "Your passwords don't match ")
            res.redirect('/register')
        } else {
            auth.registerUser(req.body.username, req.body.password, req.body.email, req.body.name, "student", [], req.body.username,
                function(err, user) {
                    if (err) {
                        req.flash('error', err.message)
                        res.redirect('/register')
                    } else {
                        req.flash('success', "Account " + req.body.username + " sucessfully created")
                        res.redirect('/login')
                    }

                })
        }
    } else {
        req.flash('error', "Please have an input for all of the entry boxes")
        res.redirect('/register')
    }

});

router.get('/teachregister', function(req, res) {
    res.render('teachregister', {
        user: req.user,
        error: req.flash('error'),
        warning: req.flash('warning'),
        info: req.flash('info'),
        success: req.flash('success')
    });
})
router.post('/teachregister', function(req, res, next) {
    if (req.body.username && req.body.name && req.body.email && req.body.password && req.body.password_conf) {
        if (req.body.password != req.body.password_conf) {
            req.flash('error', "Your passwords don't match ")
            res.redirect('/teachregister')
        } else {
            auth.registerTeacher(req.body.username, req.body.password, req.body.email, req.body.name, "teacher", {}, [], req.body.username,
                function(err, user) {
                    if (err) {
                        req.flash('error', err.message)
                        res.redirect('/teachregister')
                    } else {
                        req.flash('success', "Account " + req.body.username + " sucessfully created")
                        res.redirect('/login')
                    }

                })
        }
    } else {
        req.flash('error', "Please have an input for all of the entry boxes")
        res.redirect('/teachregister')
    }

})

router.post("/lock-lecture", function(req, res) {
    /*if (!req.query.l) {
        req.flash('error', "Get outta hea");
        res.redirect(req.get('referer'));
    }
    if (!req.query.c) {
        req.flash('error', "Get outta hea");
        res.redirect(req.get('referer'));
    }

    var myclass = utils.getClassByName(req.query.c);
    
    if(!myclass) {
        req.flash('error', "You have no class");
        res.redirect(req.get('referer'));
    }

    var mylect = myclass.lectures[req.query.l];

    if(!myclass) {
        req.flash('error', "You have no lecture");
        res.redirect(req.get('referer'));
    }

    var truetest = req.body.locked == "Locked" ? true : false;

    mylect.locked = truetest;

    req.flash('success', "Lecture locked set to " + truetest);
    res.redirect(req.get('referer'));*/

})

router.get('/studentInput', auth.ensureUserLoggedIn, function(req, res) {

    if (!req.query.q) {
        req.flash('error', "Wrong Query");
    }

    if (!utils.getQuestion(req.query.q)) {
        req.flash('error', "No Such Class");
    }


    console.log("q is set to " + req.query.q);

    res.render('studentInput', {
        user: req.user,
        classes: getClassesOfUser(req.user),
        myclass: utils.getClass(req.query.q),
        query: req.query.q,
        error: req.flash('error'),
        warning: req.flash('warning'),
        info: req.flash('info'),
        success: req.flash('success')
    });
});

var prevAns;

router.post('/studentInput', function(req, res) {

    console.dir('Answer chosen is: ' + req.body.choice);

    if (req.body.choice) {

        req.flash('success', "Submitted");

        if (prevAns && prevAns != req.body.choice) {
            var question = utils.getQuestion(req.body.urlquery);
            question[req.body.choice].studentAnswered[req.user.usrname] = true;
            question[prevAns].studentAnswered[req.user.usrname] = false;
            prevAns = req.body.choice;
            console.dir(question);
        } else if (!prevAns) {
            var question = utils.getQuestion(req.body.urlquery);
            question[req.body.choice].studentAnswered[req.user.usrname] = true;
            prevAns = req.body.choice;
            console.dir(question);
        }


        res.redirect('/studentInput?q=' + req.body.urlquery);
    } else {
        req.flash('error', "Please pick an answer");
        res.redirect('/studentInput?q=' + req.body.urlquery);
    }

});

router.get("/classAdmin", auth.ensureUserLoggedIn, auth.ensureUserIsTeacher, function(req, res) {
    if (!req.query.c) {
        req.flash('error', 'Incorrect class page')
        res.redirect('/')
    }
    if (!utils.getClass(req.query.c)) {
        req.flash('error', 'Incorrect class page')
        res.redirect('/')
    }
    thisclass = utils.getClass(req.query.c);
    res.render('classAdmin', {
        classes: getClassesOfUser(req.user),
        user: req.user,
        myclass: utils.getClass(req.query.c),
        error: req.flash('error'),
        warning: req.flash('warning'),
        info: req.flash('info'),
        success: req.flash('success')
    })
})

router.get('/studentProfile', auth.ensureUserLoggedIn, auth.ensureUserIsStudent, function(req, res) {
    res.render('studentProfile', {
        user: req.user,
        classes: getClassesOfUser(req.user),
        error: req.flash('error'),
        warning: req.flash('warning'),
        info: req.flash('info'),
        success: req.flash('success')
    });
});

router.get('/teacherAdmin', auth.ensureUserLoggedIn, auth.ensureUserIsTeacher, function(req, res) {

    res.render('teacherAdmin', {
        classes: getClassesOfUser(req.user),
        user: req.user,
        error: req.flash('error'),
        warning: req.flash('warning'),
        info: req.flash('info'),
        success: req.flash('success')
    })
})

router.get('/questionGraph', function(req, res) {
    if (!req.query.q) {
        req.flash('error', "Wrong Query");
    }

    if (!utils.getQuestion(req.query.q)) {
        req.flash('error', "No Such Class");
    }

    console.log("q is set to " + req.query.q);

    res.render('questionGraph', {
        classes: getClassesOfUser(req.user),
        user: req.user,
        yVal: JSON.stringify(utils.createGraphData(req.query.q)),
        error: req.flash('error'),
        warning: req.flash('warning'),
        info: req.flash('info'),
        success: req.flash('success')
    });
});

router.get('/sampleAnalysis', function(req, res) {
    res.render('sampleAnalysis');
})

router.post('/teacher-classcreate', function(req, res) {
    if (!req.body.className || req.body.className == "") {
        req.flash('error', "Must Enter a Class name")
        res.redirect('/teacherAdmin')
    }
    var classes = utils.getAllClasses()
    for (var key in classes) {
        if (req.body.className == classes[key].name) {
            req.flash('error', "Class already exists")
            res.redirect('/teacherAdmin')
        }
    }

    utils.createClass(req.body.className, req.user);
    req.flash('success', "Class created!")
    res.redirect('/teacherAdmin')

});

router.post('/teacher-lecturecreate', function(req, res) {

    utils.lectureCreate(utils.getClassByName(req.query.c));
    req.flash('success', "Lecture created!")
    res.redirect(req.get('referer'))

});

router.post('/teacher-lecturecreate', function(req, res) {

    utils.lectureCreate(thisclass);
    req.flash('success', "Lecture created!")
    res.redirect(req.get('referer'))

});

router.post('/teacher-questioncreate', function(req, res) {

    utils.lectureCreate(thisclass);
    req.flash('success', "Lecture created!")
    res.redirect(req.get('referer'))

});



router.post('/teacher-studentadd', function(req, res) {
    
    utils.addStudent(utils.getClassByName(req.body.classAdd) , req.body.studentName);
    req.flash('success', "Student added!")
    res.redirect('/teacherAdmin')

});

router.get('/classPage', auth.ensureUserLoggedIn, function(req, res) {
    if (!req.query.c) {
        req.flash('error', "No such query!"),
            res.redirect('/')
    }

    if (!utils.getClass(req.query.c)) {
        req.flash('error', "Incorrect class!"),
            res.redirect('/')
    }

    console.log("c is set to " + req.query.c);
    res.render('classPage', {
        user: req.user,
        myclass: utils.getClass(req.query.c),
        classes: getClassesOfUser(req.user),
        error: req.flash('error'),
        warning: req.flash('warning'),
        info: req.flash('info'),
        success: req.flash('success')
    })
});

router.get('/teacherInput', function(req, res) {
    res.render('teacherInput');
});
router.post('/teacherInput', function(req, res) {
    console.dir(req.body);

});


function getClassesOfUser(user) {
    var classes = {};

    var allClasses = utils.getAllClasses();

    for (var i = 0; i < user.classes.length; i++) {
        var key = user.classes[i];
        classes[key] = allClasses[key];
    }

    return classes;
}

module.exports = router;
