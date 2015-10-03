var passport = require("passport")
var LocalStrategy = require("passport-local").Strategy
var users = {"Swashbuckler":{password:"5678", id:1, type:"student"}}
var currentid = 2;

//var bcrypt = require('bcrypt')

// bcrypt.genSalt(15, function(err, salt) {
// bcrypt.hash('')



// })

passport.use(new LocalStrategy
  (
	{
		session: true
	},
	function(username, password, done)
	{
		console.log(username, password)
		if (!users[username])
		{
			return done(null,false)
		}
		if (password == users[username].password)
		{
			return done(null, users[username])
		}
		return done(null, false)

	}



  )

)

module.exports={
	registerUser:function(username, password){
		users[username]={"password":password, "id":currentid++}
	},
	
	ensureUserLoggedIn: function (req, res, next) {
        // not logged in test
        if( req.user ) {
            next();
        } else {
            req.flash('error', "You must be logged in to continue");
            res.redirect('/login');
        }
    },
}

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

function getType(username)
{
	return users.username.type
}

function getUsersId(id, callback)
{
	for (enter in users) {

		if (enter.id = id)
		{
			callback(enter);
			return enter
		}

		callback(null);
		return null

	}

}

passport.deserializeUser(function(id, done) {
  getUsersId(id, function (user) {
    done(null,user);
  })
})