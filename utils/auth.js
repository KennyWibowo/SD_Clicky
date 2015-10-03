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
		if (!users.username)
		{
			return done(null,false)
		}
		if (password == users.username.password)
		{
			return done(null, users.username)
		}
		return done(null, false)

	}



  )

)

module.exports={
	registerUser:function(username, password){
		users[username]={"password":password, "id":currentid++}
	}
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
	users.forEach(function(enter) {

		if (enter.id = id)
		{
			callback(enter);
			return enter
		}

		callback(null);
		return null

	})

}

passport.deserializeUser(function(id, done) {
  getUsersId(id, function (user) {
    done(err, user);
  })
})