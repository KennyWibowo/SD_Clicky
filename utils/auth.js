var passport = require("passport")
var LocalStrategy = require("passport-local").Strategy
var users = {"Swashbuckler":{password:"5678", id:1, type:"student", name:"Black beard", email:"pirates4lyfe@yohoho.com"},
"Ms.Smith":{password:"thisisapassword", id:2, type:"teacher", name:"Jenny Smith", email:"iamateacher@yohoho.com"}}
var currentid = 3;

//var bcrypt = require('bcrypt')

// bcrypt.genSalt(15, function(err, salt) {
// bcrypt.hash('')



// })

passport.use(new LocalStrategy
  (
	{
		session: true
	},
	function(req, username, password, done)
	{
		console.log(username, password)
		if (!users[username])
		{
			return done(null,false)
		}
		if (password == users[username].password)
		{
			return done(null, users[username], req.flash('success', "Now logged in"))
		}
		return done(null, false)

	}



  )

)

module.exports={
	registerUser:function(username, password, email, name, type, callback)
	{
		if(users[username])
		{
			var error = new Error("User already exists")
			return callback(error)
		}
		else
		{
			users[username]={"password":password, "id":currentid++, "type":type, "name":name, "email":email}
			console.log(users)
			return callback(null, username)
		}

	},
	
	ensureUserLoggedIn: function (req, res, next) {
        // not logged in test
        if( req.user ) {
            next();
        } 
        else 
        {
            req.flash('error', "You must be logged in to continue");
            res.redirect('/login');
        }
    },

    ensureUserIsTeacher:function(req, res, next)
    {
    	if(req.user && req.user.type == "teacher")
    	{
    		next();
    	}
    	else
    	{
    		req.flash('error', "You must be logged in as a teacher to continue");
            res.redirect('/login');
    	}
    }

     ensureUserIsStudent:function(req, res, next)
    {
    	if(req.user && req.user.type == "student")
    	{
    		next();
    	}
    	else
    	{
    		req.flash('error', "You must be logged in as a students to continue");
            res.redirect('/login');
    	}
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