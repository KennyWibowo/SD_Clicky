var passport = require("passport")
var LocalStrategy = require("passport-local").Strategy
var users = {
    "Swashbuckler": {
        password: "5678",
        id: 1,
        type: "student",
        name: "Black beard",
        email: "pirates4lyfe@yohoho.com"
    },
    "Ms.Smith": {
        password: "thisisapassword",
        id: 2,
        type: "teacher",
        name: "Jenny Smith",
        email: "iamateacher@yohoho.com",
        classes: [1]
    }
}
var currentid = 3;

//var bcrypt = require('bcrypt')

// bcrypt.genSalt(15, function(err, salt) {
// bcrypt.hash('')



// })

passport.use(new LocalStrategy({
            session: true,
            passReqToCallback: true
        },
        function(req, username, password, done) {
            console.log(req)

            if (users[username] && password == users[username].password) {
                return done(null, users[username], req.flash('success', "Now logged in"))
            }
            return done(null, false, req.flash('error', "Invalid Username and/or password"))

        }



    )

)

module.exports = {
    registerUser: function(username, password, email, name, type, callback) {
        if (users[username]) {
            var error = new Error("User already exists")
            return callback(error)
        } else {
            users[username] = {
                "password": password,
                "id": currentid++,
                "type": type,
                "name": name,
                "email": email
            }
            console.log(users)
            return callback(null, username)
        }

    },

    registerTeacher: function(username, password, email, name, type, pupils, callback) {
        if (users[username]) {
            var error = new Error("User already exists")
            return callback(error)
        } else {
            users[username] = {
                "password": password,
                "id": currentid++,
                "type": type,
                "name": name,
                "email": email,
                "pupils": pupils
            }
            console.log(users)
            return callback(null, username)
        }

    },

    ensureUserLoggedIn: function(req, res, next) {
        // not logged in test
        if (req.user) {
            next();
        } else {
            req.flash('error', "You must be logged in to continue");
            res.redirect('/login');
        }
    },

    ensureUserIsTeacher: function(req, res, next) {
        console.log("hi")
        if (req.user && req.user.type == "teacher") {
            next();
        } else {
            req.flash('error', "You must be logged in as a teacher to continue");
            res.redirect('/');
        }
    },

    ensureUserIsStudent: function(req, res, next) {
        console.log(req.user.type)
        if (req.user && req.user.type == "student") {
            next();
        } else {
            req.flash('error', "You must be logged in as a student to continue");
            res.redirect('/');
        }
    }
}

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

function getType(username) {
    return users[username].type
}

function getName(username) {
    return users[username].name
}

function getUsersId(id, callback) {
    for (enter in users) {

        if (users[enter].id == id) {
            callback(users[enter])
            console.log(users[enter])
            return enter
        }

    }

    callback(null)
    return null

}

passport.deserializeUser(function(id, done) {
    getUsersId(id, function(user) {
        done(null, user)
    })
})
