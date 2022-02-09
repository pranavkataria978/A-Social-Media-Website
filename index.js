const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const sass = require('node-sass');
const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');
const Noty = require('noty');

app.use(sassMiddleware({

    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.urlencoded());

app.use(cookieParser());

app.use(expressLayouts);
// extract style and scripts from sub pages into layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


app.use(express.static('./assets'));



//view engine setup
app.set('view engine','ejs');
app.set('views','./views');

// mongo stores is used to store session cookie in database

app.use(session({

    name: 'Social Media',
    // change secret before deployment in production
    secret: 'something',
    saveUninitialized: false,
    //When session not logged in -> extra data in cookie -> false;
    resave: false,
    cookie:{
        maxAge: (1000*60*100)
    }
    ,
    store: new MongoStore({

        mongoUrl: 'mongodb://localhost:27017',
        autoRemove: 'disabled'
    }, function(err){

        console.log(err || " connect-mongodb setup ok");
    })
}));






app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);


app.use(flash());
app.use(customMiddleware.setFlash);



app.use('/',require('./routes'));



app.listen(port,function(err){

    if(err){

        console.log(`Error in running the server : ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});

