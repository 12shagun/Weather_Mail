const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const container = require('./container');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');



container.resolve(function (_,admin) {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/weather_app');
    //mongoose.connect(process.env.mlab_url);

    const app = SetupExpress();

    function SetupExpress() {
        const app = express();
        const server = http.createServer(app);
        server.listen(process.env.PORT || 3000,function () {
            console.log("Server started on port 3000!!!");
        });
        ConfigureExpress(app);

        //Setup Router
        const router = require('express-promise-router')();
        admin.SetRouting(router); 
        app.use(router);
    }

    function ConfigureExpress(app) {

        require('./passport/passport-google');


        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        
        
        
        app.use(session({
            secret: 'thisisasecretkey',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({ mongooseConnection: mongoose.connection })
        }))
        app.use(express.static(__dirname + '/public'));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());
        app.locals._ = _;
    }
});