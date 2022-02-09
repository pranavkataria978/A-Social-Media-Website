const req = require('express/lib/request');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const flash = require('connect-flash');

//authentication using passport
passport.use( new LocalStrategy({

        usernameField: 'email',
        passReqToCallback: true,
    
}
,
    function(req,email,password,done){

        //find user and establish identity

        User.findOne({email: email},function(err,user){

                if(err){

                    console.log(req);
                    req.flash('error',err);
                    return done(err);
                }


                if(!user || user.password != password){

                    req.flash('error','Invalid Username/Password');
                    return done(null,false);
                }


                return done(null,user);
        });


    }

));


// serializing user to decide which key to keep in the cookie -> encrypts the cookie

passport.serializeUser(function(user,done){

        done(null,user.id);
});

// deserializing the user from key in the cookie
passport.deserializeUser(function(id,done){

        User.findById(id,function(err,user){

                if(err){

                    console.log("Error in finding user ");
                    return done(err);

                }

                return done(null,user);
        });
});


passport.checkAuthentication = function(req,res,next){

    // checking if user is authenticated -> middleware


    if(req.isAuthenticated()){

        return next();
    }

    // if not signed in


    return res.redirect('/users/sign-in');


};


passport.setAuthenticatedUser = function(req,res,next){


    if(req.isAuthenticated()){

        // req.user contains current signed in user from session cookie -> sending this to locals for the views
        res.locals.user = req.user;
    }

    next();
};

module.exports = passport;


